import { ASTWalker, getEmptyAdvice } from "./ast/astWalker";
import { Transform } from "./assemblyscript/cli/transform";
import { Parser, SourceKind, Source } from "./assemblyscript";

function transformToAdvice(s: Source[], idx: number) {
  // Create new AST walker
  const walker = new ASTWalker();

  // Define AST walker transform instructions
  const transformInstructions = getEmptyAdvice();
  // transformInstructions.visitNode = transformNode;
  // transformInstructions.visitCallExpression = transformCallExpression;
  // transformInstructions.visitPropertyAccessExpression = transformPropertyAccessExpression;

  // Install instructions and perfom transformation
  walker.setAdvice(transformInstructions);
  s[idx].statements.forEach((n) => (n ? walker.build(n) : null));
}

class MyTransform extends Transform {
  afterParse(parser: Parser) {
    const sources: Source[] = parser.sources;
    const interest: (s: Source) => Boolean = (s: Source) =>
      // Only files which are defined by the user
      s.sourceKind === SourceKind.USER_ENTRY ||
      s.sourceKind === SourceKind.USER;

    sources.forEach((s: Source, idx) => {
      if (interest(s)) {
        console.log(s.internalPath);
        // traverses AST, whenever it is of interest
        transformToAdvice(sources, idx);
      }
    });
  }
}

export = MyTransform;
