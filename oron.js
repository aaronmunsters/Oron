"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
// code below heavily based upon https://blog.scottlogic.com/2017/05/02/typescript-compiler-api-revisited.html
var ts = require("typescript");
var fs_1 = require("fs");
var _a = process.argv, _0 = _a[0], _1 = _a[1], sourceCodeFile = _a[2], analysisFile = _a[3], outputFile = _a[4]; // only capture 3 args
if (!(sourceCodeFile && analysisFile && outputFile)) {
    console.error("Oron requires 3 args: <input> <analysis> <outputfile>");
    console.info("For more, visit https://github.com/aaronmunsters/Oron");
    process.exit();
}
var asTypeDefinitions = __dirname + "/dependancies/oron/typedefs.d.ts";
var stdLib = fs_1.readdirSync(__dirname + "/node_modules/assemblyscript/std/assembly").filter(function (filename) { return filename.endsWith("ts"); });
function partOfAssemblyScriptStdLib(s) {
    return s === "Math"; // This can be expanded with the full library
}
var analysisProgram = ts.createProgram([asTypeDefinitions, analysisFile].concat(stdLib), {});
var analysisSourceFile = analysisProgram.getSourceFile(analysisFile);
var analysisDefinitions = {
    className: "",
    classInstance: null,
    methods: [],
    oronShouldAdd: false
};
var functionCallArgs = new Set();
var functionVoidCallArgs = new Set();
function initAnalysis(node) {
    /** Determine wheter @param n is a class instance extending OronAnalysis
     *
     * In case the analysis includes an extension of the class, all
     * implemented methods (which would define the respective trap)
     * are added to a list. In case the class has been instantiated
     * Oron will not do this manually and traps will refer to this
     * instance. If not, Oron will also instantiate the class.
     */
    function determineAnalysisSpec(n) {
        if (ts.isClassDeclaration(n) &&
            n.heritageClauses &&
            n.heritageClauses.some(function (hc) {
                return hc.token === ts.SyntaxKind.ExtendsKeyword && // whether or not this implements Oron
                    hc.types.some(function (type) {
                        return ts.isIdentifier(type.expression) &&
                            type.expression.text === "OronAnalysis";
                    } // Class to extend
                    );
            })) {
            analysisDefinitions.className = n.name.text;
            /* Upon reaching this code, it is known this is a class implementing the Oron analysis */
            n.forEachChild(function (n) {
                if (ts.isMethodDeclaration(n) && ts.isIdentifier(n.name)) {
                    analysisDefinitions.methods.push(n.name.text); // add to "implemented" analyses
                }
            });
        }
        else if (ts.isVariableStatement(n)) {
            n.declarationList.declarations.forEach(function (decl) {
                var init = decl.initializer;
                /* Not all variables might have been initialized */
                if (init && ts.isNewExpression(init)) {
                    var exp = init.expression;
                    if (ts.isIdentifier(exp)) {
                        if (exp.text === analysisDefinitions.className) {
                            if (ts.isIdentifier(decl.name)) {
                                /* The analysis developer has included their own instance of the analysis */
                                analysisDefinitions.classInstance = decl.name;
                            }
                        }
                    }
                }
            });
        }
    }
    /* Expected source code, look in every statent for class */
    ts.forEachChild(node, determineAnalysisSpec);
    if (!analysisDefinitions.classInstance) {
        analysisDefinitions.classInstance = ts.createIdentifier("myAnalysis");
        analysisDefinitions.oronShouldAdd = true;
    }
}
initAnalysis(analysisSourceFile);
var program = ts.createProgram([asTypeDefinitions, sourceCodeFile], {});
var typechecker = program.getTypeChecker();
var printer = ts.createPrinter();
var sourceFile = program.getSourceFile(sourceCodeFile);
var getTypeNode = function (n) {
    return typechecker.typeToTypeNode(typechecker.getTypeAtLocation(n));
};
var createStringLiteral = function (s) {
    return ts.createLiteral(ts.createStringLiteral(s));
};
function isShortHandAssignmentToken(token) {
    return [
        ts.SyntaxKind.BarEqualsToken,
        ts.SyntaxKind.PlusEqualsToken,
        ts.SyntaxKind.SlashEqualsToken,
        ts.SyntaxKind.CaretEqualsToken,
        ts.SyntaxKind.MinusEqualsToken,
        ts.SyntaxKind.PercentEqualsToken,
        ts.SyntaxKind.AmpersandEqualsToken,
        ts.SyntaxKind.ExclamationEqualsToken,
        ts.SyntaxKind.AsteriskAsteriskEqualsToken,
        ts.SyntaxKind.LessThanLessThanEqualsToken,
        ts.SyntaxKind.GreaterThanGreaterThanEqualsToken,
        ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken,
    ].some(function (t) { return t === token.kind; });
}
function isAssignmentToken(node) {
    return (isShortHandAssignmentToken(node) || node.kind === ts.SyntaxKind.EqualsToken);
}
function analysisDefined(m) {
    return analysisDefinitions.methods.some(function (v) { return v === m; });
}
function isLeftOfAssignment(node) {
    return (ts.isBinaryExpression(node.parent) &&
        isAssignmentToken(node.parent.operatorToken) &&
        node.parent.left === node);
}
var transformer = function (context) { return function (rootNode) {
    function visit(node) {
        var _a;
        if (analysisDefined("propertyAccess") &&
            ts.isPropertyAccessExpression(node) &&
            !isLeftOfAssignment(node) &&
            !ts.isCallExpression(node.parent)) {
            var propAccessExpr = node;
            var objT_1 = typechecker.getTypeAtLocation(propAccessExpr.expression);
            var retT_1 = typechecker.getTypeAtLocation(propAccessExpr.name);
            var objTn = typechecker.typeToTypeNode(objT_1); // getTypeNode(propAccessExpr.expression);
            var retTn = typechecker.typeToTypeNode(retT_1); // getTypeNode(propAccessExpr.name);
            if (["IMath", "INativeMath", "INativeMath", "IMath", "IMath"].some(function (native) {
                return typechecker.typeToString(retT_1).includes(native) ||
                    typechecker.typeToString(objT_1).includes(native);
            })) {
                // Case in which native libraries such as IMath are accessed for a constant such as PI
                return ts.visitEachChild(node, visit, context);
            }
            if (ts.isTypeReferenceNode(objTn) &&
                ts.isIdentifier(objTn.typeName) &&
                partOfAssemblyScriptStdLib(objTn.typeName.text)) {
                return ts.visitEachChild(node, visit, context); // do not further instrument, part standard library
            }
            if (typechecker.typeToString(objT_1).startsWith("StaticArray") &&
                propAccessExpr.name.text === "length") {
                // Reading the length of a static array is accessing it's static header, differs from a read
                return ts.visitEachChild(node, visit, context); // do not further instrument, part standard library
            }
            // A check should be performed whenever the type is a compound structure
            // As compount types such as "StaticArray<i32>" are currently still resolved
            var retString = createStringLiteral(propAccessExpr.name.text);
            if (typechecker.typeToString(objT_1).endsWith("[]") &&
                propAccessExpr.name.text === "length") {
                // Length is a getter, refering to a method, replaced with length_ fixes the compiler complaint
                retString = createStringLiteral("length_");
            }
            // obj.prop
            // ==TRANSFORM==>
            // getTrap<ObjClass, PropType>(obj, "prop", offsetof<ObjClass>("prop"))
            return ts.createCall(ts.createPropertyAccess(analysisDefinitions.classInstance, ts.createIdentifier("propertyAccess")), [objTn, retTn], [
                propAccessExpr.expression,
                retString,
                ts.createCall(ts.createIdentifier("offsetof"), [objTn], [retString]),
            ]);
        }
        if (ts.isBinaryExpression(node)) {
            var binExp = node;
            if (
            // these two tests evaluate whether this is property assignment
            //  however expressions such as object.age++ are not included in this method
            binExp.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
                ts.isPropertyAccessExpression(binExp.left)) {
                if (!analysisDefined("propertySet"))
                    return ts.visitEachChild(node, visit, context);
                var propAccessExpr = binExp.left;
                var objTn = typechecker.typeToTypeNode(typechecker.getTypeAtLocation(propAccessExpr.expression));
                var retTn = typechecker.typeToTypeNode(typechecker.getTypeAtLocation(propAccessExpr));
                var objT = typechecker.getTypeAtLocation(propAccessExpr.expression);
                var retT = typechecker.getTypeAtLocation(propAccessExpr);
                if (typechecker.typeToString(retT) === "any" ||
                    typechecker.typeToString(objT) === "any") {
                    var inputText = fs_1.readFileSync(sourceCodeFile, "utf8");
                    var lineNr = inputText.substring(0, node.getStart() + 1).split("\n")
                        .length;
                    inputText.split("\n");
                    console.error("\n          ERROR: cannot resolve type, source-code: " + sourceCodeFile + " on line " + lineNr + " , analysis: " + analysisFile + " => " + node.getText() + "\n          ");
                    return ts.visitEachChild(node, visit, context);
                }
                var retString = createStringLiteral(propAccessExpr.name.text);
                var val = binExp.right;
                // obj.prop = val
                // ==TRANSFORM==>
                // setTrap<ObjClass, PropType>(obj, val, "prop", offsetof<ObjClass>("prop"))
                return ts.createCall(ts.createPropertyAccess(analysisDefinitions.classInstance, ts.createIdentifier("propertySet")), [objTn, retTn], [
                    propAccessExpr.expression,
                    val,
                    retString,
                    ts.createCall(ts.createIdentifier("offsetof"), [objTn], [retString]),
                ]);
            }
        }
        if ((analysisDefined("genericApply") ||
            analysisDefined("genericPostApply")) &&
            ts.isCallExpression(node) &&
            ts.isIdentifier(node.expression)) {
            if (node.typeArguments ===
                undefined /* currently only support function without type args */) {
                // funcCall(arg1, arg2);
                // ==TRANSFORM==>
                // (function (arg1: Typ1, arg2: Typ2){...cast function to pointer...; ...wrap args in ADT...; return apply2args(funcCallPointer, argsADT);})(arg1, arg2);
                var args = node.arguments;
                var argsIdentifier_1 = ts.createIdentifier("args");
                var declaration = typechecker.getResolvedSignature(node).declaration;
                if (declaration) {
                    var funcInTypes_1 = declaration.parameters.map(function (par) { return typechecker.getTypeFromTypeNode(par.type); });
                    /* create arguments ADT */
                    var argsCreation = ts.createVariableStatement(undefined, ts.createVariableDeclarationList([
                        ts.createVariableDeclaration(argsIdentifier_1 /* variable name */, undefined, ts.createNew(ts.createIdentifier("ArgsBuffer"), undefined, [
                            ts.createArrayLiteral(args.map(function (arg, index) {
                                return ts.createCall(ts.createIdentifier("sizeof"), [typechecker.typeToTypeNode(funcInTypes_1[index])], []);
                            })),
                        ])),
                    ]));
                    var nodeToRuntimeType_1 = function (index) {
                        var typeStr = typechecker.typeToString(funcInTypes_1[index]);
                        switch (typeStr) {
                            case "bool":
                                return "boolean";
                            case "i32":
                            case "u32":
                            case "i64":
                            case "u64":
                            case "f32":
                            case "f64":
                            case "v128":
                            case "i8":
                            case "u8":
                            case "i16":
                            case "u16":
                            case "isize":
                            case "usize":
                            case "void":
                            case "anyref":
                            case "number":
                            case "boolean":
                                return typeStr;
                            default:
                                return "classInstance";
                        }
                    };
                    var argSetters = args.map(function (arg, index) {
                        var classid = nodeToRuntimeType_1(index) === "classInstance"
                            ? ts.createCall(ts.createIdentifier("idof"), [typechecker.typeToTypeNode(funcInTypes_1[index])], [])
                            : ts.createNumericLiteral("0");
                        return ts.createExpressionStatement(ts.createCall(ts.createPropertyAccess(argsIdentifier_1, "setArgument"), [typechecker.typeToTypeNode(funcInTypes_1[index])], [
                            ts.createNumericLiteral("" + index),
                            ts.createPropertyAccess(ts.createIdentifier("Types"), nodeToRuntimeType_1(index)),
                            ts.createIdentifier("arg" + index),
                            classid,
                        ]));
                    });
                    var returnTypeNode = getTypeNode(node);
                    var returnType = typechecker.getTypeAtLocation(node);
                    var hasExplicitReturnType = typechecker.typeToString(returnType) !== "void";
                    (hasExplicitReturnType ? functionCallArgs : functionVoidCallArgs).add(args.length // call to exact matching function will be added later
                    );
                    var typeArgs = (_a = (hasExplicitReturnType
                        ? [returnTypeNode]
                        : [])).concat.apply(_a, funcInTypes_1.map(function (type) { return typechecker.typeToTypeNode(type); }));
                    var oronGuideFunctionName = hasExplicitReturnType // name of effective call to trap
                        ? ts.createIdentifier("apply" + args.length + "Args")
                        : ts.createIdentifier("apply" + args.length + "ArgsVoid");
                    var effectiveCallTrap = ts.createCall(oronGuideFunctionName, typeArgs, [
                        ts.createStringLiteral(ts.isIdentifier(node.expression)
                            ? node.expression.text
                            : node.getText()),
                        ts.createCall(ts.createIdentifier("changetype"), [ts.createTypeReferenceNode("usize", [])], [node.expression]),
                        argsIdentifier_1,
                    ]);
                    var argsToPars = function (_, index) {
                        return ts.createParameter(undefined, undefined, undefined, "arg" + index, undefined, typechecker.typeToTypeNode(funcInTypes_1[index]));
                    };
                    var trap = hasExplicitReturnType
                        ? ts.createReturn(effectiveCallTrap)
                        : effectiveCallTrap; // TODO: should change
                    return ts.createCall(ts.createFunctionExpression(undefined, undefined, undefined, undefined, node.arguments.map(argsToPars), getTypeNode(node), ts.createBlock(__spreadArrays([argsCreation], argSetters, [trap]))), undefined, node.arguments.map(function (node) { return visit(node); }));
                }
            }
            // else unable to resolve function signature, such as "assert"
        }
        return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(rootNode, visit);
}; };
// Perform transformation
var result = ts.transform(sourceFile, [transformer]);
var transformedSourceFile = result.transformed[0];
/* For every function call keep track of amount of arguments,
 * for every amount, create generic apply */
function idxFillGappedString(amount, str) {
    return Array(amount)
        .fill(str)
        .map(function (toFormat, idx) { return toFormat.replace(/\$/g, "" + idx); })
        .join(",");
}
var applyArgsFuncs = [];
functionCallArgs.forEach(function (amt) {
    var funcSignature = idxFillGappedString(amt, "in$: In$");
    applyArgsFuncs.push("\nfunction apply" + amt + "Args<RetType," + idxFillGappedString(amt, "In$") + ">(\n  fname: string,\n  fptr: usize,\n  argsBuff: ArgsBuffer,\n): RetType {\n  " + (analysisDefined("genericApply")
        ? analysisDefinitions.classInstance.text + ".genericApply(fname, fptr, argsBuff);"
        : null) + "\n  \n  const func: (" + funcSignature + ") => RetType = changetype<(" + funcSignature + ")=> RetType>(fptr);\n  const res: RetType = func(" + idxFillGappedString(amt, "argsBuff.getArgument<In$>($)") + ");\n  " + (analysisDefined("genericPostApply")
        ? "return myAnalysis.genericPostApply<RetType>(fname, fptr, argsBuff, res);"
        : "return res") + "\n  \n}\n");
});
functionVoidCallArgs.forEach(function (amt) {
    var funcSignature = idxFillGappedString(amt, "in$: In$");
    applyArgsFuncs.push("\nfunction apply" + amt + "ArgsVoid" + ((amt > 0 ? "<" : "") +
        idxFillGappedString(amt, "In$") +
        (amt > 0 ? ">" : "")) + "(\n  fname: string,\n  fptr: usize,\n  argsBuff: ArgsBuffer,\n): void {\n  " + analysisDefinitions.classInstance.text + ".genericApply(fname, fptr, argsBuff);\n  const func: (" + funcSignature + ") => void = changetype<(" + funcSignature + ")=> void>(fptr);\n  func(" + idxFillGappedString(amt, "argsBuff.getArgument<In$>($)") + ")\n  " + (analysisDefined("genericPostApply")
        ? "myAnalysis.genericPostApply<OronVoid>(fname, fptr, argsBuff, new OronVoid());"
        : null) + "\n}\n");
});
var endResult = analysisSourceFile.text +
    (analysisDefinitions.oronShouldAdd
        ? "\nconst " + analysisDefinitions.classInstance.text + " = new " + analysisDefinitions.className + "();\n"
        : "") +
    applyArgsFuncs.join("\n") +
    printer.printNode(null, transformedSourceFile, sourceFile);
fs_1.writeFileSync(outputFile, endResult);
