const assert = require("assert");
const myModule = require("..");
assert.equal(myModule.exports.main(), 1);

const args = process.argv;
const analysis = args.length > 2 ? args[2] : false;
assert(analysis, "Applied analysis required");
// It is required to provide the applied analysis, for example "countFunctionCalls.ts"
// to determine what should be retrieved to reason whether the output is correct or not
function assertResult(property, times) {
  assert.equal(
    times,
    getRes(__allocString(property)),
    `${property} should be accessed ${times} time(s)`
  );
}
const { __allocString, getRes } = myModule.exports;
switch (analysis) {
  case "combinedExamples.ts":
    assert.equal(getRes(__allocString("reads"), __allocString("prop1")), 2);
    assert.equal(getRes(__allocString("sets"), __allocString("prop1")), 2);
    assert.equal(getRes(__allocString("reads"), __allocString("prop2")), 2);
    assert.equal(getRes(__allocString("sets"), __allocString("prop2")), 2);
    assert.equal(getRes(__allocString("reads"), __allocString("prop3")), 2);
    assert.equal(getRes(__allocString("sets"), __allocString("prop3")), 2);
    break;
  case "countFunctionCalls.ts":
    break;
  case "countPropertyReads.ts":
    assertResult("prop1", 2);
    assertResult("prop2", 2);
    assertResult("prop3", 2);
    break;
  case "countPropertyWrites.ts":
    assertResult("prop1", 2); // 2, as object creation also counts
    assertResult("prop2", 2); // 2, as object creation also counts
    assertResult("prop3", 2); // 2, as object creation also counts
    break;
  case "emptyAnalysis.ts":
    break;
  default:
    assert(
      false,
      `Unkown analysis: ${analysis}, please add not only to test suite but expected outcome in ${__filename} too`
    );
}
console.log("Property write - Instrumented behavior - ok");
