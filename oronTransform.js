"use strict";
// code below heavily based upon
// https://blog.scottlogic.com/2017/05/02/typescript-compiler-api-revisited.html
exports.__esModule = true;
var ts = require("typescript");
var filename = "./assembly/index.ts";
var program = ts.createProgram([filename], {
    // based upon "assemblyscript/std/portable.json"; however this declares the types as JS-compatible types!
    // problem with this: "i32" gets resolved to "number" ... Which is an undesired effect!
    typeRoots: ["assemblyscript/std/types"]
});
var typechecker = program.getTypeChecker();
var printer = ts.createPrinter();
var sourceFile = program.getSourceFile("./assembly/index.ts");
var transformer = function (context) { return function (rootNode) {
    function visit(node) {
        if (node.kind === ts.SyntaxKind.CallExpression) {
            var callexpr = node;
            var expr = callexpr.expression;
            if (expr.kind === ts.SyntaxKind.PropertyAccessExpression) {
                var propAccExpr = expr;
                var expression = propAccExpr.expression; // map-object
                var expressionType = typechecker.getTypeAtLocation(expression); // <K, V>
                console.log(expressionType);
                var name_1 = propAccExpr.name; // operation
                var nameType = typechecker.getTypeAtLocation(name_1); // i32 => number :(
                var exprTypeNode = expressionType; // should still be updated!
                var nameTypeNode = nameType; // should still be updated!
                var newExpr = void 0;
                switch (name_1.getText()) {
                    case "get":
                        newExpr = ts.createCall(ts.createIdentifier("genericGet"), [exprTypeNode, nameTypeNode], [expression, name_1]);
                        break;
                    case "set":
                        newExpr = ts.createCall(ts.createIdentifier("genericSet"), [exprTypeNode, nameTypeNode], [expression, name_1]);
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
}; };
// Perform transformation and emit output code
var result = ts.transform(sourceFile, [
    transformer
]);
var transformedSourceFile = result.transformed[0];
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
