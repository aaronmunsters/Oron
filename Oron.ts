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
}

const analysisDefinitions: AnalysesisDef = {
  className: "",
  classInstance: null,
  methods: [],
};

const functionCallArgs = new Set<number>();

function initAnalysis(node: ts.Node) {
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
        if (ts.isNewExpression(init)) {
          let exp = (<ts.NewExpression>init).expression;
          if (ts.isIdentifier(exp)) {
            if (exp.text === analysisDefinitions.className) {
              if (ts.isIdentifier(decl.name)) {
                analysisDefinitions.classInstance = decl.name;
              }
            }
          }
        }
      });
    }
  }
  ts.forEachChild(node, determineAnalysisSpec);
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

let clashCtr = 0;

const transformer = <T extends ts.Node>(context: ts.TransformationContext) => (
  rootNode: T
) => {
  function visit(node: ts.Node): ts.Node {
    if (ts.isPropertyAccessExpression(node)) {
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
    if (ts.isBinaryExpression(node)) {
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

        // obj.prPerform transformation and emit output codeop = val
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

    if (ts.isCallExpression(node)) {
      if (
        node.typeArguments ===
        undefined /* currently only support function w/o type args */
      ) {
        const args = node.arguments;
        functionCallArgs.add(args.length);
        const argsIdentifier = ts.createIdentifier(`fargs${clashCtr}`);

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
                ts.createNumericLiteral(`${args.length}`),
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

// Perform transformation and emit output code
const result = ts.transform(sourceFile, [transformer]);

const applyArgsFuncs = [];
functionCallArgs.forEach((amount) => {
  applyArgsFuncs.push(
    `
function apply${amount}Args<RetType,${Array(amount)
      .fill(null)
      .map((v, idx) => `In${idx}`)
      .join(",")}>(
  fptr: usize,
  argsBuff: ArgsBuffer,
): RetType {
  ${analysisDefinitions.classInstance.text}.genericApply(fptr, argsBuff);
  const func: (${Array(amount)
    .fill(null)
    .map((v, idx) => `in${idx}: In${idx}`)
    .join(",")}) => RetType = changetype<(${Array(amount)
      .fill(null)
      .map((v, idx) => `in${idx}: In${idx}`)
      .join(",")}) => RetType>(fptr);
  return func(${Array(amount)
    .fill(null)
    .map((v, idx) => `argsBuff.getArgument<In${idx}>(${idx})`)
    .join(",")});
}
`
  );
});

const transformedSourceFile = result.transformed[0];

const endResult =
  analysisSourceFile.text +
  applyArgsFuncs.join("\n") +
  printer.printNode(null, transformedSourceFile, sourceFile);

writeFileSync(outputFile, endResult);
