"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var transform_1 = require("assemblyscript/cli/transform");
var assemblyscript_1 = require("assemblyscript");
var transforon_1 = require("./transforon");
function deepTraverse(s, idx) {
    function traverse(n) {
        var walker = new transforon_1.ASTWalker();
        var advice = transforon_1.getEmptyAdvice();
        advice.visitCallExpression = function (node) {
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
function traverse(sources, filter) {
    sources.forEach(function (s, idx) {
        filter(s) ? deepTraverse(sources, idx) : null;
    });
}
var MyTransform = /** @class */ (function (_super) {
    __extends(MyTransform, _super);
    function MyTransform() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyTransform.prototype.afterParse = function (parser) {
        var sources = parser.program.sources;
        function interest(s) {
            return (s.sourceKind === assemblyscript_1.SourceKind.USER_ENTRY ||
                s.sourceKind === assemblyscript_1.SourceKind.USER);
        }
        traverse(sources, interest);
    };
    return MyTransform;
}(transform_1.Transform));
module.exports = MyTransform;
