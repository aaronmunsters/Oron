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
    advice.visitCallExpression = (node: CallExpression) => {
      /*
      console.log(`\n\n\n//// Visiting ${node.expression.text} ////`);
      console.log(node);
      console.log(`////////////////////////////////////////\n\n\n`);
      const target = node.expression.text;
      const thisArgument = null;
      const argumentsList = node.arguments.map(arg => arg.text);
      */
      // console.log(argumentsList);
      // node.expression.text = "Reflect.apply";
    };
    walker.setAdvice(advice);
    console.log(walker.build(n));
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
