"use strict";
exports.__esModule = true;
var assemblyscript = require("assemblyscript");
var fs = require("fs");
var path = require("path");
var utf8 = require("./util/utf8");
var colorsUtil = require("./util/colors");
var optionsUtil = require("./util/options");
var mkdirp = require("./util/mkdirp");
var find = require("./util/find");
var EOL = process.platform === "win32" ? "\r\n" : "\n";
var SEP = process.platform === "win32" ? "\\" : "/";
// const binaryen = global.Binaryen || (global.Binaryen = require("binaryen"));
function performCompile() {
    var opts = optionsUtil.parse(process.argv, exports.options);
    var args = opts.options;
    // Set up options
    var compilerOptions = assemblyscript.newOptions();
    assemblyscript.setTarget(compilerOptions, 0);
    assemblyscript.setNoAssert(compilerOptions, args.noAssert);
    assemblyscript.setImportMemory(compilerOptions, args.importMemory);
    assemblyscript.setSharedMemory(compilerOptions, args.sharedMemory);
    assemblyscript.setImportTable(compilerOptions, args.importTable);
    assemblyscript.setExportTable(compilerOptions, args.exportTable);
    assemblyscript.setExplicitStart(compilerOptions, args.explicitStart);
    assemblyscript.setMemoryBase(compilerOptions, args.memoryBase >>> 0);
    assemblyscript.setTableBase(compilerOptions, args.tableBase >>> 0);
    assemblyscript.setSourceMap(compilerOptions, args.sourceMap != null);
    assemblyscript.setNoUnsafe(compilerOptions, args.noUnsafe);
    assemblyscript.setPedantic(compilerOptions, args.pedantic);
    // assemblyscript.setLowMemoryLimit(compilerOptions, args.lowMemoryLimit >>> 0); // unkown, not found
}
performCompile();
/*
ready.then(() => {
  console.log(args);
  main(
    [
      "./assembly/index.ts",
      "--binaryFile",
      "./build/optimized.wasm",
      "--transform",
      "./oronAdvice.ts"
    ],
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
