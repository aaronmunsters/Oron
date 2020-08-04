const assert = require("assert");
const myModule = require("../index.js");
function gcCollect() {
  if (global.gc) {
    global.gc();
    global.gc();
  }
}

function sleep(delay) {
  var start = Date.now();
  while (Date.now() < start + delay);
}

function test(nbody, steps) {
  nbody.init();
  var start = process.hrtime();
  nbody.bench(steps);
  let t = process.hrtime(start);
  gcCollect();
  return t;
}

var steps = 200000;

function prologue(name, steps) {
  console.log("Performing " + steps + " steps (" + name + ") ...");
}

function epilogue(time) {
  console.log("Took " + (time[0] * 1e3 + time[1] / 1e6) + "ms");
}

console.log("\nCOLD SERIES:\n");

prologue("AssemblyScript WASM", steps);
epilogue(test(myModule, steps));

console.log("\nWARMED UP SERIES:\n");
sleep(1000);

prologue("AssemblyScript WASM", steps);
epilogue(test(myModule, steps));

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
console.log("N-body - Instrumented behavior - ok");
