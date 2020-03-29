"use strict";
exports.__esModule = true;
require("../assemblyscript");
/**
 * @fileoverview Abstract Syntax Tree extras.
 *
 * Provides serialization of the AssemblyScript AST back to it source form.
 *
 * @license Apache-2.0
 */
var ast_1 = require("../assemblyscript/src/ast");
var tokenizer_1 = require("../assemblyscript/src/tokenizer");
var text_1 = require("../assemblyscript/src/util/text");
var common_1 = require("../assemblyscript/src/common");
function getEmptyAdvice() {
  return {
    visitNode: function(node) {},
    visitSource: function(source) {},
    visitTypeNode: function(node) {},
    visitTypeName: function(node) {},
    visitNamedTypeNode: function(node) {},
    visitFunctionTypeNode: function(node) {},
    visitTypeParameter: function(node) {},
    visitIdentifierExpression: function(node) {},
    visitArrayLiteralExpression: function(node) {},
    visitObjectLiteralExpression: function(node) {},
    visitAssertionExpression: function(node) {},
    visitBinaryExpression: function(node) {},
    visitCallExpression: function(node) {},
    visitClassExpression: function(node) {},
    visitCommaExpression: function(node) {},
    visitElementAccessExpression: function(node) {},
    visitFunctionExpression: function(node) {},
    visitLiteralExpression: function(node) {},
    visitFloatLiteralExpression: function(node) {},
    visitInstanceOfExpression: function(node) {},
    visitIntegerLiteralExpression: function(node) {},
    visitStringLiteral: function(str, singleQuoted) {},
    visitStringLiteralExpression: function(node) {},
    visitRegexpLiteralExpression: function(node) {},
    visitNewExpression: function(node) {},
    visitParenthesizedExpression: function(node) {},
    visitPropertyAccessExpression: function(node) {},
    visitTernaryExpression: function(node) {},
    visitUnaryExpression: function(node) {},
    visitUnaryPostfixExpression: function(node) {},
    visitUnaryPrefixExpression: function(node) {},
    visitNodeAndTerminate: function(statement) {},
    visitBlockStatement: function(node) {},
    visitBreakStatement: function(node) {},
    visitContinueStatement: function(node) {},
    visitClassDeclaration: function(node, isDefault) {},
    visitDoStatement: function(node) {},
    visitEmptyStatement: function(node) {},
    visitEnumDeclaration: function(node, isDefault) {},
    visitEnumValueDeclaration: function(node) {},
    visitExportImportStatement: function(node) {},
    visitExportMember: function(node) {},
    visitExportStatement: function(node) {},
    visitExportDefaultStatement: function(node) {},
    visitExpressionStatement: function(node) {},
    visitFieldDeclaration: function(node) {},
    visitForStatement: function(node) {},
    visitFunctionDeclaration: function(node, isDefault) {},
    visitFunctionCommon: function(node) {},
    visitIfStatement: function(node) {},
    visitImportDeclaration: function(node) {},
    visitImportStatement: function(node) {},
    visitIndexSignatureDeclaration: function(node) {},
    visitInterfaceDeclaration: function(node, isDefault) {},
    visitMethodDeclaration: function(node) {},
    visitNamespaceDeclaration: function(node, isDefault) {},
    visitReturnStatement: function(node) {},
    visitSwitchCase: function(node) {},
    visitSwitchStatement: function(node) {},
    visitThrowStatement: function(node) {},
    visitTryStatement: function(node) {},
    visitTypeDeclaration: function(node) {},
    visitVariableDeclaration: function(node) {},
    visitVariableStatement: function(node) {},
    visitWhileStatement: function(node) {}
  };
}
exports.getEmptyAdvice = getEmptyAdvice;
/** An AST builder. */
var ASTBuilder = /** @class */ (function() {
  function ASTBuilder() {
    this.sb = [];
    this.indentLevel = 0;
  }
  /** Rebuilds the textual source from the specified AST, as far as possible. */
  ASTBuilder.build = function(node) {
    var builder = new ASTBuilder();
    builder.visitNode(node);
    return builder.finish();
  };
  ASTBuilder.prototype.visitNode = function(node) {
    switch (node.kind) {
      case ast_1.NodeKind.SOURCE: {
        this.visitSource(node);
        break;
      }
      // types
      case ast_1.NodeKind.NAMEDTYPE: {
        this.visitNamedTypeNode(node);
        break;
      }
      case ast_1.NodeKind.FUNCTIONTYPE: {
        this.visitFunctionTypeNode(node);
        break;
      }
      case ast_1.NodeKind.TYPEPARAMETER: {
        this.visitTypeParameter(node);
        break;
      }
      // expressions
      case ast_1.NodeKind.FALSE:
      case ast_1.NodeKind.NULL:
      case ast_1.NodeKind.SUPER:
      case ast_1.NodeKind.THIS:
      case ast_1.NodeKind.TRUE:
      case ast_1.NodeKind.CONSTRUCTOR:
      case ast_1.NodeKind.IDENTIFIER: {
        this.visitIdentifierExpression(node);
        break;
      }
      case ast_1.NodeKind.ASSERTION: {
        this.visitAssertionExpression(node);
        break;
      }
      case ast_1.NodeKind.BINARY: {
        this.visitBinaryExpression(node);
        break;
      }
      case ast_1.NodeKind.CALL: {
        this.visitCallExpression(node);
        break;
      }
      case ast_1.NodeKind.CLASS: {
        this.visitClassExpression(node);
        break;
      }
      case ast_1.NodeKind.COMMA: {
        this.visitCommaExpression(node);
        break;
      }
      case ast_1.NodeKind.ELEMENTACCESS: {
        this.visitElementAccessExpression(node);
        break;
      }
      case ast_1.NodeKind.FUNCTION: {
        this.visitFunctionExpression(node);
        break;
      }
      case ast_1.NodeKind.INSTANCEOF: {
        this.visitInstanceOfExpression(node);
        break;
      }
      case ast_1.NodeKind.LITERAL: {
        this.visitLiteralExpression(node);
        break;
      }
      case ast_1.NodeKind.NEW: {
        this.visitNewExpression(node);
        break;
      }
      case ast_1.NodeKind.PARENTHESIZED: {
        this.visitParenthesizedExpression(node);
        break;
      }
      case ast_1.NodeKind.PROPERTYACCESS: {
        this.visitPropertyAccessExpression(node);
        break;
      }
      case ast_1.NodeKind.TERNARY: {
        this.visitTernaryExpression(node);
        break;
      }
      case ast_1.NodeKind.UNARYPOSTFIX: {
        this.visitUnaryPostfixExpression(node);
        break;
      }
      case ast_1.NodeKind.UNARYPREFIX: {
        this.visitUnaryPrefixExpression(node);
        break;
      }
      // statements
      case ast_1.NodeKind.BLOCK: {
        this.visitBlockStatement(node);
        break;
      }
      case ast_1.NodeKind.BREAK: {
        this.visitBreakStatement(node);
        break;
      }
      case ast_1.NodeKind.CONTINUE: {
        this.visitContinueStatement(node);
        break;
      }
      case ast_1.NodeKind.DO: {
        this.visitDoStatement(node);
        break;
      }
      case ast_1.NodeKind.EMPTY: {
        this.visitEmptyStatement(node);
        break;
      }
      case ast_1.NodeKind.EXPORT: {
        this.visitExportStatement(node);
        break;
      }
      case ast_1.NodeKind.EXPORTDEFAULT: {
        this.visitExportDefaultStatement(node);
        break;
      }
      case ast_1.NodeKind.EXPORTIMPORT: {
        this.visitExportImportStatement(node);
        break;
      }
      case ast_1.NodeKind.EXPRESSION: {
        this.visitExpressionStatement(node);
        break;
      }
      case ast_1.NodeKind.FOR: {
        this.visitForStatement(node);
        break;
      }
      case ast_1.NodeKind.FOROF: {
        this.visitForOfStatement(node);
        break;
      }
      case ast_1.NodeKind.IF: {
        this.visitIfStatement(node);
        break;
      }
      case ast_1.NodeKind.IMPORT: {
        this.visitImportStatement(node);
        break;
      }
      case ast_1.NodeKind.RETURN: {
        this.visitReturnStatement(node);
        break;
      }
      case ast_1.NodeKind.SWITCH: {
        this.visitSwitchStatement(node);
        break;
      }
      case ast_1.NodeKind.THROW: {
        this.visitThrowStatement(node);
        break;
      }
      case ast_1.NodeKind.TRY: {
        this.visitTryStatement(node);
        break;
      }
      case ast_1.NodeKind.VARIABLE: {
        this.visitVariableStatement(node);
        break;
      }
      case ast_1.NodeKind.WHILE: {
        this.visitWhileStatement(node);
        break;
      }
      // declaration statements
      case ast_1.NodeKind.CLASSDECLARATION: {
        this.visitClassDeclaration(node);
        break;
      }
      case ast_1.NodeKind.ENUMDECLARATION: {
        this.visitEnumDeclaration(node);
        break;
      }
      case ast_1.NodeKind.ENUMVALUEDECLARATION: {
        this.visitEnumValueDeclaration(node);
        break;
      }
      case ast_1.NodeKind.FIELDDECLARATION: {
        this.visitFieldDeclaration(node);
        break;
      }
      case ast_1.NodeKind.FUNCTIONDECLARATION: {
        this.visitFunctionDeclaration(node);
        break;
      }
      case ast_1.NodeKind.IMPORTDECLARATION: {
        this.visitImportDeclaration(node);
        break;
      }
      case ast_1.NodeKind.INDEXSIGNATUREDECLARATION: {
        this.visitIndexSignatureDeclaration(node);
        break;
      }
      case ast_1.NodeKind.INTERFACEDECLARATION: {
        this.visitInterfaceDeclaration(node);
        break;
      }
      case ast_1.NodeKind.METHODDECLARATION: {
        this.visitMethodDeclaration(node);
        break;
      }
      case ast_1.NodeKind.NAMESPACEDECLARATION: {
        this.visitNamespaceDeclaration(node);
        break;
      }
      case ast_1.NodeKind.TYPEDECLARATION: {
        this.visitTypeDeclaration(node);
        break;
      }
      case ast_1.NodeKind.VARIABLEDECLARATION: {
        this.visitVariableDeclaration(node);
        break;
      }
      // other
      case ast_1.NodeKind.DECORATOR: {
        this.serializeDecorator(node);
        break;
      }
      case ast_1.NodeKind.EXPORTMEMBER: {
        this.visitExportMember(node);
        break;
      }
      case ast_1.NodeKind.PARAMETER: {
        this.serializeParameter(node);
        break;
      }
      case ast_1.NodeKind.SWITCHCASE: {
        this.visitSwitchCase(node);
        break;
      }
      default:
        assert(false);
    }
  };
  ASTBuilder.prototype.visitSource = function(source) {
    var statements = source.statements;
    for (var i = 0, k = statements.length; i < k; ++i) {
      this.visitNodeAndTerminate(statements[i]);
    }
  };
  // types
  ASTBuilder.prototype.visitTypeNode = function(node) {
    switch (node.kind) {
      case ast_1.NodeKind.NAMEDTYPE: {
        this.visitNamedTypeNode(node);
        break;
      }
      case ast_1.NodeKind.FUNCTIONTYPE: {
        this.visitFunctionTypeNode(node);
        break;
      }
      default:
        assert(false);
    }
  };
  ASTBuilder.prototype.visitTypeName = function(node) {
    this.visitIdentifierExpression(node.identifier);
    var sb = this.sb;
    var current = node.next;
    while (current) {
      sb.push(".");
      this.visitIdentifierExpression(current.identifier);
      current = current.next;
    }
  };
  ASTBuilder.prototype.visitNamedTypeNode = function(node) {
    this.visitTypeName(node.name);
    var typeArguments = node.typeArguments;
    if (typeArguments) {
      var numTypeArguments = typeArguments.length;
      var sb = this.sb;
      if (numTypeArguments) {
        sb.push("<");
        this.visitTypeNode(typeArguments[0]);
        for (var i = 1; i < numTypeArguments; ++i) {
          sb.push(", ");
          this.visitTypeNode(typeArguments[i]);
        }
        sb.push(">");
      }
      if (node.isNullable) sb.push(" | null");
    }
  };
  ASTBuilder.prototype.visitFunctionTypeNode = function(node) {
    var isNullable = node.isNullable;
    var sb = this.sb;
    sb.push(isNullable ? "((" : "(");
    var explicitThisType = node.explicitThisType;
    if (explicitThisType) {
      sb.push("this: ");
      this.visitTypeNode(explicitThisType);
    }
    var parameters = node.parameters;
    var numParameters = parameters.length;
    if (numParameters) {
      if (explicitThisType) sb.push(", ");
      this.serializeParameter(parameters[0]);
      for (var i = 1; i < numParameters; ++i) {
        sb.push(", ");
        this.serializeParameter(parameters[i]);
      }
    }
    var returnType = node.returnType;
    if (returnType) {
      sb.push(") => ");
      this.visitTypeNode(returnType);
    } else {
      sb.push(") => void");
    }
    if (isNullable) sb.push(") | null");
  };
  ASTBuilder.prototype.visitTypeParameter = function(node) {
    this.visitIdentifierExpression(node.name);
    var extendsType = node.extendsType;
    if (extendsType) {
      this.sb.push(" extends ");
      this.visitTypeNode(extendsType);
    }
    var defaultType = node.defaultType;
    if (defaultType) {
      this.sb.push("=");
      this.visitTypeNode(defaultType);
    }
  };
  // expressions
  ASTBuilder.prototype.visitIdentifierExpression = function(node) {
    if (node.isQuoted) this.visitStringLiteral(node.text);
    else this.sb.push(node.text);
  };
  ASTBuilder.prototype.visitArrayLiteralExpression = function(node) {
    var sb = this.sb;
    sb.push("[");
    var elements = node.elementExpressions;
    var numElements = elements.length;
    if (numElements) {
      var element = elements[0];
      if (element) this.visitNode(element);
      for (var i = 1; i < numElements; ++i) {
        element = elements[i];
        sb.push(", ");
        if (element) this.visitNode(element);
      }
    }
    sb.push("]");
  };
  ASTBuilder.prototype.visitObjectLiteralExpression = function(node) {
    var sb = this.sb;
    var names = node.names;
    var values = node.values;
    var numElements = names.length;
    assert(numElements == values.length);
    if (numElements) {
      sb.push("{\n");
      text_1.indent(sb, ++this.indentLevel);
      this.visitNode(names[0]);
      sb.push(": ");
      this.visitNode(values[0]);
      for (var i = 1; i < numElements; ++i) {
        sb.push(",\n");
        text_1.indent(sb, this.indentLevel);
        var name_1 = names[i];
        var value = values[i];
        if (name_1 === value) {
          this.visitNode(name_1);
        } else {
          this.visitNode(name_1);
          sb.push(": ");
          this.visitNode(value);
        }
      }
      sb.push("\n");
      text_1.indent(sb, --this.indentLevel);
      sb.push("}");
    } else {
      sb.push("{}");
    }
  };
  ASTBuilder.prototype.visitAssertionExpression = function(node) {
    var sb = this.sb;
    switch (node.assertionKind) {
      case ast_1.AssertionKind.PREFIX: {
        sb.push("<");
        this.visitTypeNode(assert(node.toType));
        sb.push(">");
        this.visitNode(node.expression);
        break;
      }
      case ast_1.AssertionKind.AS: {
        this.visitNode(node.expression);
        sb.push(" as ");
        this.visitTypeNode(assert(node.toType));
        break;
      }
      case ast_1.AssertionKind.NONNULL: {
        this.visitNode(node.expression);
        sb.push("!");
        break;
      }
      case ast_1.AssertionKind.CONST: {
        this.visitNode(node.expression);
        sb.push(" as const");
        break;
      }
      default:
        assert(false);
    }
  };
  ASTBuilder.prototype.visitBinaryExpression = function(node) {
    var sb = this.sb;
    this.visitNode(node.left);
    sb.push(" ");
    sb.push(tokenizer_1.operatorTokenToString(node.operator));
    sb.push(" ");
    this.visitNode(node.right);
  };
  ASTBuilder.prototype.visitCallExpression = function(node) {
    this.visitNode(node.expression);
    this.visitArguments(node.typeArguments, node.arguments);
  };
  ASTBuilder.prototype.visitArguments = function(typeArguments, args) {
    var sb = this.sb;
    if (typeArguments) {
      var numTypeArguments = typeArguments.length;
      if (numTypeArguments) {
        sb.push("<");
        this.visitTypeNode(typeArguments[0]);
        for (var i = 1; i < numTypeArguments; ++i) {
          sb.push(", ");
          this.visitTypeNode(typeArguments[i]);
        }
        sb.push(">(");
      }
    } else {
      sb.push("(");
    }
    var numArgs = args.length;
    if (numArgs) {
      this.visitNode(args[0]);
      for (var i = 1; i < numArgs; ++i) {
        sb.push(", ");
        this.visitNode(args[i]);
      }
    }
    sb.push(")");
  };
  ASTBuilder.prototype.visitClassExpression = function(node) {
    var declaration = node.declaration;
    this.visitClassDeclaration(declaration);
  };
  ASTBuilder.prototype.visitCommaExpression = function(node) {
    var expressions = node.expressions;
    var numExpressions = assert(expressions.length);
    this.visitNode(expressions[0]);
    var sb = this.sb;
    for (var i = 1; i < numExpressions; ++i) {
      sb.push(",");
      this.visitNode(expressions[i]);
    }
  };
  ASTBuilder.prototype.visitElementAccessExpression = function(node) {
    var sb = this.sb;
    this.visitNode(node.expression);
    sb.push("[");
    this.visitNode(node.elementExpression);
    sb.push("]");
  };
  ASTBuilder.prototype.visitFunctionExpression = function(node) {
    var declaration = node.declaration;
    if (!declaration.arrowKind) {
      if (declaration.name.text.length) {
        this.sb.push("function ");
      } else {
        this.sb.push("function");
      }
    } else {
      assert(declaration.name.text.length == 0);
    }
    this.visitFunctionCommon(declaration);
  };
  ASTBuilder.prototype.visitLiteralExpression = function(node) {
    switch (node.literalKind) {
      case ast_1.LiteralKind.FLOAT: {
        this.visitFloatLiteralExpression(node);
        break;
      }
      case ast_1.LiteralKind.INTEGER: {
        this.visitIntegerLiteralExpression(node);
        break;
      }
      case ast_1.LiteralKind.STRING: {
        this.visitStringLiteralExpression(node);
        break;
      }
      case ast_1.LiteralKind.REGEXP: {
        this.visitRegexpLiteralExpression(node);
        break;
      }
      case ast_1.LiteralKind.ARRAY: {
        this.visitArrayLiteralExpression(node);
        break;
      }
      case ast_1.LiteralKind.OBJECT: {
        this.visitObjectLiteralExpression(node);
        break;
      }
      default: {
        assert(false);
        break;
      }
    }
  };
  ASTBuilder.prototype.visitFloatLiteralExpression = function(node) {
    this.sb.push(node.value.toString());
  };
  ASTBuilder.prototype.visitInstanceOfExpression = function(node) {
    this.visitNode(node.expression);
    this.sb.push(" instanceof ");
    this.visitTypeNode(node.isType);
  };
  ASTBuilder.prototype.visitIntegerLiteralExpression = function(node) {
    this.sb.push(i64_to_string(node.value));
  };
  ASTBuilder.prototype.visitStringLiteral = function(str, singleQuoted) {
    if (singleQuoted === void 0) {
      singleQuoted = false;
    }
    var sb = this.sb;
    var off = 0;
    var quote = singleQuoted ? "'" : '"';
    sb.push(quote);
    var i = 0;
    for (var k = str.length; i < k; ) {
      switch (str.charCodeAt(i)) {
        case 0 /* NULL */: {
          if (i > off) sb.push(str.substring(off, (off = i + 1)));
          sb.push("\\0");
          off = ++i;
          break;
        }
        case 8 /* BACKSPACE */: {
          if (i > off) sb.push(str.substring(off, i));
          off = ++i;
          sb.push("\\b");
          break;
        }
        case 9 /* TAB */: {
          if (i > off) sb.push(str.substring(off, i));
          off = ++i;
          sb.push("\\t");
          break;
        }
        case 10 /* LINEFEED */: {
          if (i > off) sb.push(str.substring(off, i));
          off = ++i;
          sb.push("\\n");
          break;
        }
        case 11 /* VERTICALTAB */: {
          if (i > off) sb.push(str.substring(off, i));
          off = ++i;
          sb.push("\\v");
          break;
        }
        case 12 /* FORMFEED */: {
          if (i > off) sb.push(str.substring(off, i));
          off = ++i;
          sb.push("\\f");
          break;
        }
        case 13 /* CARRIAGERETURN */: {
          if (i > off) sb.push(str.substring(off, i));
          sb.push("\\r");
          off = ++i;
          break;
        }
        case 34 /* DOUBLEQUOTE */: {
          if (!singleQuoted) {
            if (i > off) sb.push(str.substring(off, i));
            sb.push('\\"');
            off = ++i;
          } else {
            ++i;
          }
          break;
        }
        case 39 /* SINGLEQUOTE */: {
          if (singleQuoted) {
            if (i > off) sb.push(str.substring(off, i));
            sb.push("\\'");
            off = ++i;
          } else {
            ++i;
          }
          break;
        }
        case 92 /* BACKSLASH */: {
          if (i > off) sb.push(str.substring(off, i));
          sb.push("\\\\");
          off = ++i;
          break;
        }
        default: {
          ++i;
          break;
        }
      }
    }
    if (i > off) sb.push(str.substring(off, i));
    sb.push(quote);
  };
  ASTBuilder.prototype.visitStringLiteralExpression = function(node) {
    this.visitStringLiteral(node.value);
  };
  ASTBuilder.prototype.visitRegexpLiteralExpression = function(node) {
    var sb = this.sb;
    sb.push("/");
    sb.push(node.pattern);
    sb.push("/");
    sb.push(node.patternFlags);
  };
  ASTBuilder.prototype.visitNewExpression = function(node) {
    this.sb.push("new ");
    this.visitTypeName(node.typeName);
    this.visitArguments(node.typeArguments, node.arguments);
  };
  ASTBuilder.prototype.visitParenthesizedExpression = function(node) {
    var sb = this.sb;
    sb.push("(");
    this.visitNode(node.expression);
    sb.push(")");
  };
  ASTBuilder.prototype.visitPropertyAccessExpression = function(node) {
    this.visitNode(node.expression);
    this.sb.push(".");
    this.visitIdentifierExpression(node.property);
  };
  ASTBuilder.prototype.visitTernaryExpression = function(node) {
    var sb = this.sb;
    this.visitNode(node.condition);
    sb.push(" ? ");
    this.visitNode(node.ifThen);
    sb.push(" : ");
    this.visitNode(node.ifElse);
  };
  ASTBuilder.prototype.visitUnaryExpression = function(node) {
    switch (node.kind) {
      case ast_1.NodeKind.UNARYPOSTFIX: {
        this.visitUnaryPostfixExpression(node);
        break;
      }
      case ast_1.NodeKind.UNARYPREFIX: {
        this.visitUnaryPrefixExpression(node);
        break;
      }
      default:
        assert(false);
    }
  };
  ASTBuilder.prototype.visitUnaryPostfixExpression = function(node) {
    this.visitNode(node.operand);
    this.sb.push(tokenizer_1.operatorTokenToString(node.operator));
  };
  ASTBuilder.prototype.visitUnaryPrefixExpression = function(node) {
    this.sb.push(tokenizer_1.operatorTokenToString(node.operator));
    this.visitNode(node.operand);
  };
  // statements
  ASTBuilder.prototype.visitNodeAndTerminate = function(statement) {
    this.visitNode(statement);
    var sb = this.sb;
    if (
      !sb.length || // leading EmptyStatement
      statement.kind == ast_1.NodeKind.VARIABLE || // potentially assigns a FunctionExpression
      statement.kind == ast_1.NodeKind.EXPRESSION // potentially assigns a FunctionExpression
    ) {
      sb.push(";\n");
    } else {
      var last = sb[sb.length - 1];
      var lastCharPos = last.length - 1;
      if (
        lastCharPos >= 0 &&
        (last.charCodeAt(lastCharPos) == 125 /* CLOSEBRACE */ ||
          last.charCodeAt(lastCharPos) == 59) /* SEMICOLON */
      ) {
        sb.push("\n");
      } else {
        sb.push(";\n");
      }
    }
  };
  ASTBuilder.prototype.visitBlockStatement = function(node) {
    var sb = this.sb;
    var statements = node.statements;
    var numStatements = statements.length;
    if (numStatements) {
      sb.push("{\n");
      var indentLevel = ++this.indentLevel;
      for (var i = 0; i < numStatements; ++i) {
        text_1.indent(sb, indentLevel);
        this.visitNodeAndTerminate(statements[i]);
      }
      text_1.indent(sb, --this.indentLevel);
      sb.push("}");
    } else {
      sb.push("{}");
    }
  };
  ASTBuilder.prototype.visitBreakStatement = function(node) {
    var label = node.label;
    if (label) {
      this.sb.push("break ");
      this.visitIdentifierExpression(label);
    } else {
      this.sb.push("break");
    }
  };
  ASTBuilder.prototype.visitContinueStatement = function(node) {
    var label = node.label;
    if (label) {
      this.sb.push("continue ");
      this.visitIdentifierExpression(label);
    } else {
      this.sb.push("continue");
    }
  };
  ASTBuilder.prototype.visitClassDeclaration = function(node, isDefault) {
    if (isDefault === void 0) {
      isDefault = false;
    }
    var decorators = node.decorators;
    if (decorators) {
      for (var i = 0, k = decorators.length; i < k; ++i) {
        this.serializeDecorator(decorators[i]);
      }
    }
    var sb = this.sb;
    if (isDefault) {
      sb.push("export default ");
    } else {
      this.serializeExternalModifiers(node);
    }
    if (node.is(common_1.CommonFlags.ABSTRACT)) sb.push("abstract ");
    if (node.name.text.length) {
      sb.push("class ");
      this.visitIdentifierExpression(node.name);
    } else {
      sb.push("class");
    }
    var typeParameters = node.typeParameters;
    if (typeParameters && typeParameters.length) {
      sb.push("<");
      this.visitTypeParameter(typeParameters[0]);
      for (var i = 1, k = typeParameters.length; i < k; ++i) {
        sb.push(", ");
        this.visitTypeParameter(typeParameters[i]);
      }
      sb.push(">");
    }
    var extendsType = node.extendsType;
    if (extendsType) {
      sb.push(" extends ");
      this.visitTypeNode(extendsType);
    }
    var implementsTypes = node.implementsTypes;
    if (implementsTypes) {
      var numImplementsTypes = implementsTypes.length;
      if (numImplementsTypes) {
        sb.push(" implements ");
        this.visitTypeNode(implementsTypes[0]);
        for (var i = 1; i < numImplementsTypes; ++i) {
          sb.push(", ");
          this.visitTypeNode(implementsTypes[i]);
        }
      }
    }
    var members = node.members;
    var numMembers = members.length;
    if (numMembers) {
      sb.push(" {\n");
      var indentLevel = ++this.indentLevel;
      for (var i = 0, k = members.length; i < k; ++i) {
        var member = members[i];
        if (
          member.kind != ast_1.NodeKind.FIELDDECLARATION ||
          member.parameterIndex < 0
        ) {
          text_1.indent(sb, indentLevel);
          this.visitNodeAndTerminate(member);
        }
      }
      text_1.indent(sb, --this.indentLevel);
      sb.push("}");
    } else {
      sb.push(" {}");
    }
  };
  ASTBuilder.prototype.visitDoStatement = function(node) {
    var sb = this.sb;
    sb.push("do ");
    this.visitNode(node.statement);
    if (node.statement.kind == ast_1.NodeKind.BLOCK) {
      sb.push(" while (");
    } else {
      sb.push(";\n");
      text_1.indent(sb, this.indentLevel);
      sb.push("while (");
    }
    this.visitNode(node.condition);
    sb.push(")");
  };
  ASTBuilder.prototype.visitEmptyStatement = function(node) {};
  ASTBuilder.prototype.visitEnumDeclaration = function(node, isDefault) {
    if (isDefault === void 0) {
      isDefault = false;
    }
    var sb = this.sb;
    if (isDefault) {
      sb.push("export default ");
    } else {
      this.serializeExternalModifiers(node);
    }
    if (node.is(common_1.CommonFlags.CONST)) sb.push("const ");
    sb.push("enum ");
    this.visitIdentifierExpression(node.name);
    var values = node.values;
    var numValues = values.length;
    if (numValues) {
      sb.push(" {\n");
      var indentLevel = ++this.indentLevel;
      text_1.indent(sb, indentLevel);
      this.visitEnumValueDeclaration(node.values[0]);
      for (var i = 1; i < numValues; ++i) {
        sb.push(",\n");
        text_1.indent(sb, indentLevel);
        this.visitEnumValueDeclaration(node.values[i]);
      }
      sb.push("\n");
      text_1.indent(sb, --this.indentLevel);
      sb.push("}");
    } else {
      sb.push(" {}");
    }
  };
  ASTBuilder.prototype.visitEnumValueDeclaration = function(node) {
    this.visitIdentifierExpression(node.name);
    if (node.value) {
      this.sb.push(" = ");
      this.visitNode(node.value);
    }
  };
  ASTBuilder.prototype.visitExportImportStatement = function(node) {
    var sb = this.sb;
    sb.push("export import ");
    this.visitIdentifierExpression(node.externalName);
    sb.push(" = ");
    this.visitIdentifierExpression(node.name);
  };
  ASTBuilder.prototype.visitExportMember = function(node) {
    this.visitIdentifierExpression(node.localName);
    if (node.exportedName.text != node.localName.text) {
      this.sb.push(" as ");
      this.visitIdentifierExpression(node.exportedName);
    }
  };
  ASTBuilder.prototype.visitExportStatement = function(node) {
    var sb = this.sb;
    if (node.isDeclare) {
      sb.push("declare ");
    }
    var members = node.members;
    if (members && members.length) {
      var numMembers = members.length;
      sb.push("export {\n");
      var indentLevel = ++this.indentLevel;
      text_1.indent(sb, indentLevel);
      this.visitExportMember(members[0]);
      for (var i = 1; i < numMembers; ++i) {
        sb.push(",\n");
        text_1.indent(sb, indentLevel);
        this.visitExportMember(members[i]);
      }
      --this.indentLevel;
      sb.push("\n}");
    } else {
      sb.push("export {}");
    }
    var path = node.path;
    if (path) {
      sb.push(" from ");
      this.visitStringLiteralExpression(path);
    }
    sb.push(";");
  };
  ASTBuilder.prototype.visitExportDefaultStatement = function(node) {
    var declaration = node.declaration;
    switch (declaration.kind) {
      case ast_1.NodeKind.ENUMDECLARATION: {
        this.visitEnumDeclaration(declaration, true);
        break;
      }
      case ast_1.NodeKind.FUNCTIONDECLARATION: {
        this.visitFunctionDeclaration(declaration, true);
        break;
      }
      case ast_1.NodeKind.CLASSDECLARATION: {
        this.visitClassDeclaration(declaration, true);
        break;
      }
      case ast_1.NodeKind.INTERFACEDECLARATION: {
        this.visitInterfaceDeclaration(declaration, true);
        break;
      }
      case ast_1.NodeKind.NAMESPACEDECLARATION: {
        this.visitNamespaceDeclaration(declaration, true);
        break;
      }
      default:
        assert(false);
    }
  };
  ASTBuilder.prototype.visitExpressionStatement = function(node) {
    this.visitNode(node.expression);
  };
  ASTBuilder.prototype.visitFieldDeclaration = function(node) {
    var decorators = node.decorators;
    if (decorators) {
      for (var i = 0, k = decorators.length; i < k; ++i) {
        this.serializeDecorator(decorators[i]);
      }
    }
    this.serializeAccessModifiers(node);
    this.visitIdentifierExpression(node.name);
    var sb = this.sb;
    if (node.flags & common_1.CommonFlags.DEFINITE_ASSIGNMENT) {
      sb.push("!");
    }
    var type = node.type;
    if (type) {
      sb.push(": ");
      this.visitTypeNode(type);
    }
    var initializer = node.initializer;
    if (initializer) {
      sb.push(" = ");
      this.visitNode(initializer);
    }
  };
  ASTBuilder.prototype.visitForStatement = function(node) {
    var sb = this.sb;
    sb.push("for (");
    var initializer = node.initializer;
    if (initializer) {
      this.visitNode(initializer);
    }
    var condition = node.condition;
    if (condition) {
      sb.push("; ");
      this.visitNode(condition);
    } else {
      sb.push(";");
    }
    var incrementor = node.incrementor;
    if (incrementor) {
      sb.push("; ");
      this.visitNode(incrementor);
    } else {
      sb.push(";");
    }
    sb.push(") ");
    this.visitNode(node.statement);
  };
  ASTBuilder.prototype.visitForOfStatement = function(node) {
    var sb = this.sb;
    sb.push("for (");
    this.visitNode(node.variable);
    sb.push(" of ");
    this.visitNode(node.iterable);
    sb.push(") ");
    this.visitNode(node.statement);
  };
  ASTBuilder.prototype.visitFunctionDeclaration = function(node, isDefault) {
    if (isDefault === void 0) {
      isDefault = false;
    }
    var sb = this.sb;
    var decorators = node.decorators;
    if (decorators) {
      for (var i = 0, k = decorators.length; i < k; ++i) {
        this.serializeDecorator(decorators[i]);
      }
    }
    if (isDefault) {
      sb.push("export default ");
    } else {
      this.serializeExternalModifiers(node);
      this.serializeAccessModifiers(node);
    }
    if (node.name.text.length) {
      sb.push("function ");
    } else {
      sb.push("function");
    }
    this.visitFunctionCommon(node);
  };
  ASTBuilder.prototype.visitFunctionCommon = function(node) {
    var sb = this.sb;
    this.visitIdentifierExpression(node.name);
    var signature = node.signature;
    var typeParameters = node.typeParameters;
    if (typeParameters) {
      var numTypeParameters = typeParameters.length;
      if (numTypeParameters) {
        sb.push("<");
        this.visitTypeParameter(typeParameters[0]);
        for (var i = 1; i < numTypeParameters; ++i) {
          sb.push(", ");
          this.visitTypeParameter(typeParameters[i]);
        }
        sb.push(">");
      }
    }
    if (node.arrowKind == 2 /* ARROW_SINGLE */) {
      var parameters = signature.parameters;
      assert(parameters.length == 1);
      assert(!signature.explicitThisType);
      this.serializeParameter(parameters[0]);
    } else {
      sb.push("(");
      var parameters = signature.parameters;
      var numParameters = parameters.length;
      var explicitThisType = signature.explicitThisType;
      if (explicitThisType) {
        sb.push("this: ");
        this.visitTypeNode(explicitThisType);
      }
      if (numParameters) {
        if (explicitThisType) sb.push(", ");
        this.serializeParameter(parameters[0]);
        for (var i = 1; i < numParameters; ++i) {
          sb.push(", ");
          this.serializeParameter(parameters[i]);
        }
      }
    }
    var body = node.body;
    var returnType = signature.returnType;
    if (node.arrowKind) {
      if (body) {
        if (node.arrowKind == 2 /* ARROW_SINGLE */) {
          assert(ast_1.isTypeOmitted(returnType));
        } else {
          if (ast_1.isTypeOmitted(returnType)) {
            sb.push(")");
          } else {
            sb.push("): ");
            this.visitTypeNode(returnType);
          }
        }
        sb.push(" => ");
        this.visitNode(body);
      } else {
        assert(!ast_1.isTypeOmitted(returnType));
        sb.push(" => ");
        this.visitTypeNode(returnType);
      }
    } else {
      if (
        !ast_1.isTypeOmitted(returnType) &&
        !node.isAny(common_1.CommonFlags.CONSTRUCTOR | common_1.CommonFlags.SET)
      ) {
        sb.push("): ");
        this.visitTypeNode(returnType);
      } else {
        sb.push(")");
      }
      if (body) {
        sb.push(" ");
        this.visitNode(body);
      }
    }
  };
  ASTBuilder.prototype.visitIfStatement = function(node) {
    var sb = this.sb;
    sb.push("if (");
    this.visitNode(node.condition);
    sb.push(") ");
    var ifTrue = node.ifTrue;
    this.visitNode(ifTrue);
    if (ifTrue.kind != ast_1.NodeKind.BLOCK) {
      sb.push(";\n");
    }
    var ifFalse = node.ifFalse;
    if (ifFalse) {
      if (ifTrue.kind == ast_1.NodeKind.BLOCK) {
        sb.push(" else ");
      } else {
        sb.push("else ");
      }
      this.visitNode(ifFalse);
    }
  };
  ASTBuilder.prototype.visitImportDeclaration = function(node) {
    var externalName = node.foreignName;
    var name = node.name;
    this.visitIdentifierExpression(externalName);
    if (externalName.text != name.text) {
      this.sb.push(" as ");
      this.visitIdentifierExpression(name);
    }
  };
  ASTBuilder.prototype.visitImportStatement = function(node) {
    var sb = this.sb;
    sb.push("import ");
    var declarations = node.declarations;
    var namespaceName = node.namespaceName;
    if (declarations) {
      var numDeclarations = declarations.length;
      if (numDeclarations) {
        sb.push("{\n");
        var indentLevel = ++this.indentLevel;
        text_1.indent(sb, indentLevel);
        this.visitImportDeclaration(declarations[0]);
        for (var i = 1; i < numDeclarations; ++i) {
          sb.push(",\n");
          text_1.indent(sb, indentLevel);
          this.visitImportDeclaration(declarations[i]);
        }
        --this.indentLevel;
        sb.push("\n} from ");
      } else {
        sb.push("{} from ");
      }
    } else if (namespaceName) {
      sb.push("* as ");
      this.visitIdentifierExpression(namespaceName);
      sb.push(" from ");
    }
    this.visitStringLiteralExpression(node.path);
  };
  ASTBuilder.prototype.visitIndexSignatureDeclaration = function(node) {
    var sb = this.sb;
    sb.push("[key: ");
    this.visitTypeNode(node.keyType);
    sb.push("]: ");
    this.visitTypeNode(node.valueType);
  };
  ASTBuilder.prototype.visitInterfaceDeclaration = function(node, isDefault) {
    if (isDefault === void 0) {
      isDefault = false;
    }
    var decorators = node.decorators;
    if (decorators) {
      for (var i = 0, k = decorators.length; i < k; ++i) {
        this.serializeDecorator(decorators[i]);
      }
    }
    var sb = this.sb;
    if (isDefault) {
      sb.push("export default ");
    } else {
      this.serializeExternalModifiers(node);
    }
    sb.push("interface ");
    this.visitIdentifierExpression(node.name);
    var typeParameters = node.typeParameters;
    if (typeParameters && typeParameters.length) {
      sb.push("<");
      this.visitTypeParameter(typeParameters[0]);
      for (var i = 1, k = typeParameters.length; i < k; ++i) {
        sb.push(", ");
        this.visitTypeParameter(typeParameters[i]);
      }
      sb.push(">");
    }
    var extendsType = node.extendsType;
    if (extendsType) {
      sb.push(" extends ");
      this.visitTypeNode(extendsType);
    }
    // must not have implementsTypes
    sb.push(" {\n");
    var indentLevel = ++this.indentLevel;
    var members = node.members;
    for (var i = 0, k = members.length; i < k; ++i) {
      text_1.indent(sb, indentLevel);
      this.visitNodeAndTerminate(members[i]);
    }
    --this.indentLevel;
    sb.push("}");
  };
  ASTBuilder.prototype.visitMethodDeclaration = function(node) {
    var decorators = node.decorators;
    if (decorators) {
      for (var i = 0, k = decorators.length; i < k; ++i) {
        this.serializeDecorator(decorators[i]);
      }
    }
    this.serializeAccessModifiers(node);
    if (node.is(common_1.CommonFlags.GET)) {
      this.sb.push("get ");
    } else if (node.is(common_1.CommonFlags.SET)) {
      this.sb.push("set ");
    }
    this.visitFunctionCommon(node);
  };
  ASTBuilder.prototype.visitNamespaceDeclaration = function(node, isDefault) {
    if (isDefault === void 0) {
      isDefault = false;
    }
    var decorators = node.decorators;
    if (decorators) {
      for (var i = 0, k = decorators.length; i < k; ++i) {
        this.serializeDecorator(decorators[i]);
      }
    }
    var sb = this.sb;
    if (isDefault) {
      sb.push("export default ");
    } else {
      this.serializeExternalModifiers(node);
    }
    sb.push("namespace ");
    this.visitIdentifierExpression(node.name);
    var members = node.members;
    var numMembers = members.length;
    if (numMembers) {
      sb.push(" {\n");
      var indentLevel = ++this.indentLevel;
      for (var i = 0, k = members.length; i < k; ++i) {
        text_1.indent(sb, indentLevel);
        this.visitNodeAndTerminate(members[i]);
      }
      text_1.indent(sb, --this.indentLevel);
      sb.push("}");
    } else {
      sb.push(" {}");
    }
  };
  ASTBuilder.prototype.visitReturnStatement = function(node) {
    var value = node.value;
    if (value) {
      this.sb.push("return ");
      this.visitNode(value);
    } else {
      this.sb.push("return");
    }
  };
  ASTBuilder.prototype.visitSwitchCase = function(node) {
    var sb = this.sb;
    var label = node.label;
    if (label) {
      sb.push("case ");
      this.visitNode(label);
      sb.push(":\n");
    } else {
      sb.push("default:\n");
    }
    var statements = node.statements;
    var numStatements = statements.length;
    if (numStatements) {
      var indentLevel = ++this.indentLevel;
      text_1.indent(sb, indentLevel);
      this.visitNodeAndTerminate(statements[0]);
      for (var i = 1; i < numStatements; ++i) {
        text_1.indent(sb, indentLevel);
        this.visitNodeAndTerminate(statements[i]);
      }
      --this.indentLevel;
    }
  };
  ASTBuilder.prototype.visitSwitchStatement = function(node) {
    var sb = this.sb;
    sb.push("switch (");
    this.visitNode(node.condition);
    sb.push(") {\n");
    var indentLevel = ++this.indentLevel;
    var cases = node.cases;
    for (var i = 0, k = cases.length; i < k; ++i) {
      text_1.indent(sb, indentLevel);
      this.visitSwitchCase(cases[i]);
      sb.push("\n");
    }
    --this.indentLevel;
    sb.push("}");
  };
  ASTBuilder.prototype.visitThrowStatement = function(node) {
    this.sb.push("throw ");
    this.visitNode(node.value);
  };
  ASTBuilder.prototype.visitTryStatement = function(node) {
    var sb = this.sb;
    sb.push("try {\n");
    var indentLevel = ++this.indentLevel;
    var statements = node.statements;
    for (var i = 0, k = statements.length; i < k; ++i) {
      text_1.indent(sb, indentLevel);
      this.visitNodeAndTerminate(statements[i]);
    }
    var catchVariable = node.catchVariable;
    if (catchVariable) {
      text_1.indent(sb, indentLevel - 1);
      sb.push("} catch (");
      this.visitIdentifierExpression(catchVariable);
      sb.push(") {\n");
      var catchStatements = node.catchStatements;
      if (catchStatements) {
        for (var i = 0, k = catchStatements.length; i < k; ++i) {
          text_1.indent(sb, indentLevel);
          this.visitNodeAndTerminate(catchStatements[i]);
        }
      }
    }
    var finallyStatements = node.finallyStatements;
    if (finallyStatements) {
      text_1.indent(sb, indentLevel - 1);
      sb.push("} finally {\n");
      for (var i = 0, k = finallyStatements.length; i < k; ++i) {
        text_1.indent(sb, indentLevel);
        this.visitNodeAndTerminate(finallyStatements[i]);
      }
    }
    text_1.indent(sb, indentLevel - 1);
    sb.push("}");
  };
  ASTBuilder.prototype.visitTypeDeclaration = function(node) {
    var decorators = node.decorators;
    if (decorators) {
      for (var i = 0, k = decorators.length; i < k; ++i) {
        this.serializeDecorator(decorators[i]);
      }
    }
    var sb = this.sb;
    this.serializeExternalModifiers(node);
    sb.push("type ");
    this.visitIdentifierExpression(node.name);
    var typeParameters = node.typeParameters;
    if (typeParameters) {
      var numTypeParameters = typeParameters.length;
      if (numTypeParameters) {
        sb.push("<");
        for (var i = 0; i < numTypeParameters; ++i) {
          this.visitTypeParameter(typeParameters[i]);
        }
        sb.push(">");
      }
    }
    sb.push(" = ");
    this.visitTypeNode(node.type);
  };
  ASTBuilder.prototype.visitVariableDeclaration = function(node) {
    this.visitIdentifierExpression(node.name);
    var type = node.type;
    var sb = this.sb;
    if (node.flags & common_1.CommonFlags.DEFINITE_ASSIGNMENT) {
      sb.push("!");
    }
    if (type) {
      sb.push(": ");
      this.visitTypeNode(type);
    }
    var initializer = node.initializer;
    if (initializer) {
      sb.push(" = ");
      this.visitNode(initializer);
    }
  };
  ASTBuilder.prototype.visitVariableStatement = function(node) {
    var decorators = node.decorators;
    if (decorators) {
      for (var i = 0, k = decorators.length; i < k; ++i) {
        this.serializeDecorator(decorators[i]);
      }
    }
    var sb = this.sb;
    var declarations = node.declarations;
    var numDeclarations = assert(declarations.length);
    var firstDeclaration = declarations[0];
    this.serializeExternalModifiers(firstDeclaration);
    sb.push(
      firstDeclaration.is(common_1.CommonFlags.CONST)
        ? "const "
        : firstDeclaration.is(common_1.CommonFlags.LET)
        ? "let "
        : "var "
    );
    this.visitVariableDeclaration(node.declarations[0]);
    for (var i = 1; i < numDeclarations; ++i) {
      sb.push(", ");
      this.visitVariableDeclaration(node.declarations[i]);
    }
  };
  ASTBuilder.prototype.visitWhileStatement = function(node) {
    var sb = this.sb;
    sb.push("while (");
    this.visitNode(node.condition);
    var statement = node.statement;
    if (statement.kind == ast_1.NodeKind.EMPTY) {
      sb.push(")");
    } else {
      sb.push(") ");
      this.visitNode(node.statement);
    }
  };
  // other
  ASTBuilder.prototype.serializeDecorator = function(node) {
    var sb = this.sb;
    sb.push("@");
    this.visitNode(node.name);
    var args = node.arguments;
    if (args) {
      sb.push("(");
      var numArgs = args.length;
      if (numArgs) {
        this.visitNode(args[0]);
        for (var i = 1; i < numArgs; ++i) {
          sb.push(", ");
          this.visitNode(args[i]);
        }
      }
      sb.push(")\n");
    } else {
      sb.push("\n");
    }
    text_1.indent(sb, this.indentLevel);
  };
  ASTBuilder.prototype.serializeParameter = function(node) {
    var sb = this.sb;
    var kind = node.parameterKind;
    var implicitFieldDeclaration = node.implicitFieldDeclaration;
    if (implicitFieldDeclaration) {
      this.serializeAccessModifiers(implicitFieldDeclaration);
    }
    if (kind == ast_1.ParameterKind.REST) {
      sb.push("...");
    }
    this.visitIdentifierExpression(node.name);
    var type = node.type;
    var initializer = node.initializer;
    if (type) {
      if (kind == ast_1.ParameterKind.OPTIONAL) sb.push("?");
      if (!ast_1.isTypeOmitted(type)) {
        sb.push(": ");
        this.visitTypeNode(type);
      }
    }
    if (initializer) {
      sb.push(" = ");
      this.visitNode(initializer);
    }
  };
  ASTBuilder.prototype.serializeExternalModifiers = function(node) {
    var sb = this.sb;
    if (node.is(common_1.CommonFlags.EXPORT)) {
      sb.push("export ");
    } else if (node.is(common_1.CommonFlags.IMPORT)) {
      sb.push("import ");
    } else if (node.is(common_1.CommonFlags.DECLARE)) {
      sb.push("declare ");
    }
  };
  ASTBuilder.prototype.serializeAccessModifiers = function(node) {
    var sb = this.sb;
    if (node.is(common_1.CommonFlags.PUBLIC)) {
      sb.push("public ");
    } else if (node.is(common_1.CommonFlags.PRIVATE)) {
      sb.push("private ");
    } else if (node.is(common_1.CommonFlags.PROTECTED)) {
      sb.push("protected ");
    }
    if (node.is(common_1.CommonFlags.STATIC)) {
      sb.push("static ");
    } else if (node.is(common_1.CommonFlags.ABSTRACT)) {
      sb.push("abstract ");
    }
    if (node.is(common_1.CommonFlags.READONLY)) {
      sb.push("readonly ");
    }
  };
  ASTBuilder.prototype.finish = function() {
    var ret = this.sb.join("");
    this.sb = [];
    return ret;
  };
  return ASTBuilder;
})();
exports.ASTBuilder = ASTBuilder;
/** An AST builder. */
var ASTWalker = /** @class */ (function() {
  function ASTWalker() {
    this.advice = getEmptyAdvice();
    this.sb = [];
    this.indentLevel = 0;
  }
  ASTWalker.prototype.setAdvice = function(advice) {
    this.advice = advice;
  };
  /** Rebuilds the textual source from the specified AST, as far as possible. */
  ASTWalker.prototype.build = function(node) {
    var builder = this;
    builder.visitNode(node);
    return builder.finish();
  };
  ASTWalker.prototype.visitNode = function(node) {
    this.advice.visitNode(node);
    switch (node.kind) {
      case ast_1.NodeKind.SOURCE: {
        this.visitSource(node);
        break;
      }
      // types
      case ast_1.NodeKind.NAMEDTYPE: {
        this.visitNamedTypeNode(node);
        break;
      }
      case ast_1.NodeKind.FUNCTIONTYPE: {
        this.visitFunctionTypeNode(node);
        break;
      }
      case ast_1.NodeKind.TYPEPARAMETER: {
        this.visitTypeParameter(node);
        break;
      }
      // expressions
      case ast_1.NodeKind.FALSE:
      case ast_1.NodeKind.NULL:
      case ast_1.NodeKind.SUPER:
      case ast_1.NodeKind.THIS:
      case ast_1.NodeKind.TRUE:
      case ast_1.NodeKind.CONSTRUCTOR:
      case ast_1.NodeKind.IDENTIFIER: {
        this.visitIdentifierExpression(node);
        break;
      }
      case ast_1.NodeKind.ASSERTION: {
        this.visitAssertionExpression(node);
        break;
      }
      case ast_1.NodeKind.BINARY: {
        this.visitBinaryExpression(node);
        break;
      }
      case ast_1.NodeKind.CALL: {
        this.visitCallExpression(node);
        break;
      }
      case ast_1.NodeKind.CLASS: {
        this.visitClassExpression(node);
        break;
      }
      case ast_1.NodeKind.COMMA: {
        this.visitCommaExpression(node);
        break;
      }
      case ast_1.NodeKind.ELEMENTACCESS: {
        this.visitElementAccessExpression(node);
        break;
      }
      case ast_1.NodeKind.FUNCTION: {
        this.visitFunctionExpression(node);
        break;
      }
      case ast_1.NodeKind.INSTANCEOF: {
        this.visitInstanceOfExpression(node);
        break;
      }
      case ast_1.NodeKind.LITERAL: {
        this.visitLiteralExpression(node);
        break;
      }
      case ast_1.NodeKind.NEW: {
        this.visitNewExpression(node);
        break;
      }
      case ast_1.NodeKind.PARENTHESIZED: {
        this.visitParenthesizedExpression(node);
        break;
      }
      case ast_1.NodeKind.PROPERTYACCESS: {
        this.visitPropertyAccessExpression(node);
        break;
      }
      case ast_1.NodeKind.TERNARY: {
        this.visitTernaryExpression(node);
        break;
      }
      case ast_1.NodeKind.UNARYPOSTFIX: {
        this.visitUnaryPostfixExpression(node);
        break;
      }
      case ast_1.NodeKind.UNARYPREFIX: {
        this.visitUnaryPrefixExpression(node);
        break;
      }
      // statements
      case ast_1.NodeKind.BLOCK: {
        this.visitBlockStatement(node);
        break;
      }
      case ast_1.NodeKind.BREAK: {
        this.visitBreakStatement(node);
        break;
      }
      case ast_1.NodeKind.CONTINUE: {
        this.visitContinueStatement(node);
        break;
      }
      case ast_1.NodeKind.DO: {
        this.visitDoStatement(node);
        break;
      }
      case ast_1.NodeKind.EMPTY: {
        this.visitEmptyStatement(node);
        break;
      }
      case ast_1.NodeKind.EXPORT: {
        this.visitExportStatement(node);
        break;
      }
      case ast_1.NodeKind.EXPORTDEFAULT: {
        this.visitExportDefaultStatement(node);
        break;
      }
      case ast_1.NodeKind.EXPORTIMPORT: {
        this.visitExportImportStatement(node);
        break;
      }
      case ast_1.NodeKind.EXPRESSION: {
        this.visitExpressionStatement(node);
        break;
      }
      case ast_1.NodeKind.FOR: {
        this.visitForStatement(node);
        break;
      }
      case ast_1.NodeKind.IF: {
        this.visitIfStatement(node);
        break;
      }
      case ast_1.NodeKind.IMPORT: {
        this.visitImportStatement(node);
        break;
      }
      case ast_1.NodeKind.RETURN: {
        this.visitReturnStatement(node);
        break;
      }
      case ast_1.NodeKind.SWITCH: {
        this.visitSwitchStatement(node);
        break;
      }
      case ast_1.NodeKind.THROW: {
        this.visitThrowStatement(node);
        break;
      }
      case ast_1.NodeKind.TRY: {
        this.visitTryStatement(node);
        break;
      }
      case ast_1.NodeKind.VARIABLE: {
        this.visitVariableStatement(node);
        break;
      }
      case ast_1.NodeKind.WHILE: {
        this.visitWhileStatement(node);
        break;
      }
      // declaration statements
      case ast_1.NodeKind.CLASSDECLARATION: {
        this.visitClassDeclaration(node);
        break;
      }
      case ast_1.NodeKind.ENUMDECLARATION: {
        this.visitEnumDeclaration(node);
        break;
      }
      case ast_1.NodeKind.ENUMVALUEDECLARATION: {
        this.visitEnumValueDeclaration(node);
        break;
      }
      case ast_1.NodeKind.FIELDDECLARATION: {
        this.visitFieldDeclaration(node);
        break;
      }
      case ast_1.NodeKind.FUNCTIONDECLARATION: {
        this.visitFunctionDeclaration(node);
        break;
      }
      case ast_1.NodeKind.IMPORTDECLARATION: {
        this.visitImportDeclaration(node);
        break;
      }
      case ast_1.NodeKind.INDEXSIGNATUREDECLARATION: {
        this.visitIndexSignatureDeclaration(node);
        break;
      }
      case ast_1.NodeKind.INTERFACEDECLARATION: {
        this.visitInterfaceDeclaration(node);
        break;
      }
      case ast_1.NodeKind.METHODDECLARATION: {
        this.visitMethodDeclaration(node);
        break;
      }
      case ast_1.NodeKind.NAMESPACEDECLARATION: {
        this.visitNamespaceDeclaration(node);
        break;
      }
      case ast_1.NodeKind.TYPEDECLARATION: {
        this.visitTypeDeclaration(node);
        break;
      }
      case ast_1.NodeKind.VARIABLEDECLARATION: {
        this.visitVariableDeclaration(node);
        break;
      }
      // other
      case ast_1.NodeKind.DECORATOR: {
        this.serializeDecorator(node);
        break;
      }
      case ast_1.NodeKind.EXPORTMEMBER: {
        this.visitExportMember(node);
        break;
      }
      case ast_1.NodeKind.PARAMETER: {
        this.serializeParameter(node);
        break;
      }
      case ast_1.NodeKind.SWITCHCASE: {
        this.visitSwitchCase(node);
        break;
      }
      default:
        assert(false);
    }
  };
  ASTWalker.prototype.visitSource = function(source) {
    this.advice.visitSource(source);
    var statements = source.statements;
    for (var i = 0, k = statements.length; i < k; ++i) {
      this.visitNodeAndTerminate(statements[i]);
    }
  };
  // types
  ASTWalker.prototype.visitTypeNode = function(node) {
    this.advice.visitTypeNode(node);
    switch (node.kind) {
      case ast_1.NodeKind.NAMEDTYPE: {
        this.visitNamedTypeNode(node);
        break;
      }
      case ast_1.NodeKind.FUNCTIONTYPE: {
        this.visitFunctionTypeNode(node);
        break;
      }
      default:
        assert(false);
    }
  };
  ASTWalker.prototype.visitTypeName = function(node) {
    this.advice.visitTypeName(node);
    this.visitIdentifierExpression(node.identifier);
    var sb = this.sb;
    var current = node.next;
    while (current) {
      sb.push(".");
      this.visitIdentifierExpression(current.identifier);
      current = current.next;
    }
  };
  ASTWalker.prototype.visitNamedTypeNode = function(node) {
    this.advice.visitNamedTypeNode(node);
    this.visitTypeName(node.name);
    var typeArguments = node.typeArguments;
    if (typeArguments) {
      var numTypeArguments = typeArguments.length;
      var sb = this.sb;
      if (numTypeArguments) {
        sb.push("<");
        this.visitTypeNode(typeArguments[0]);
        for (var i = 1; i < numTypeArguments; ++i) {
          sb.push(", ");
          this.visitTypeNode(typeArguments[i]);
        }
        sb.push(">");
      }
      if (node.isNullable) sb.push(" | null");
    }
  };
  ASTWalker.prototype.visitFunctionTypeNode = function(node) {
    this.advice.visitFunctionTypeNode(node);
    var isNullable = node.isNullable;
    var sb = this.sb;
    sb.push(isNullable ? "((" : "(");
    var explicitThisType = node.explicitThisType;
    if (explicitThisType) {
      sb.push("this: ");
      this.visitTypeNode(explicitThisType);
    }
    var parameters = node.parameters;
    var numParameters = parameters.length;
    if (numParameters) {
      if (explicitThisType) sb.push(", ");
      this.serializeParameter(parameters[0]);
      for (var i = 1; i < numParameters; ++i) {
        sb.push(", ");
        this.serializeParameter(parameters[i]);
      }
    }
    var returnType = node.returnType;
    if (returnType) {
      sb.push(") => ");
      this.visitTypeNode(returnType);
    } else {
      sb.push(") => void");
    }
    if (isNullable) sb.push(") | null");
  };
  ASTWalker.prototype.visitTypeParameter = function(node) {
    this.advice.visitTypeParameter(node);
    this.visitIdentifierExpression(node.name);
    var extendsType = node.extendsType;
    if (extendsType) {
      this.sb.push(" extends ");
      this.visitTypeNode(extendsType);
    }
    var defaultType = node.defaultType;
    if (defaultType) {
      this.sb.push("=");
      this.visitTypeNode(defaultType);
    }
  };
  // expressions
  ASTWalker.prototype.visitIdentifierExpression = function(node) {
    this.advice.visitIdentifierExpression(node);
    if (node.isQuoted) this.visitStringLiteral(node.text);
    else this.sb.push(node.text);
  };
  ASTWalker.prototype.visitArrayLiteralExpression = function(node) {
    this.advice.visitArrayLiteralExpression(node);
    var sb = this.sb;
    sb.push("[");
    var elements = node.elementExpressions;
    var numElements = elements.length;
    if (numElements) {
      if (elements[0]) this.visitNode(elements[0]);
      for (var i = 1; i < numElements; ++i) {
        sb.push(", ");
        if (elements[i]) this.visitNode(elements[i]);
      }
    }
    sb.push("]");
  };
  ASTWalker.prototype.visitObjectLiteralExpression = function(node) {
    this.advice.visitObjectLiteralExpression(node);
    var sb = this.sb;
    var names = node.names;
    var values = node.values;
    var numElements = names.length;
    assert(numElements == values.length);
    if (numElements) {
      sb.push("{\n");
      text_1.indent(sb, ++this.indentLevel);
      this.visitNode(names[0]);
      sb.push(": ");
      this.visitNode(values[0]);
      for (var i = 1; i < numElements; ++i) {
        sb.push(",\n");
        text_1.indent(sb, this.indentLevel);
        var name_2 = names[i];
        var value = values[i];
        if (name_2 === value) {
          this.visitNode(name_2);
        } else {
          this.visitNode(name_2);
          sb.push(": ");
          this.visitNode(value);
        }
      }
      sb.push("\n");
      text_1.indent(sb, --this.indentLevel);
      sb.push("}");
    } else {
      sb.push("{}");
    }
  };
  ASTWalker.prototype.visitAssertionExpression = function(node) {
    this.advice.visitAssertionExpression(node);
    var sb = this.sb;
    switch (node.assertionKind) {
      case ast_1.AssertionKind.PREFIX: {
        sb.push("<");
        this.visitTypeNode(assert(node.toType));
        sb.push(">");
        this.visitNode(node.expression);
        break;
      }
      case ast_1.AssertionKind.AS: {
        this.visitNode(node.expression);
        sb.push(" as ");
        this.visitTypeNode(assert(node.toType));
        break;
      }
      case ast_1.AssertionKind.NONNULL: {
        this.visitNode(node.expression);
        sb.push("!");
        break;
      }
      case ast_1.AssertionKind.CONST: {
        this.visitNode(node.expression);
        sb.push(" as const");
        break;
      }
      default:
        assert(false);
    }
  };
  ASTWalker.prototype.visitBinaryExpression = function(node) {
    this.advice.visitBinaryExpression(node);
    var sb = this.sb;
    this.visitNode(node.left);
    sb.push(" ");
    sb.push(tokenizer_1.operatorTokenToString(node.operator));
    sb.push(" ");
    this.visitNode(node.right);
  };
  ASTWalker.prototype.visitCallExpression = function(node) {
    this.advice.visitCallExpression(node);
    this.advice.visitCallExpression(node);
    this.visitNode(node.expression);
    this.visitArguments(node.typeArguments, node.arguments);
  };
  ASTWalker.prototype.visitArguments = function(typeArguments, args) {
    var sb = this.sb;
    if (typeArguments) {
      var numTypeArguments = typeArguments.length;
      if (numTypeArguments) {
        sb.push("<");
        this.visitTypeNode(typeArguments[0]);
        for (var i = 1; i < numTypeArguments; ++i) {
          sb.push(", ");
          this.visitTypeNode(typeArguments[i]);
        }
        sb.push(">(");
      }
    } else {
      sb.push("(");
    }
    var numArgs = args.length;
    if (numArgs) {
      this.visitNode(args[0]);
      for (var i = 1; i < numArgs; ++i) {
        sb.push(", ");
        this.visitNode(args[i]);
      }
    }
    sb.push(")");
  };
  ASTWalker.prototype.visitClassExpression = function(node) {
    this.advice.visitClassExpression(node);
    var declaration = node.declaration;
    this.visitClassDeclaration(declaration);
  };
  ASTWalker.prototype.visitCommaExpression = function(node) {
    this.advice.visitCommaExpression(node);
    var expressions = node.expressions;
    var numExpressions = assert(expressions.length);
    this.visitNode(expressions[0]);
    var sb = this.sb;
    for (var i = 1; i < numExpressions; ++i) {
      sb.push(",");
      this.visitNode(expressions[i]);
    }
  };
  ASTWalker.prototype.visitElementAccessExpression = function(node) {
    this.advice.visitElementAccessExpression(node);
    var sb = this.sb;
    this.visitNode(node.expression);
    sb.push("[");
    this.visitNode(node.elementExpression);
    sb.push("]");
  };
  ASTWalker.prototype.visitFunctionExpression = function(node) {
    this.advice.visitFunctionExpression(node);
    var declaration = node.declaration;
    if (!declaration.arrowKind) {
      if (declaration.name.text.length) {
        this.sb.push("function ");
      } else {
        this.sb.push("function");
      }
    } else {
      assert(declaration.name.text.length == 0);
    }
    this.visitFunctionCommon(declaration);
  };
  ASTWalker.prototype.visitLiteralExpression = function(node) {
    this.advice.visitLiteralExpression(node);
    switch (node.literalKind) {
      case ast_1.LiteralKind.FLOAT: {
        this.visitFloatLiteralExpression(node);
        break;
      }
      case ast_1.LiteralKind.INTEGER: {
        this.visitIntegerLiteralExpression(node);
        break;
      }
      case ast_1.LiteralKind.STRING: {
        this.visitStringLiteralExpression(node);
        break;
      }
      case ast_1.LiteralKind.REGEXP: {
        this.visitRegexpLiteralExpression(node);
        break;
      }
      case ast_1.LiteralKind.ARRAY: {
        this.visitArrayLiteralExpression(node);
        break;
      }
      case ast_1.LiteralKind.OBJECT: {
        this.visitObjectLiteralExpression(node);
        break;
      }
      default: {
        assert(false);
        break;
      }
    }
  };
  ASTWalker.prototype.visitFloatLiteralExpression = function(node) {
    this.advice.visitFloatLiteralExpression(node);
    this.sb.push(node.value.toString(10));
  };
  ASTWalker.prototype.visitInstanceOfExpression = function(node) {
    this.advice.visitInstanceOfExpression(node);
    this.visitNode(node.expression);
    this.sb.push(" instanceof ");
    this.visitTypeNode(node.isType);
  };
  ASTWalker.prototype.visitIntegerLiteralExpression = function(node) {
    this.advice.visitIntegerLiteralExpression(node);
    this.sb.push(i64_to_string(node.value));
  };
  ASTWalker.prototype.visitStringLiteral = function(str, singleQuoted) {
    if (singleQuoted === void 0) {
      singleQuoted = false;
    }
    this.advice.visitStringLiteral(str, singleQuoted);
    var sb = this.sb;
    var off = 0;
    var quote = singleQuoted ? "'" : '"';
    sb.push(quote);
    var i = 0;
    for (var k = str.length; i < k; ) {
      switch (str.charCodeAt(i)) {
        case 0 /* NULL */: {
          if (i > off) sb.push(str.substring(off, (off = i + 1)));
          sb.push("\\0");
          off = ++i;
          break;
        }
        case 8 /* BACKSPACE */: {
          if (i > off) sb.push(str.substring(off, i));
          off = ++i;
          sb.push("\\b");
          break;
        }
        case 9 /* TAB */: {
          if (i > off) sb.push(str.substring(off, i));
          off = ++i;
          sb.push("\\t");
          break;
        }
        case 10 /* LINEFEED */: {
          if (i > off) sb.push(str.substring(off, i));
          off = ++i;
          sb.push("\\n");
          break;
        }
        case 11 /* VERTICALTAB */: {
          if (i > off) sb.push(str.substring(off, i));
          off = ++i;
          sb.push("\\v");
          break;
        }
        case 12 /* FORMFEED */: {
          if (i > off) sb.push(str.substring(off, i));
          off = ++i;
          sb.push("\\f");
          break;
        }
        case 13 /* CARRIAGERETURN */: {
          if (i > off) sb.push(str.substring(off, i));
          sb.push("\\r");
          off = ++i;
          break;
        }
        case 34 /* DOUBLEQUOTE */: {
          if (!singleQuoted) {
            if (i > off) sb.push(str.substring(off, i));
            sb.push('\\"');
            off = ++i;
          } else {
            ++i;
          }
          break;
        }
        case 39 /* SINGLEQUOTE */: {
          if (singleQuoted) {
            if (i > off) sb.push(str.substring(off, i));
            sb.push("\\'");
            off = ++i;
          } else {
            ++i;
          }
          break;
        }
        case 92 /* BACKSLASH */: {
          if (i > off) sb.push(str.substring(off, i));
          sb.push("\\\\");
          off = ++i;
          break;
        }
        default: {
          ++i;
          break;
        }
      }
    }
    if (i > off) sb.push(str.substring(off, i));
    sb.push(quote);
  };
  ASTWalker.prototype.visitStringLiteralExpression = function(node) {
    this.advice.visitStringLiteralExpression(node);
    this.visitStringLiteral(node.value);
  };
  ASTWalker.prototype.visitRegexpLiteralExpression = function(node) {
    this.advice.visitRegexpLiteralExpression(node);
    var sb = this.sb;
    sb.push("/");
    sb.push(node.pattern);
    sb.push("/");
    sb.push(node.patternFlags);
  };
  ASTWalker.prototype.visitNewExpression = function(node) {
    this.advice.visitNewExpression(node);
    this.sb.push("new ");
    this.visitTypeName(node.typeName);
    this.visitArguments(node.typeArguments, node.arguments);
  };
  ASTWalker.prototype.visitParenthesizedExpression = function(node) {
    this.advice.visitParenthesizedExpression(node);
    var sb = this.sb;
    sb.push("(");
    this.visitNode(node.expression);
    sb.push(")");
  };
  ASTWalker.prototype.visitPropertyAccessExpression = function(node) {
    this.advice.visitPropertyAccessExpression(node);
    this.visitNode(node.expression);
    this.sb.push(".");
    this.visitIdentifierExpression(node.property);
  };
  ASTWalker.prototype.visitTernaryExpression = function(node) {
    this.advice.visitTernaryExpression(node);
    var sb = this.sb;
    this.visitNode(node.condition);
    sb.push(" ? ");
    this.visitNode(node.ifThen);
    sb.push(" : ");
    this.visitNode(node.ifElse);
  };
  ASTWalker.prototype.visitUnaryExpression = function(node) {
    this.advice.visitUnaryExpression(node);
    switch (node.kind) {
      case ast_1.NodeKind.UNARYPOSTFIX: {
        this.visitUnaryPostfixExpression(node);
        break;
      }
      case ast_1.NodeKind.UNARYPREFIX: {
        this.visitUnaryPrefixExpression(node);
        break;
      }
      default:
        assert(false);
    }
  };
  ASTWalker.prototype.visitUnaryPostfixExpression = function(node) {
    this.advice.visitUnaryPostfixExpression(node);
    this.visitNode(node.operand);
    this.sb.push(tokenizer_1.operatorTokenToString(node.operator));
  };
  ASTWalker.prototype.visitUnaryPrefixExpression = function(node) {
    this.advice.visitUnaryPrefixExpression(node);
    this.sb.push(tokenizer_1.operatorTokenToString(node.operator));
    this.visitNode(node.operand);
  };
  // statements
  ASTWalker.prototype.visitNodeAndTerminate = function(statement) {
    this.advice.visitNodeAndTerminate(statement);
    this.visitNode(statement);
    var sb = this.sb;
    if (
      !sb.length || // leading EmptyStatement
      statement.kind == ast_1.NodeKind.VARIABLE || // potentially assigns a FunctionExpression
      statement.kind == ast_1.NodeKind.EXPRESSION // potentially assigns a FunctionExpression
    ) {
      sb.push(";\n");
    } else {
      var last = sb[sb.length - 1];
      var lastCharPos = last.length - 1;
      if (
        lastCharPos >= 0 &&
        (last.charCodeAt(lastCharPos) == 125 /* CLOSEBRACE */ ||
          last.charCodeAt(lastCharPos) == 59) /* SEMICOLON */
      ) {
        sb.push("\n");
      } else {
        sb.push(";\n");
      }
    }
  };
  ASTWalker.prototype.visitBlockStatement = function(node) {
    this.advice.visitBlockStatement(node);
    var sb = this.sb;
    var statements = node.statements;
    var numStatements = statements.length;
    if (numStatements) {
      sb.push("{\n");
      var indentLevel = ++this.indentLevel;
      for (var i = 0; i < numStatements; ++i) {
        text_1.indent(sb, indentLevel);
        this.visitNodeAndTerminate(statements[i]);
      }
      text_1.indent(sb, --this.indentLevel);
      sb.push("}");
    } else {
      sb.push("{}");
    }
  };
  ASTWalker.prototype.visitBreakStatement = function(node) {
    this.advice.visitBreakStatement(node);
    var label = node.label;
    if (label) {
      this.sb.push("break ");
      this.visitIdentifierExpression(label);
    } else {
      this.sb.push("break");
    }
  };
  ASTWalker.prototype.visitContinueStatement = function(node) {
    this.advice.visitContinueStatement(node);
    var label = node.label;
    if (label) {
      this.sb.push("continue ");
      this.visitIdentifierExpression(label);
    } else {
      this.sb.push("continue");
    }
  };
  ASTWalker.prototype.visitClassDeclaration = function(node, isDefault) {
    if (isDefault === void 0) {
      isDefault = false;
    }
    this.advice.visitClassDeclaration(node, isDefault);
    var decorators = node.decorators;
    if (decorators) {
      for (var i = 0, k = decorators.length; i < k; ++i) {
        this.serializeDecorator(decorators[i]);
      }
    }
    var sb = this.sb;
    if (isDefault) {
      sb.push("export default ");
    } else {
      this.serializeExternalModifiers(node);
    }
    if (node.is(common_1.CommonFlags.ABSTRACT)) sb.push("abstract ");
    if (node.name.text.length) {
      sb.push("class ");
      this.visitIdentifierExpression(node.name);
    } else {
      sb.push("class");
    }
    var typeParameters = node.typeParameters;
    if (typeParameters && typeParameters.length) {
      sb.push("<");
      this.visitTypeParameter(typeParameters[0]);
      for (var i = 1, k = typeParameters.length; i < k; ++i) {
        sb.push(", ");
        this.visitTypeParameter(typeParameters[i]);
      }
      sb.push(">");
    }
    var extendsType = node.extendsType;
    if (extendsType) {
      sb.push(" extends ");
      this.visitTypeNode(extendsType);
    }
    var implementsTypes = node.implementsTypes;
    if (implementsTypes) {
      var numImplementsTypes = implementsTypes.length;
      if (numImplementsTypes) {
        sb.push(" implements ");
        this.visitTypeNode(implementsTypes[0]);
        for (var i = 1; i < numImplementsTypes; ++i) {
          sb.push(", ");
          this.visitTypeNode(implementsTypes[i]);
        }
      }
    }
    var members = node.members;
    var numMembers = members.length;
    if (numMembers) {
      sb.push(" {\n");
      var indentLevel = ++this.indentLevel;
      for (var i = 0, k = members.length; i < k; ++i) {
        var member = members[i];
        if (
          member.kind != ast_1.NodeKind.FIELDDECLARATION ||
          member.parameterIndex < 0
        ) {
          text_1.indent(sb, indentLevel);
          this.visitNodeAndTerminate(member);
        }
      }
      text_1.indent(sb, --this.indentLevel);
      sb.push("}");
    } else {
      sb.push(" {}");
    }
  };
  ASTWalker.prototype.visitDoStatement = function(node) {
    this.advice.visitDoStatement(node);
    var sb = this.sb;
    sb.push("do ");
    this.visitNode(node.statement);
    if (node.statement.kind == ast_1.NodeKind.BLOCK) {
      sb.push(" while (");
    } else {
      sb.push(";\n");
      text_1.indent(sb, this.indentLevel);
      sb.push("while (");
    }
    this.visitNode(node.condition);
    sb.push(")");
  };
  ASTWalker.prototype.visitEmptyStatement = function(node) {
    this.advice.visitEmptyStatement(node);
  };
  ASTWalker.prototype.visitEnumDeclaration = function(node, isDefault) {
    if (isDefault === void 0) {
      isDefault = false;
    }
    this.advice.visitEnumDeclaration(node, isDefault);
    var sb = this.sb;
    if (isDefault) {
      sb.push("export default ");
    } else {
      this.serializeExternalModifiers(node);
    }
    if (node.is(common_1.CommonFlags.CONST)) sb.push("const ");
    sb.push("enum ");
    this.visitIdentifierExpression(node.name);
    var values = node.values;
    var numValues = values.length;
    if (numValues) {
      sb.push(" {\n");
      var indentLevel = ++this.indentLevel;
      text_1.indent(sb, indentLevel);
      this.visitEnumValueDeclaration(node.values[0]);
      for (var i = 1; i < numValues; ++i) {
        sb.push(",\n");
        text_1.indent(sb, indentLevel);
        this.visitEnumValueDeclaration(node.values[i]);
      }
      sb.push("\n");
      text_1.indent(sb, --this.indentLevel);
      sb.push("}");
    } else {
      sb.push(" {}");
    }
  };
  ASTWalker.prototype.visitEnumValueDeclaration = function(node) {
    this.advice.visitEnumValueDeclaration(node);
    this.visitIdentifierExpression(node.name);
    if (node.value) {
      this.sb.push(" = ");
      this.visitNode(node.value);
    }
  };
  ASTWalker.prototype.visitExportImportStatement = function(node) {
    this.advice.visitExportImportStatement(node);
    var sb = this.sb;
    sb.push("export import ");
    this.visitIdentifierExpression(node.externalName);
    sb.push(" = ");
    this.visitIdentifierExpression(node.name);
  };
  ASTWalker.prototype.visitExportMember = function(node) {
    this.advice.visitExportMember(node);
    this.visitIdentifierExpression(node.localName);
    if (node.exportedName.text != node.localName.text) {
      this.sb.push(" as ");
      this.visitIdentifierExpression(node.exportedName);
    }
  };
  ASTWalker.prototype.visitExportStatement = function(node) {
    this.advice.visitExportStatement(node);
    var sb = this.sb;
    if (node.isDeclare) {
      sb.push("declare ");
    }
    var members = node.members;
    if (members && members.length) {
      var numMembers = members.length;
      sb.push("export {\n");
      var indentLevel = ++this.indentLevel;
      text_1.indent(sb, indentLevel);
      this.visitExportMember(members[0]);
      for (var i = 1; i < numMembers; ++i) {
        sb.push(",\n");
        text_1.indent(sb, indentLevel);
        this.visitExportMember(members[i]);
      }
      --this.indentLevel;
      sb.push("\n}");
    } else {
      sb.push("export {}");
    }
    var path = node.path;
    if (path) {
      sb.push(" from ");
      this.visitStringLiteralExpression(path);
    }
    sb.push(";");
  };
  ASTWalker.prototype.visitExportDefaultStatement = function(node) {
    this.advice.visitExportDefaultStatement(node);
    var declaration = node.declaration;
    switch (declaration.kind) {
      case ast_1.NodeKind.ENUMDECLARATION: {
        this.visitEnumDeclaration(declaration, true);
        break;
      }
      case ast_1.NodeKind.FUNCTIONDECLARATION: {
        this.visitFunctionDeclaration(declaration, true);
        break;
      }
      case ast_1.NodeKind.CLASSDECLARATION: {
        this.visitClassDeclaration(declaration, true);
        break;
      }
      case ast_1.NodeKind.INTERFACEDECLARATION: {
        this.visitInterfaceDeclaration(declaration, true);
        break;
      }
      case ast_1.NodeKind.NAMESPACEDECLARATION: {
        this.visitNamespaceDeclaration(declaration, true);
        break;
      }
      default:
        assert(false);
    }
  };
  ASTWalker.prototype.visitExpressionStatement = function(node) {
    this.advice.visitExpressionStatement(node);
    this.visitNode(node.expression);
  };
  ASTWalker.prototype.visitFieldDeclaration = function(node) {
    this.advice.visitFieldDeclaration(node);
    var decorators = node.decorators;
    if (decorators) {
      for (var i = 0, k = decorators.length; i < k; ++i) {
        this.serializeDecorator(decorators[i]);
      }
    }
    this.serializeAccessModifiers(node);
    this.visitIdentifierExpression(node.name);
    var sb = this.sb;
    if (node.flags & common_1.CommonFlags.DEFINITE_ASSIGNMENT) {
      sb.push("!");
    }
    var type = node.type;
    if (type) {
      sb.push(": ");
      this.visitTypeNode(type);
    }
    var initializer = node.initializer;
    if (initializer) {
      sb.push(" = ");
      this.visitNode(initializer);
    }
  };
  ASTWalker.prototype.visitForStatement = function(node) {
    this.advice.visitForStatement(node);
    var sb = this.sb;
    sb.push("for (");
    var initializer = node.initializer;
    if (initializer) {
      this.visitNode(initializer);
    }
    var condition = node.condition;
    if (condition) {
      sb.push("; ");
      this.visitNode(condition);
    } else {
      sb.push(";");
    }
    var incrementor = node.incrementor;
    if (incrementor) {
      sb.push("; ");
      this.visitNode(incrementor);
    } else {
      sb.push(";");
    }
    sb.push(") ");
    this.visitNode(node.statement);
  };
  ASTWalker.prototype.visitFunctionDeclaration = function(node, isDefault) {
    if (isDefault === void 0) {
      isDefault = false;
    }
    this.advice.visitFunctionDeclaration(node, isDefault);
    var sb = this.sb;
    var decorators = node.decorators;
    if (decorators) {
      for (var i = 0, k = decorators.length; i < k; ++i) {
        this.serializeDecorator(decorators[i]);
      }
    }
    if (isDefault) {
      sb.push("export default ");
    } else {
      this.serializeExternalModifiers(node);
      this.serializeAccessModifiers(node);
    }
    if (node.name.text.length) {
      sb.push("function ");
    } else {
      sb.push("function");
    }
    this.visitFunctionCommon(node);
  };
  ASTWalker.prototype.visitFunctionCommon = function(node) {
    this.advice.visitFunctionCommon(node);
    var sb = this.sb;
    this.visitIdentifierExpression(node.name);
    var signature = node.signature;
    var typeParameters = node.typeParameters;
    if (typeParameters) {
      var numTypeParameters = typeParameters.length;
      if (numTypeParameters) {
        sb.push("<");
        this.visitTypeParameter(typeParameters[0]);
        for (var i = 1; i < numTypeParameters; ++i) {
          sb.push(", ");
          this.visitTypeParameter(typeParameters[i]);
        }
        sb.push(">");
      }
    }
    if (node.arrowKind == 2 /* ARROW_SINGLE */) {
      var parameters = signature.parameters;
      assert(parameters.length == 1);
      assert(!signature.explicitThisType);
      this.serializeParameter(parameters[0]);
    } else {
      sb.push("(");
      var parameters = signature.parameters;
      var numParameters = parameters.length;
      var explicitThisType = signature.explicitThisType;
      if (explicitThisType) {
        sb.push("this: ");
        this.visitTypeNode(explicitThisType);
      }
      if (numParameters) {
        if (explicitThisType) sb.push(", ");
        this.serializeParameter(parameters[0]);
        for (var i = 1; i < numParameters; ++i) {
          sb.push(", ");
          this.serializeParameter(parameters[i]);
        }
      }
    }
    var body = node.body;
    var returnType = signature.returnType;
    if (node.arrowKind) {
      if (body) {
        if (node.arrowKind == 2 /* ARROW_SINGLE */) {
          assert(ast_1.isTypeOmitted(returnType));
        } else {
          if (ast_1.isTypeOmitted(returnType)) {
            sb.push(")");
          } else {
            sb.push("): ");
            this.visitTypeNode(returnType);
          }
        }
        sb.push(" => ");
        this.visitNode(body);
      } else {
        assert(!ast_1.isTypeOmitted(returnType));
        sb.push(" => ");
        this.visitTypeNode(returnType);
      }
    } else {
      if (
        !ast_1.isTypeOmitted(returnType) &&
        !node.isAny(common_1.CommonFlags.CONSTRUCTOR | common_1.CommonFlags.SET)
      ) {
        sb.push("): ");
        this.visitTypeNode(returnType);
      } else {
        sb.push(")");
      }
      if (body) {
        sb.push(" ");
        this.visitNode(body);
      }
    }
  };
  ASTWalker.prototype.visitIfStatement = function(node) {
    this.advice.visitIfStatement(node);
    var sb = this.sb;
    sb.push("if (");
    this.visitNode(node.condition);
    sb.push(") ");
    var ifTrue = node.ifTrue;
    this.visitNode(ifTrue);
    if (ifTrue.kind != ast_1.NodeKind.BLOCK) {
      sb.push(";\n");
    }
    var ifFalse = node.ifFalse;
    if (ifFalse) {
      if (ifTrue.kind == ast_1.NodeKind.BLOCK) {
        sb.push(" else ");
      } else {
        sb.push("else ");
      }
      this.visitNode(ifFalse);
    }
  };
  ASTWalker.prototype.visitImportDeclaration = function(node) {
    this.advice.visitImportDeclaration(node);
    var externalName = node.foreignName;
    var name = node.name;
    this.visitIdentifierExpression(externalName);
    if (externalName.text != name.text) {
      this.sb.push(" as ");
      this.visitIdentifierExpression(name);
    }
  };
  ASTWalker.prototype.visitImportStatement = function(node) {
    this.advice.visitImportStatement(node);
    var sb = this.sb;
    sb.push("import ");
    var declarations = node.declarations;
    var namespaceName = node.namespaceName;
    if (declarations) {
      var numDeclarations = declarations.length;
      if (numDeclarations) {
        sb.push("{\n");
        var indentLevel = ++this.indentLevel;
        text_1.indent(sb, indentLevel);
        this.visitImportDeclaration(declarations[0]);
        for (var i = 1; i < numDeclarations; ++i) {
          sb.push(",\n");
          text_1.indent(sb, indentLevel);
          this.visitImportDeclaration(declarations[i]);
        }
        --this.indentLevel;
        sb.push("\n} from ");
      } else {
        sb.push("{} from ");
      }
    } else if (namespaceName) {
      sb.push("* as ");
      this.visitIdentifierExpression(namespaceName);
      sb.push(" from ");
    }
    this.visitStringLiteralExpression(node.path);
  };
  ASTWalker.prototype.visitIndexSignatureDeclaration = function(node) {
    this.advice.visitIndexSignatureDeclaration(node);
    var sb = this.sb;
    sb.push("[key: ");
    this.visitTypeNode(node.keyType);
    sb.push("]: ");
    this.visitTypeNode(node.valueType);
  };
  ASTWalker.prototype.visitInterfaceDeclaration = function(node, isDefault) {
    if (isDefault === void 0) {
      isDefault = false;
    }
    this.advice.visitInterfaceDeclaration(node, isDefault);
    var decorators = node.decorators;
    if (decorators) {
      for (var i = 0, k = decorators.length; i < k; ++i) {
        this.serializeDecorator(decorators[i]);
      }
    }
    var sb = this.sb;
    if (isDefault) {
      sb.push("export default ");
    } else {
      this.serializeExternalModifiers(node);
    }
    sb.push("interface ");
    this.visitIdentifierExpression(node.name);
    var typeParameters = node.typeParameters;
    if (typeParameters && typeParameters.length) {
      sb.push("<");
      this.visitTypeParameter(typeParameters[0]);
      for (var i = 1, k = typeParameters.length; i < k; ++i) {
        sb.push(", ");
        this.visitTypeParameter(typeParameters[i]);
      }
      sb.push(">");
    }
    var extendsType = node.extendsType;
    if (extendsType) {
      sb.push(" extends ");
      this.visitTypeNode(extendsType);
    }
    // must not have implementsTypes
    sb.push(" {\n");
    var indentLevel = ++this.indentLevel;
    var members = node.members;
    for (var i = 0, k = members.length; i < k; ++i) {
      text_1.indent(sb, indentLevel);
      this.visitNodeAndTerminate(members[i]);
    }
    --this.indentLevel;
    sb.push("}");
  };
  ASTWalker.prototype.visitMethodDeclaration = function(node) {
    this.advice.visitMethodDeclaration(node);
    var decorators = node.decorators;
    if (decorators) {
      for (var i = 0, k = decorators.length; i < k; ++i) {
        this.serializeDecorator(decorators[i]);
      }
    }
    this.serializeAccessModifiers(node);
    if (node.is(common_1.CommonFlags.GET)) {
      this.sb.push("get ");
    } else if (node.is(common_1.CommonFlags.SET)) {
      this.sb.push("set ");
    }
    this.visitFunctionCommon(node);
  };
  ASTWalker.prototype.visitNamespaceDeclaration = function(node, isDefault) {
    if (isDefault === void 0) {
      isDefault = false;
    }
    this.advice.visitNamespaceDeclaration(node, isDefault);
    var decorators = node.decorators;
    if (decorators) {
      for (var i = 0, k = decorators.length; i < k; ++i) {
        this.serializeDecorator(decorators[i]);
      }
    }
    var sb = this.sb;
    if (isDefault) {
      sb.push("export default ");
    } else {
      this.serializeExternalModifiers(node);
    }
    sb.push("namespace ");
    this.visitIdentifierExpression(node.name);
    var members = node.members;
    var numMembers = members.length;
    if (numMembers) {
      sb.push(" {\n");
      var indentLevel = ++this.indentLevel;
      for (var i = 0, k = members.length; i < k; ++i) {
        text_1.indent(sb, indentLevel);
        this.visitNodeAndTerminate(members[i]);
      }
      text_1.indent(sb, --this.indentLevel);
      sb.push("}");
    } else {
      sb.push(" {}");
    }
  };
  ASTWalker.prototype.visitReturnStatement = function(node) {
    this.advice.visitReturnStatement(node);
    var value = node.value;
    if (value) {
      this.sb.push("return ");
      this.visitNode(value);
    } else {
      this.sb.push("return");
    }
  };
  ASTWalker.prototype.visitSwitchCase = function(node) {
    this.advice.visitSwitchCase(node);
    var sb = this.sb;
    var label = node.label;
    if (label) {
      sb.push("case ");
      this.visitNode(label);
      sb.push(":\n");
    } else {
      sb.push("default:\n");
    }
    var statements = node.statements;
    var numStatements = statements.length;
    if (numStatements) {
      var indentLevel = ++this.indentLevel;
      text_1.indent(sb, indentLevel);
      this.visitNodeAndTerminate(statements[0]);
      for (var i = 1; i < numStatements; ++i) {
        text_1.indent(sb, indentLevel);
        this.visitNodeAndTerminate(statements[i]);
      }
      --this.indentLevel;
    }
  };
  ASTWalker.prototype.visitSwitchStatement = function(node) {
    this.advice.visitSwitchStatement(node);
    var sb = this.sb;
    sb.push("switch (");
    this.visitNode(node.condition);
    sb.push(") {\n");
    var indentLevel = ++this.indentLevel;
    var cases = node.cases;
    for (var i = 0, k = cases.length; i < k; ++i) {
      text_1.indent(sb, indentLevel);
      this.visitSwitchCase(cases[i]);
      sb.push("\n");
    }
    --this.indentLevel;
    sb.push("}");
  };
  ASTWalker.prototype.visitThrowStatement = function(node) {
    this.advice.visitThrowStatement(node);
    this.sb.push("throw ");
    this.visitNode(node.value);
  };
  ASTWalker.prototype.visitTryStatement = function(node) {
    this.advice.visitTryStatement(node);
    var sb = this.sb;
    sb.push("try {\n");
    var indentLevel = ++this.indentLevel;
    var statements = node.statements;
    for (var i = 0, k = statements.length; i < k; ++i) {
      text_1.indent(sb, indentLevel);
      this.visitNodeAndTerminate(statements[i]);
    }
    var catchVariable = node.catchVariable;
    if (catchVariable) {
      text_1.indent(sb, indentLevel - 1);
      sb.push("} catch (");
      this.visitIdentifierExpression(catchVariable);
      sb.push(") {\n");
      var catchStatements = node.catchStatements;
      if (catchStatements) {
        for (var i = 0, k = catchStatements.length; i < k; ++i) {
          text_1.indent(sb, indentLevel);
          this.visitNodeAndTerminate(catchStatements[i]);
        }
      }
    }
    var finallyStatements = node.finallyStatements;
    if (finallyStatements) {
      text_1.indent(sb, indentLevel - 1);
      sb.push("} finally {\n");
      for (var i = 0, k = finallyStatements.length; i < k; ++i) {
        text_1.indent(sb, indentLevel);
        this.visitNodeAndTerminate(finallyStatements[i]);
      }
    }
    text_1.indent(sb, indentLevel - 1);
    sb.push("}");
  };
  ASTWalker.prototype.visitTypeDeclaration = function(node) {
    this.advice.visitTypeDeclaration(node);
    var decorators = node.decorators;
    if (decorators) {
      for (var i = 0, k = decorators.length; i < k; ++i) {
        this.serializeDecorator(decorators[i]);
      }
    }
    var sb = this.sb;
    this.serializeExternalModifiers(node);
    sb.push("type ");
    this.visitIdentifierExpression(node.name);
    var typeParameters = node.typeParameters;
    if (typeParameters) {
      var numTypeParameters = typeParameters.length;
      if (numTypeParameters) {
        sb.push("<");
        for (var i = 0; i < numTypeParameters; ++i) {
          this.visitTypeParameter(typeParameters[i]);
        }
        sb.push(">");
      }
    }
    sb.push(" = ");
    this.visitTypeNode(node.type);
  };
  ASTWalker.prototype.visitVariableDeclaration = function(node) {
    this.advice.visitVariableDeclaration(node);
    this.visitIdentifierExpression(node.name);
    var type = node.type;
    var sb = this.sb;
    if (node.flags & common_1.CommonFlags.DEFINITE_ASSIGNMENT) {
      sb.push("!");
    }
    if (type) {
      sb.push(": ");
      this.visitTypeNode(type);
    }
    var initializer = node.initializer;
    if (initializer) {
      sb.push(" = ");
      this.visitNode(initializer);
    }
  };
  ASTWalker.prototype.visitVariableStatement = function(node) {
    this.advice.visitVariableStatement(node);
    var decorators = node.decorators;
    if (decorators) {
      for (var i = 0, k = decorators.length; i < k; ++i) {
        this.serializeDecorator(decorators[i]);
      }
    }
    var sb = this.sb;
    var declarations = node.declarations;
    var numDeclarations = assert(declarations.length);
    var firstDeclaration = declarations[0];
    this.serializeExternalModifiers(firstDeclaration);
    sb.push(
      firstDeclaration.is(common_1.CommonFlags.CONST)
        ? "const "
        : firstDeclaration.is(common_1.CommonFlags.LET)
        ? "let "
        : "var "
    );
    this.visitVariableDeclaration(node.declarations[0]);
    for (var i = 1; i < numDeclarations; ++i) {
      sb.push(", ");
      this.visitVariableDeclaration(node.declarations[i]);
    }
  };
  ASTWalker.prototype.visitWhileStatement = function(node) {
    this.advice.visitWhileStatement(node);
    var sb = this.sb;
    sb.push("while (");
    this.visitNode(node.condition);
    var statement = node.statement;
    if (statement.kind == ast_1.NodeKind.EMPTY) {
      sb.push(")");
    } else {
      sb.push(") ");
      this.visitNode(node.statement);
    }
  };
  // other
  ASTWalker.prototype.serializeDecorator = function(node) {
    var sb = this.sb;
    sb.push("@");
    this.visitNode(node.name);
    var args = node.arguments;
    if (args) {
      sb.push("(");
      var numArgs = args.length;
      if (numArgs) {
        this.visitNode(args[0]);
        for (var i = 1; i < numArgs; ++i) {
          sb.push(", ");
          this.visitNode(args[i]);
        }
      }
      sb.push(")\n");
    } else {
      sb.push("\n");
    }
    text_1.indent(sb, this.indentLevel);
  };
  ASTWalker.prototype.serializeParameter = function(node) {
    var sb = this.sb;
    var kind = node.parameterKind;
    var implicitFieldDeclaration = node.implicitFieldDeclaration;
    if (implicitFieldDeclaration) {
      this.serializeAccessModifiers(implicitFieldDeclaration);
    }
    if (kind == ast_1.ParameterKind.REST) {
      sb.push("...");
    }
    this.visitIdentifierExpression(node.name);
    var type = node.type;
    var initializer = node.initializer;
    if (type) {
      if (kind == ast_1.ParameterKind.OPTIONAL) sb.push("?");
      if (!ast_1.isTypeOmitted(type)) {
        sb.push(": ");
        this.visitTypeNode(type);
      }
    }
    if (initializer) {
      sb.push(" = ");
      this.visitNode(initializer);
    }
  };
  ASTWalker.prototype.serializeExternalModifiers = function(node) {
    var sb = this.sb;
    if (node.is(common_1.CommonFlags.EXPORT)) {
      sb.push("export ");
    } else if (node.is(common_1.CommonFlags.IMPORT)) {
      sb.push("import ");
    } else if (node.is(common_1.CommonFlags.DECLARE)) {
      sb.push("declare ");
    }
  };
  ASTWalker.prototype.serializeAccessModifiers = function(node) {
    var sb = this.sb;
    if (node.is(common_1.CommonFlags.PUBLIC)) {
      sb.push("public ");
    } else if (node.is(common_1.CommonFlags.PRIVATE)) {
      sb.push("private ");
    } else if (node.is(common_1.CommonFlags.PROTECTED)) {
      sb.push("protected ");
    }
    if (node.is(common_1.CommonFlags.STATIC)) {
      sb.push("static ");
    } else if (node.is(common_1.CommonFlags.ABSTRACT)) {
      sb.push("abstract ");
    }
    if (node.is(common_1.CommonFlags.READONLY)) {
      sb.push("readonly ");
    }
  };
  ASTWalker.prototype.finish = function() {
    var ret = this.sb.join("");
    this.sb = [];
    return ret;
  };
  return ASTWalker;
})();
exports.ASTWalker = ASTWalker;
