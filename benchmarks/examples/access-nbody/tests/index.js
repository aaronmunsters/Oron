const fs = require("fs");
const nbodyAS = require("../index.js");
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

var steps = process.argv.length > 2 ? parseInt(process.argv[2], 10) : 20000000;

function prologue(name, steps) {
  console.log("Performing " + steps + " steps (" + name + ") ...");
}

function epilogue(time) {
  console.log("Took " + (time[0] * 1e3 + time[1] / 1e6) + "ms");
}

console.log("\nCOLD SERIES:\n");

prologue("AssemblyScript WASM", steps);
epilogue(test(nbodyAS, steps));

console.log("\nWARMED UP SERIES:\n");
sleep(1000);

prologue("AssemblyScript WASM", steps);
epilogue(test(nbodyAS, steps));

console.log("N-body - Instrumented behavior - ok");
