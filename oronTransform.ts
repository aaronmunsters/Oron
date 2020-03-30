// code below heavily based upon
// https://blog.scottlogic.com/2017/05/02/typescript-compiler-api-revisited.html

import * as ts from "typescript";

const filename = "./assembly/index.ts";

const program = ts.createProgram([filename], {
  // based upon "assemblyscript/std/portable.json"; however this declares the types as JS-compatible types!
  // problem with this: "i32" gets resolved to "number" ... Which is an undesired effect!
  typeRoots: ["assemblyscript/std/types"]
});
const typechecker: ts.TypeChecker = program.getTypeChecker();

const printer: ts.Printer = ts.createPrinter();
const sourceFile: ts.SourceFile = program.getSourceFile("./assembly/index.ts");

const transformer = <T extends ts.Node>(context: ts.TransformationContext) => (
  rootNode: T
) => {
  function visit(node: ts.Node): ts.Node {
    if (node.kind === ts.SyntaxKind.CallExpression) {
      const callexpr = node as ts.CallExpression;
      const expr = callexpr.expression;
      if (expr.kind === ts.SyntaxKind.PropertyAccessExpression) {
        const propAccExpr = expr as ts.PropertyAccessExpression;
        const expression = propAccExpr.expression as ts.Identifier; // map-object
        const expressionType = typechecker.getTypeAtLocation(expression); // <K, V>
        const name = propAccExpr.name as ts.Identifier; // operation
        const nameType = typechecker.getTypeAtLocation(name); // i32 => number :(
        const exprTypeNode = <ts.TypeNode>(expressionType as unknown); // should still be updated!
        const nameTypeNode = <ts.TypeNode>(nameType as unknown); // should still be updated!
        let newExpr;
        switch (name.getText()) {
          case "get":
            newExpr = ts.createCall(
              ts.createIdentifier("genericGet"),
              [exprTypeNode, nameTypeNode],
              [expression, name]
            );
            break;
          case "set":
            newExpr = ts.createCall(
              ts.createIdentifier("genericSet"),
              [exprTypeNode, nameTypeNode],
              [expression, name]
            );
            break;
          default:
            newExpr = node;
        }
        return newExpr;
      }
    }
    return ts.visitEachChild(node, visit, context);
  }
  return ts.visitNode(rootNode, visit);
};

// Perform transformation and emit output code
const result: ts.TransformationResult<ts.Node> = ts.transform(sourceFile, [
  transformer
]);

const transformedSourceFile = result.transformed[0];

// this should be written to a file
console.log(printer.printNode(null, transformedSourceFile, sourceFile));

/* *** Old way of performing code transformationbelow ***
import { ready, main } from "./assemblyscript/cli/asc";

let args: string[] = process.argv.slice(2);
if (args.length === 0) {
  args = ["./assembly/index.ts", "--binaryFile", "./build/optimized.wasm"];
}

ready.then(() => {
  main(
    args
      // apply transformation
      .concat(["--transform"])
      .concat(["./oronAdviceApplier.ts"])
      // do not emit code, this will be emitted by transformer
      .concat("--noEmit"),
    {
      stdout: process.stdout,
      stderr: process.stderr
    },
    function(err) {
      if (err) {
        console.log(err);
      }
      return 0;
    }
  );
});
*/
