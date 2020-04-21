// code below heavily based upon
// https://blog.scottlogic.com/2017/05/02/typescript-compiler-api-revisited.html

import * as ts from "typescript";

const filename = "assembly/index.ts";
const asTypeDefinitions = "orondefaults/typedefs/typedefs.d.ts"; // empty file containing type-definitions

const program = ts.createProgram([asTypeDefinitions, filename], {
  // option would've been to include `typeRoots: ["./assemblyscript/std/types"]` but this resolves i32 => number
});

const typechecker: ts.TypeChecker = program.getTypeChecker();

const printer: ts.Printer = ts.createPrinter();
const sourceFile: ts.SourceFile = program.getSourceFile("./assembly/index.ts");

function getTypeNode(node: ts.Node): ts.TypeNode {
  return typechecker.typeToTypeNode(typechecker.getTypeAtLocation(node));
}

function createStringLiteral(s: string): ts.StringLiteral {
  return ts.createLiteral(ts.createStringLiteral(s));
}

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
        ts.createIdentifier("getTrap"),
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
          ts.createIdentifier("setTrap"),
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
    if (node.kind === ts.SyntaxKind.BinaryExpression) {
      const binExp = node as ts.BinaryExpression;
      if (
        /* not considered a binary operation */
        binExp.operatorToken.kind !== ts.SyntaxKind.EqualsToken
      ) {
        const operator = binExp.operatorToken.getText();
        console.log(
          `Found a binary operator! this is the operator: ${operator}`
        );
      }
    }
    return ts.visitEachChild(node, visit, context);
  }
  return ts.visitNode(rootNode, visit);
};

// Perform transformation and emit output code
const result: ts.TransformationResult<ts.Node> = ts.transform(sourceFile, [
  transformer,
]);

const transformedSourceFile = result.transformed[0];

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
