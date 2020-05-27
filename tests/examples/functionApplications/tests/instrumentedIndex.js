const assert = require("assert");
const myModule = require("..");
assert.equal(myModule.exports.main(), 303);

const args = process.argv;
const analysis = args.length > 2 ? args[2] : false;
assert(analysis, "Applied analysis required");
// It is required to provide the applied analysis, for example "countFunctionCalls.ts"
// to determine what should be retrieved to reason whether the output is correct or not
const ackermanString = myModule.exports.__allocString("ackermann");
switch (analysis) {
  case "combinedExamples.ts":
    const callsString = myModule.exports.__allocString("calls");
    assert.equal(myModule.exports.getRes(callsString, ackermanString), 13591);
    break;
  case "countFunctionCalls.ts":
    assert.equal(myModule.exports.getRes(ackermanString), 13591);
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
console.log("Function application - Instrumented behavior - ok");
