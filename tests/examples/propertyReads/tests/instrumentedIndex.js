const assert = require("assert");
const myModule = require("..");
assert.equal(myModule.exports.main(), 1);

const args = process.argv;
const analysis = args.length > 2 ? args[2] : false;
assert(analysis, "Applied analysis required");
// It is required to provide the applied analysis, for example "countFunctionCalls.ts"
// to determine what should be retrieved to reason whether the output is correct or not
switch (analysis) {
  case "combinedExamples.ts":
    break;
  case "countFunctionCalls.ts":
    break;
  case "countPropertyReads.ts":
    break;
  case "countPropertyWrites.ts":
    break;
  case "emptyAnalysis.ts":
    break;
  default:
    assert(
      false,
      `Unkown analysis: ${analysis}, please add not only to test suite but expected outcome in ${__filename} too`
    );
}
console.log("Property read - Instrumented behavior - ok");
