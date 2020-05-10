// code below heavily based upon
// https://blog.scottlogic.com/2017/05/02/typescript-compiler-api-revisited.html
import * as ts from "typescript";
import { writeFileSync, appendFileSync } from "fs";

const [sourceCodeFile, analysisFile, outputFile] = process.argv.slice(2); // only capture 3 args
const asTypeDefinitions = "orondefaults/typedefs/typedefs.d.ts"; // empty file containing type-definitions

const analysisProgram = ts.createProgram([asTypeDefinitions, analysisFile], {});
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
const sourceFile: ts.SourceFile = program.getSourceFile("./assembly/index.ts");

const getTypeNode: (n: ts.Node) => ts.TypeNode = (n: ts.Node) =>
  typechecker.typeToTypeNode(typechecker.getTypeAtLocation(n));

const createStringLiteral: (s: string) => ts.StringLiteral = (s: string) =>
  ts.createLiteral(ts.createStringLiteral(s));

function analysisDefined(m: string): boolean {
  return analysisDefinitions.methods.some((v) => v === m);
}

const transformer = <T extends ts.Node>(context: ts.TransformationContext) => (
  rootNode: T
) => {
  function visit(node: ts.Node): ts.Node {
    if (
      analysisDefined("propertyAccess") &&
      ts.isPropertyAccessExpression(node)
    ) {
      const propAccessExpr = node as ts.PropertyAccessExpression;
      const objTn = getTypeNode(propAccessExpr.expression);
      const retTn = getTypeNode(propAccessExpr.name);
      const retString = createStringLiteral(propAccessExpr.name.text);

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
          propAccessExpr.expression,
          retString,
          ts.createCall(ts.createIdentifier("offsetof"), [objTn], [retString]),
        ]
      );
    }
    if (analysisDefined("propertySet") && ts.isBinaryExpression(node)) {
      const binExp = node as ts.BinaryExpression;
      if (
        // these two tests evaluate whether this is property assignment
        //  however expressions such as aaron.age++ are not included in this method
        binExp.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
        ts.isPropertyAccessExpression(binExp.left)
      ) {
        const propAccessExpr = binExp.left as ts.PropertyAccessExpression;
        const objTn = getTypeNode(propAccessExpr.expression);
        const retTn = getTypeNode(propAccessExpr.name);
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
            propAccessExpr.expression,
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

    if (analysisDefined("genericApply") && ts.isCallExpression(node)) {
      if (
        node.typeArguments ===
        undefined /* currently only support function with out type args */
      ) {
        // funcCall(arg1, arg2, arg3);
        // ==TRANSFORM==>
        // (function (arg1: Typ1, arg2: Typ2){...cast function to pointer...; ...wrap args in ADT...; return apply2args(funcCallPointer, argsADT);})(arg1, arg2);
        const args = node.arguments;
        functionCallArgs.add(args.length);
        const argsIdentifier = ts.createIdentifier(`args`);

        const funcInTypes = (typechecker.getResolvedSignature(node).declaration
          .parameters as ts.NodeArray<ts.ParameterDeclaration>).map((par) =>
          typechecker.getTypeFromTypeNode(par.type)
        );

        /* create arguments ADT */
        const argsCreation = ts.createVariableStatement(
          undefined,
          ts.createVariableDeclarationList([
            ts.createVariableDeclaration(
              argsIdentifier /* variable name */,
              undefined,
              ts.createNew(ts.createIdentifier("ArgsBuffer"), undefined, [
                ts.createArrayLiteral(
                  args.map((arg, index) =>
                    ts.createCall(
                      ts.createIdentifier("sizeof"),
                      [typechecker.typeToTypeNode(funcInTypes[index])],
                      []
                    )
                  )
                ),
              ])
            ),
          ])
        );

        const nodeToRuntimeType = (index: number) => {
          const typeStr = typechecker.typeToString(funcInTypes[index]);
          switch (typeStr) {
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
            case "bool":
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

        const argSetters = args.map((arg, index) => {
          const classid =
            nodeToRuntimeType(index) === "classInstance"
              ? ts.createCall(
                  ts.createIdentifier("idof"),
                  [typechecker.typeToTypeNode(funcInTypes[index])],
                  []
                )
              : ts.createNumericLiteral("0");
          return ts.createExpressionStatement(
            ts.createCall(
              ts.createPropertyAccess(argsIdentifier, "setArgument"),
              [typechecker.typeToTypeNode(funcInTypes[index])],
              [
                ts.createNumericLiteral(`${index}`),
                ts.createPropertyAccess(
                  ts.createIdentifier("Types"),

                  nodeToRuntimeType(index)
                ),
                ts.createIdentifier(`arg${index}`),
                classid,
              ]
            )
          );
        });

        const effectiveCallTrap = ts.createReturn(
          ts.createCall(
            ts.createIdentifier(`apply${args.length}Args`),
            [
              getTypeNode(node),
              ...funcInTypes.map((type) => typechecker.typeToTypeNode(type)),
            ],
            [
              ts.createStringLiteral(
                ts.isIdentifier(node.expression)
                  ? node.expression.text
                  : "no direct function name, expression evaluating to function"
              ),
              ts.createCall(
                ts.createIdentifier("changetype"),
                [ts.createTypeReferenceNode("usize", [])],
                [node.expression]
              ),
              argsIdentifier,
            ]
          )
        );

        const argsToPars = (node: ts.Expression, index: number) => {
          return ts.createParameter(
            undefined,
            undefined,
            undefined,
            `arg${index}`,
            undefined,
            typechecker.typeToTypeNode(funcInTypes[index])
          );
        };

        return ts.createCall(
          ts.createFunctionExpression(
            undefined,
            undefined,
            undefined,
            undefined,
            node.arguments.map(argsToPars),
            getTypeNode(node),
            ts.createBlock([argsCreation, ...argSetters, effectiveCallTrap])
          ),
          undefined,
          node.arguments
        );
      }
    }
    return ts.visitEachChild(node, visit, context);
  }
  return ts.visitNode(rootNode, visit);
};

// Perform transformation
const result = ts.transform(sourceFile, [transformer]);

/* For every function call keep track of amount of arguments,
 * for every amount, create generic apply */

function idxFillGappedString(amount: number, str: string) {
  return Array(amount)
    .fill(str)
    .map((toFormat, idx) => toFormat.replace(/\$/g, `${idx}`))
    .join(",");
}

const applyArgsFuncs = [];
functionCallArgs.forEach((amt) => {
  const funcSignature = idxFillGappedString(amt, "in$: In$");
  applyArgsFuncs.push(
    `
function apply${amt}Args<RetType,${idxFillGappedString(amt, "In$")}>(
  fname: string,
  fptr: usize,
  argsBuff: ArgsBuffer,
): RetType {
  ${analysisDefinitions.classInstance.text}.genericApply(fname, fptr, argsBuff);
  const func: (${funcSignature}) => RetType = changetype<(${funcSignature})=> RetType>(fptr);
  return func(${idxFillGappedString(amt, "argsBuff.getArgument<In$>($)")})
}
`
  );
});

const transformedSourceFile = result.transformed[0];

const endResult =
  analysisSourceFile.text +
  (analysisDefinitions.oronShouldAdd
    ? `\nconst ${analysisDefinitions.classInstance.text} = new ${analysisDefinitions.className}();\n`
    : "") +
  applyArgsFuncs.join("\n") +
  printer.printNode(null, transformedSourceFile, sourceFile);

writeFileSync(outputFile, endResult);
