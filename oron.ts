// code below heavily based upon https://blog.scottlogic.com/2017/05/02/typescript-compiler-api-revisited.html
import * as ts from "typescript";
import { writeFileSync, readdirSync, readFileSync } from "fs";

const [_0, _1, sourceCodeFile, analysisFile, outputFile] = process.argv; // only capture 3 args

if (!(sourceCodeFile && analysisFile && outputFile)) {
  console.error("Oron requires 3 args: <input> <analysis> <outputfile>");
  console.info("For more, visit https://github.com/aaronmunsters/Oron");
  process.exit();
}

const asTypeDefinitions = __dirname + "/dependancies/oron/typedefs.d.ts";
const stdLib = readdirSync(
  __dirname + "/node_modules/assemblyscript/std/assembly"
).filter((filename) => filename.endsWith("ts"));

function partOfAssemblyScriptStdLib(s: string) {
  return s === "Math"; // This can be expanded with the full library
}

const analysisProgram = ts.createProgram(
  [asTypeDefinitions, analysisFile].concat(stdLib),
  {}
);

const analysisSourceFile = analysisProgram.getSourceFile(analysisFile);

interface AnalysesisDef {
  className: string;
  classInstance: ts.Identifier;
  methods: string[];
  oronShouldAdd: boolean;
}

const analysisDefinitions: AnalysesisDef = {
  className: "",
  classInstance: null,
  methods: [],
  oronShouldAdd: false,
};

const functionCallArgs = new Set<number>();
const functionVoidCallArgs = new Set<number>();

function initAnalysis(node: ts.Node) {
  /** Determine wheter @param n is a class instance extending OronAnalysis
   *
   * In case the analysis includes an extension of the class, all
   * implemented methods (which would define the respective trap)
   * are added to a list. In case the class has been instantiated
   * Oron will not do this manually and traps will refer to this
   * instance. If not, Oron will also instantiate the class.
   */
  function determineAnalysisSpec(n: ts.Node) {
    if (
      ts.isClassDeclaration(n) &&
      (n as ts.ClassDeclaration).heritageClauses &&
      (n as ts.ClassDeclaration).heritageClauses.some(
        (hc) =>
          hc.token === ts.SyntaxKind.ExtendsKeyword && // whether or not this implements Oron
          hc.types.some(
            (type) =>
              ts.isIdentifier(type.expression) &&
              (<ts.Identifier>type.expression).text === "OronAnalysis" // Class to extend
          )
      )
    ) {
      analysisDefinitions.className = n.name.text;
      /* Upon reaching this code, it is known this is a class implementing the Oron analysis */
      n.forEachChild((n) => {
        if (ts.isMethodDeclaration(n) && ts.isIdentifier(n.name)) {
          analysisDefinitions.methods.push(n.name.text); // add to "implemented" analyses
        }
      });
    } else if (ts.isVariableStatement(n)) {
      n.declarationList.declarations.forEach((decl) => {
        const init = decl.initializer;
        /* Not all variables might have been initialized */
        if (init && ts.isNewExpression(init)) {
          let exp = (<ts.NewExpression>init).expression;
          if (ts.isIdentifier(exp)) {
            if (exp.text === analysisDefinitions.className) {
              if (ts.isIdentifier(decl.name)) {
                /* The analysis developer has included their own instance of the analysis */
                analysisDefinitions.classInstance = decl.name;
              }
            }
          }
        }
      });
    }
  }

  /* Expected source code, look in every statent for class */
  ts.forEachChild(node, determineAnalysisSpec);
  if (!analysisDefinitions.classInstance) {
    analysisDefinitions.classInstance = ts.createIdentifier("myAnalysis");
    analysisDefinitions.oronShouldAdd = true;
  }
}

initAnalysis(analysisSourceFile);

const program = ts.createProgram([asTypeDefinitions, sourceCodeFile], {});
const typechecker: ts.TypeChecker = program.getTypeChecker();
const printer: ts.Printer = ts.createPrinter();
const sourceFile: ts.SourceFile = program.getSourceFile(sourceCodeFile);

const getTypeNode: (n: ts.Node) => ts.TypeNode = (n: ts.Node) =>
  typechecker.typeToTypeNode(typechecker.getTypeAtLocation(n));

const createStringLiteral: (s: string) => ts.StringLiteral = (s: string) =>
  ts.createLiteral(ts.createStringLiteral(s));

function isShortHandAssignmentToken(token: ts.BinaryOperatorToken) {
  return [
    ts.SyntaxKind.BarEqualsToken,
    ts.SyntaxKind.PlusEqualsToken,
    ts.SyntaxKind.SlashEqualsToken,
    ts.SyntaxKind.CaretEqualsToken,
    ts.SyntaxKind.MinusEqualsToken,
    ts.SyntaxKind.PercentEqualsToken,
    ts.SyntaxKind.AmpersandEqualsToken,
    ts.SyntaxKind.ExclamationEqualsToken,
    ts.SyntaxKind.AsteriskAsteriskEqualsToken,
    ts.SyntaxKind.LessThanLessThanEqualsToken,
    ts.SyntaxKind.GreaterThanGreaterThanEqualsToken,
    ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken,
  ].some((t) => t === token.kind);
}

function isAssignmentToken(node: ts.BinaryOperatorToken): boolean {
  return (
    isShortHandAssignmentToken(node) || node.kind === ts.SyntaxKind.EqualsToken
  );
}

function analysisDefined(m: string): boolean {
  return analysisDefinitions.methods.some((v) => v === m);
}

function isLeftOfAssignment(node: ts.PropertyAccessExpression): boolean {
  return (
    ts.isBinaryExpression(node.parent) &&
    isAssignmentToken(node.parent.operatorToken) &&
    node.parent.left === node
  );
}

const transformer = <T extends ts.Node>(context: ts.TransformationContext) => (
  rootNode: T
) => {
  function visit(node: ts.Node): ts.Node {
    if (
      analysisDefined("propertyAccess") &&
      ts.isPropertyAccessExpression(node) &&
      !isLeftOfAssignment(node) &&
      !ts.isCallExpression(node.parent)
    ) {
      const propAccessExpr = node as ts.PropertyAccessExpression;

      const objT = typechecker.getTypeAtLocation(propAccessExpr.expression);
      const retT = typechecker.getTypeAtLocation(propAccessExpr.name);

      const objTn: ts.TypeNode = typechecker.typeToTypeNode(objT); // getTypeNode(propAccessExpr.expression);
      const retTn: ts.TypeNode = typechecker.typeToTypeNode(retT); // getTypeNode(propAccessExpr.name);

      if (
        ["IMath", "INativeMath", "INativeMath", "IMath", "IMath"].some(
          (native) =>
            typechecker.typeToString(retT).includes(native) ||
            typechecker.typeToString(objT).includes(native)
        )
      ) {
        // Case in which native libraries such as IMath are accessed for a constant such as PI
        return ts.visitEachChild(node, visit, context);
      }

      if (
        ts.isTypeReferenceNode(objTn) &&
        ts.isIdentifier(objTn.typeName) &&
        partOfAssemblyScriptStdLib(objTn.typeName.text)
      ) {
        return ts.visitEachChild(node, visit, context); // do not further instrument, part standard library
      }

      if (
        typechecker.typeToString(objT).startsWith("StaticArray") &&
        propAccessExpr.name.text === "length"
      ) {
        // Reading the length of a static array is accessing it's static header, differs from a read
        return ts.visitEachChild(node, visit, context); // do not further instrument, part standard library
      }

      // A check should be performed whenever the type is a compound structure
      // As compount types such as "StaticArray<i32>" are currently still resolved

      const retString =
        typechecker.typeToString(objT).endsWith("[]") &&
        propAccessExpr.name.text === "length"
          ? createStringLiteral("length_")
          : createStringLiteral(propAccessExpr.name.text);

      // obj.prop
      // ==TRANSFORM==>
      // getTrap<ObjClass, PropType>(obj, "prop", offsetof<ObjClass>("prop"))
      return ts.createCall(
        ts.createPropertyAccess(
          analysisDefinitions.classInstance,
          ts.createIdentifier("propertyAccess")
        ),
        [objTn, retTn],
        [
          ts.visitEachChild(propAccessExpr.expression, visit, context),
          retString,
          ts.createCall(ts.createIdentifier("offsetof"), [objTn], [retString]),
        ]
      );
    }

    if (ts.isBinaryExpression(node)) {
      const binExp = node as ts.BinaryExpression;
      if (
        // these two tests evaluate whether this is property assignment
        //  however expressions such as object.age++ are not included in this method
        binExp.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
        ts.isPropertyAccessExpression(binExp.left)
      ) {
        if (!analysisDefined("propertySet"))
          return ts.visitEachChild(node, visit, context);

        const propAccessExpr = binExp.left as ts.PropertyAccessExpression;
        const objTn = typechecker.typeToTypeNode(
          typechecker.getTypeAtLocation(propAccessExpr.expression)
        );
        const retTn = typechecker.typeToTypeNode(
          typechecker.getTypeAtLocation(propAccessExpr)
        );
        const objT = typechecker.getTypeAtLocation(propAccessExpr.expression);
        const retT = typechecker.getTypeAtLocation(propAccessExpr);

        if (
          typechecker.typeToString(retT) === "any" ||
          typechecker.typeToString(objT) === "any"
        ) {
          const inputText = readFileSync(sourceCodeFile, "utf8");
          const lineNr = inputText.substring(0, node.getStart() + 1).split("\n")
            .length;
          inputText.split("\n");
          console.error(`
          ERROR: cannot resolve type, source-code: ${sourceCodeFile} on line ${lineNr} , analysis: ${analysisFile} => ${node.getText()}
          `);
          return ts.visitEachChild(node, visit, context);
        }

        const retString = createStringLiteral(propAccessExpr.name.text);
        const val = binExp.right;

        // obj.prop = val
        // ==TRANSFORM==>
        // setTrap<ObjClass, PropType>(obj, val, "prop", offsetof<ObjClass>("prop"))
        return ts.createCall(
          ts.createPropertyAccess(
            analysisDefinitions.classInstance,
            ts.createIdentifier("propertySet")
          ),
          [objTn, retTn],
          [
            ts.visitEachChild(propAccessExpr.expression, visit, context),
            val,
            retString,
            ts.createCall(
              ts.createIdentifier("offsetof"),
              [objTn],
              [retString]
            ),
          ]
        );
      }
    }

    if (
      (analysisDefined("genericApply") ||
        analysisDefined("genericPostApply")) &&
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression)
    ) {
      if (
        node.typeArguments ===
        undefined /* currently only support function without type args */
      ) {
        // funcCall(arg1, arg2);
        // ==TRANSFORM==>
        // (function (arg1: Typ1, arg2: Typ2){...cast function to pointer...; ...wrap args in ADT...; return apply2args(funcCallPointer, argsADT);})(arg1, arg2);
        const args = node.arguments;

        const declaration = typechecker.getResolvedSignature(node).declaration;

        if (declaration) {
          const funcInTypes: ts.Type[] = (declaration.parameters as ts.NodeArray<
            ts.ParameterDeclaration
          >).map((par) => typechecker.getTypeFromTypeNode(par.type));

          const nodeToRuntimeType = (index: number) => {
            const typeStr = typechecker.typeToString(funcInTypes[index]);
            switch (typeStr) {
              case "bool":
                return "boolean";
              case "i32":
              case "u32":
              case "i64":
              case "u64":
              case "f32":
              case "f64":
              case "v128":
              case "i8":
              case "u8":
              case "i16":
              case "u16":
              case "isize":
              case "usize":
              case "void":
              case "anyref":
              case "number":
              case "boolean":
                return typeStr;
              default:
                return "classInstance";
            }
          };

          const returnTypeNode = getTypeNode(node);
          const returnType = typechecker.getTypeAtLocation(node);

          const hasExplicitReturnType =
            typechecker.typeToString(returnType) !== "void";

          (hasExplicitReturnType ? functionCallArgs : functionVoidCallArgs).add(
            args.length // call to exact matching function will be added later
          );

          const typeArgs = (hasExplicitReturnType
            ? [returnTypeNode]
            : []
          ).concat(
            ...funcInTypes.map((type) => typechecker.typeToTypeNode(type))
          );

          const oronGuideFunctionName = hasExplicitReturnType // name of effective call to trap
            ? ts.createIdentifier(`apply${args.length}Args`)
            : ts.createIdentifier(`apply${args.length}ArgsVoid`);

          const returnRuntimeType = (idx) =>
            ts.createPropertyAccess(
              ts.createIdentifier("Types"),
              nodeToRuntimeType(idx)
            );

          const returnClassid = (idx) =>
            nodeToRuntimeType(idx) === "classInstance"
              ? ts.createCall(
                  ts.createIdentifier("idof"),
                  [typechecker.typeToTypeNode(funcInTypes[idx])],
                  []
                )
              : ts.createNumericLiteral("0");

          const extraArgs = [];

          args.forEach((val, idx) =>
            extraArgs.push(
              ...[
                ts.visitNode(val, visit), // further instrument args
                returnRuntimeType(idx),
                returnClassid(idx),
              ]
            )
          );

          return ts.createCall(oronGuideFunctionName, typeArgs, [
            ts.createStringLiteral(
              ts.isIdentifier(node.expression)
                ? node.expression.text
                : node.getText()
            ),
            ts.createCall(
              ts.createIdentifier("changetype"),
              [ts.createTypeReferenceNode("usize", [])],
              [node.expression]
            ),
            ...extraArgs,
          ]);
        }
      }
      // else unable to resolve function signature, such as "assert"
    }

    return ts.visitEachChild(node, visit, context);
  }
  return ts.visitNode(rootNode, visit);
};

// Perform transformation
const result = ts.transform(sourceFile, [transformer]);
const transformedSourceFile = result.transformed[0];

/* For every function call keep track of amount of arguments,
 * for every amount, create generic apply */

function idxFillGappedString(amount: number, str: string, join: string) {
  return Array(amount)
    .fill(str)
    .map((toFormat, idx) => toFormat.replace(/\$/g, `${idx}`))
    .join(join);
}

const applyArgsFuncs = [];
functionCallArgs.forEach((amt) => {
  const funcSignature = idxFillGappedString(amt, "in$: In$", ",");
  applyArgsFuncs.push(
    `
function apply${amt}Args<RetType,${idxFillGappedString(amt, "In$", ",")}>(
  fname: string,
  fptr: usize,
  ${idxFillGappedString(amt, "arg$: In$, typ$: Types, classId$: u32", ",")}
): RetType {
  ${
    analysisDefined("genericApply")
      ? `
      ${idxFillGappedString(
        amt,
        "globalBuffer.setArgument<In$>($, typ$, arg$, classId$);",
        "\n"
      )}
      ${
        analysisDefinitions.classInstance.text
      }.genericApply(fname, fptr, globalBuffer, ${amt});
      `
      : null
  }
  
  const func: (${funcSignature}) => RetType = changetype<(${funcSignature})=> RetType>(fptr);
  const res: RetType = func(${idxFillGappedString(
    amt,
    "arg$",
    // "globalBuffer.getArgument<In$>($)",
    ","
  )});
  ${
    analysisDefined("genericPostApply")
      ? `
      ${idxFillGappedString(
        amt,
        "globalBuffer.setArgument<In$>($, typ$, arg$, classId$);",
        "\n"
      )}
      return myAnalysis.genericPostApply<RetType>(fname, fptr, globalBuffer, ${amt}, res);
      `
      : "return res"
  }
  
}
`
  );
});

functionVoidCallArgs.forEach((amt) => {
  const funcSignature = idxFillGappedString(amt, "in$: In$", ",");
  applyArgsFuncs.push(
    `
function apply${amt}ArgsVoid${
      (amt > 0 ? "<" : "") +
      idxFillGappedString(amt, "In$", ",") +
      (amt > 0 ? ">" : "")
    }(
  fname: string,
  fptr: usize,
  ${idxFillGappedString(amt, "arg$: In$, typ$: Types, classId$: u32", ",")}
): void {
  ${
    analysisDefined("genericApply")
      ? `
      ${idxFillGappedString(
        amt,
        "globalBuffer.setArgument<In$>($, typ$, arg$, classId$);",
        "\n"
      )}
      ${
        analysisDefinitions.classInstance.text
      }.genericApply(fname, fptr, globalBuffer, ${amt});
      `
      : null
  }
  const func: (${funcSignature}) => void = changetype<(${funcSignature})=> void>(fptr);
  func(${idxFillGappedString(
    amt,
    "arg$" /* "globalBuffer.getArgument<In$>($)" */,
    ","
  )})
  ${
    analysisDefined("genericPostApply")
      ? `
      ${idxFillGappedString(
        amt,
        "globalBuffer.setArgument<In$>($, typ$, arg$, classId$);",
        "\n"
      )}
      myAnalysis.genericPostApply<OronVoid>(fname, fptr, globalBuffer, ${amt}, new OronVoid());
      `
      : null
  }
}
`
  );
});

let maxArgs = 0;
functionCallArgs.forEach((val) => (maxArgs = Math.max(maxArgs, val)));
functionVoidCallArgs.forEach((val) => (maxArgs = Math.max(maxArgs, val)));

const endResult =
  analysisSourceFile.text +
  (analysisDefinitions.oronShouldAdd
    ? `\nconst ${analysisDefinitions.classInstance.text} = new ${
        analysisDefinitions.className
      }();\n ${
        analysisDefined("genericApply") || analysisDefined("genericPostApply")
          ? `const globalBuffer = new ArgsBuffer(${maxArgs}, ${
              maxArgs * 16 // max arg size, type v128
            });\n`
          : ""
      }`
    : "") +
  applyArgsFuncs.join("\n") +
  printer.printNode(null, transformedSourceFile, sourceFile);

writeFileSync(outputFile, endResult);
