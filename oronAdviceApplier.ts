import { ASTWalker, oronAdvice, getEmptyAdvice } from "./ast/astWalker";
import { Transform } from "./assemblyscript/cli/transform";
import {
  Parser,
  SourceKind,
  Source,
  CallExpression,
  Node,
  NodeKind,
  PropertyAccessExpression,
  IdentifierExpression,
  NamedTypeNode,
  TypeName,
  Range
} from "./assemblyscript";

function replaceGet(
  original: CallExpression,
  expression: IdentifierExpression,
  property: IdentifierExpression
) {
  // mapping.get(index) => genericGet<i32, string>(mapping, index, mapping.get(index))
  const nullRange = original.range;
  const isNotQuoted = false;
  const isNotNullable = false;
  const newExpression: IdentifierExpression = Node.createIdentifierExpression(
    "genericGet",
    nullRange,
    isNotQuoted
  );
  const tn1i: IdentifierExpression = Node.createIdentifierExpression(
    "i32",
    nullRange,
    isNotQuoted
  );
  const tn2i: IdentifierExpression = Node.createIdentifierExpression(
    "string",
    nullRange,
    isNotQuoted
  );
  const tn1: TypeName = Node.createTypeName(tn1i, nullRange);
  const tn2: TypeName = Node.createTypeName(tn2i, nullRange);
  Node.createTypeName(name, nullRange);
  const ntn1: NamedTypeNode = Node.createNamedType(
    tn1,
    [],
    isNotNullable,
    nullRange
  );
  const ntn2: NamedTypeNode = Node.createNamedType(
    tn2,
    [],
    isNotNullable,
    nullRange
  );
  const typeArgs = [ntn1, ntn2];
  const args = [expression, property, original];
  return Node.createCallExpression(newExpression, typeArgs, args, nullRange);
}

function readGetOrSet(node: CallExpression, expr: PropertyAccessExpression) {
  const target = <IdentifierExpression>expr.expression;
  const operation = expr.property;

  console.log(`\n\n\n//// Visiting CallExpression ////`);
  switch (operation.text) {
    case "get":
      console.log(`Found get: ${target.text}.${operation.text}(/*TBA*/)`);
      break;
    case "set":
      console.log(`Found set: ${target.text}.${operation.text}(/*TBA*/)`);
      break;
    default:
      console.log(
        `Found [${operation.text}] which typeof(${typeof operation.text}): ${
          target.text
        }.${operation.text}(/*TBA*/)`
      );
      break;
  }
  console.log(`////////////////////////////////////////\n\n\n`);
}

function transformCallExpression(node: CallExpression) {
  const expr = node.expression;
  console.log("//////// Before ///////");
  console.log(node);
  console.log("//////// After ///////");

  switch (expr.kind) {
    case NodeKind.PROPERTYACCESS:
      readGetOrSet(node, <PropertyAccessExpression>expr);
      break;
    default:
      break;
  }
}

function transformNode(node: Node) {
  /* Empty transformation */
}

function transformPropertyAccessExpression(node: PropertyAccessExpression) {
  /* Empty transformation */
}

function transformToAdvice(s: Source[], idx: number) {
  // Create new AST walker
  const walker = new ASTWalker();

  // Define AST walker transform instructions
  const transformInstructions = getEmptyAdvice();
  transformInstructions.visitNode = transformNode;
  transformInstructions.visitCallExpression = transformCallExpression;
  transformInstructions.visitPropertyAccessExpression = transformPropertyAccessExpression;

  // Install instructions and perfom transformation
  walker.setAdvice(transformInstructions);
  s[idx].statements.forEach(n => (n !== null ? walker.build(n) : null));
}

class MyTransform extends Transform {
  afterParse(parser: Parser): void {
    const sources: Source[] = parser.program.sources;

    const interest: (s: Source) => Boolean = (s: Source) =>
      // Only files which are defined by the user
      s.sourceKind === SourceKind.USER_ENTRY ||
      s.sourceKind === SourceKind.USER;

    sources.forEach((s, idx) => {
      if (interest(s)) {
        // traverses AST, whenever it is of interest
        transformToAdvice(sources, idx);
      }
    });
  }
}

export = MyTransform;
