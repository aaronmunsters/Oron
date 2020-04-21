"use strict";
// code below heavily based upon
// https://blog.scottlogic.com/2017/05/02/typescript-compiler-api-revisited.html
exports.__esModule = true;
var ts = require("typescript");
var filename = "assembly/index.ts";
var asTypeDefinitions = "orondefaults/typedefs/typedefs.d.ts"; // empty file containing type-definitions
var program = ts.createProgram([asTypeDefinitions, filename], {
// option would've been to include `typeRoots: ["./assemblyscript/std/types"]` but this resolves i32 => number
});
var typechecker = program.getTypeChecker();
var printer = ts.createPrinter();
var sourceFile = program.getSourceFile("./assembly/index.ts");
function getTypeNode(node) {
    return typechecker.typeToTypeNode(typechecker.getTypeAtLocation(node));
}
function createStringLiteral(s) {
    return ts.createLiteral(ts.createStringLiteral(s));
}
var transformer = function (context) { return function (rootNode) {
    function visit(node) {
        if (ts.isPropertyAccessExpression(node)) {
            var propAccessExpr = node;
            var objTn = getTypeNode(propAccessExpr.expression);
            var retTn = getTypeNode(propAccessExpr.name);
            var retString = createStringLiteral(propAccessExpr.name.text);
            // obj.prop
            // ==TRANSFORM==>
            // getTrap<ObjClass, PropType>(obj, "prop", offsetof<ObjClass>("prop"))
            return ts.createCall(ts.createIdentifier("getTrap"), [objTn, retTn], [
                propAccessExpr.expression,
                retString,
                ts.createCall(ts.createIdentifier("offsetof"), [objTn], [retString]),
            ]);
        }
        if (ts.isBinaryExpression(node)) {
            var binExp = node;
            if (
            // these two tests evaluate whether this is property assignment
            //  however expressions such as aaron.age++ are not included in this method
            binExp.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
                ts.isPropertyAccessExpression(binExp.left)) {
                var propAccessExpr = binExp.left;
                var objTn = getTypeNode(propAccessExpr.expression);
                var retTn = getTypeNode(propAccessExpr.name);
                var retString = createStringLiteral(propAccessExpr.name.text);
                var val = binExp.right;
                // obj.prop = val
                // ==TRANSFORM==>
                // setTrap<ObjClass, PropType>(obj, val, "prop", offsetof<ObjClass>("prop"))
                return ts.createCall(ts.createIdentifier("setTrap"), [objTn, retTn], [
                    propAccessExpr.expression,
                    val,
                    retString,
                    ts.createCall(ts.createIdentifier("offsetof"), [objTn], [retString]),
                ]);
            }
        }
        if (node.kind === ts.SyntaxKind.BinaryExpression) {
            var binExp = node;
            if (
            /* not considered a binary operation */
            binExp.operatorToken.kind !== ts.SyntaxKind.EqualsToken) {
                var operator = binExp.operatorToken.getText();
                console.log("Found a binary operator! this is the operator: " + operator);
            }
        }
        return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(rootNode, visit);
}; };
// Perform transformation and emit output code
var result = ts.transform(sourceFile, [
    transformer,
]);
var transformedSourceFile = result.transformed[0];
// this should be written to a file
console.log(printer.printNode(null, transformedSourceFile, sourceFile));
// // *** Old way of performing code transformationbelow ***
// import { ready, main } from "./assemblyscript/cli/asc";
// let args: string[] = process.argv.slice(2);
// if (args.length === 0) {
//   args = ["./assembly/index.ts", "--binaryFile", "./build/optimized.wasm"];
// }
// ready.then(() => {
//   main(
//     args
//       // apply transformation
//       .concat(["--transform"])
//       .concat(["./oronAdviceApplier.ts"])
//       // do not emit code, this will be emitted by transformer
//       .concat("--noEmit"),
//     {
//       stdout: process.stdout,
//       stderr: process.stderr,
//     },
//     function (err) {
//       if (err) {
//         console.log(err);
//       }
//       return 0;
//     }
//   );
// });
