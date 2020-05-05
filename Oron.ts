// code below heavily based upon
// https://blog.scottlogic.com/2017/05/02/typescript-compiler-api-revisited.html
import * as ts from "typescript";
import { writeFileSync } from "fs";

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
    return ts.visitEachChild(node, visit, context);
  }
  return ts.visitNode(rootNode, visit);
};

// Perform transformation and emit output code
const result = ts.transform(sourceFile, [transformer]);

const transformedSourceFile = result.transformed[0];

const endResult =
  analysisSourceFile.text +
  printer.printNode(null, transformedSourceFile, sourceFile);

writeFileSync(outputFile, endResult);
