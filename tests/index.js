const assert = require("assert").strict;
const wasmModule = require("../index");

let wasmVal;
let jsVal;
for (let i = 1; i < 100; i++) {
  wasmVal = wasmModule.squaresSum(i);
  jsVal = new Array(i)
    .fill(null)
    .map((n, i) => i * i)
    .reduce((p, n) => p + n);

  assert.equal(
    wasmVal,
    jsVal,
    "the WASM module and JS code should provide same output"
  );
}

console.log("All tests passed, everything is fine");
console.log(wasmModule.getValue(1));
