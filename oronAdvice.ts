import { Transform } from "assemblyscript/cli/transform";
import {
  Parser,
  SourceKind,
  Source,
  CallExpression,
  Node
} from "assemblyscript";
import { ASTWalker, oronAdvice, getEmptyAdvice } from "./transforon";

function deepTraverse(s: Source[], idx: number) {
  function traverse(n: Node) {
    const walker = new ASTWalker();
    const advice: oronAdvice = getEmptyAdvice();
    advice.visitCallExpression = (node: CallExpression) =>
      console.log(`Application of ${node.expression.text}`);
    advice.visitFunctionDeclaration = node =>
      console.log(`Declaration of ${node.name.text}`);
    walker.setAdvice(advice);
    walker.build(n);
  }

  s[idx].statements.forEach(traverse);
}

// traverses AST for every file where filter applies
function traverse(sources: Source[], filter: (s: Source) => Boolean): void {
  sources.forEach((s, idx) => {
    filter(s) ? deepTraverse(sources, idx) : null;
  });
}

class MyTransform extends Transform {
  afterParse(parser: Parser): void {
    const sources: Source[] = parser.program.sources;

    function interest(s: Source) {
      return (
        s.sourceKind === SourceKind.USER_ENTRY ||
        s.sourceKind === SourceKind.USER
      );
    }

    traverse(sources, interest);
  }
}

export = MyTransform;