const fs = require("fs");
const loader = require("@assemblyscript/loader");

let groupLogging = false;
let groupLog = [];
const wasm = loader.instantiateSync(
  fs.readFileSync(__dirname + "/build/optimized.wasm"),
  {
    output: {
      startLog() {
        groupLogging = true;
        groupLog = [];
      },
      logString(ref) {
        const logString = wasm.__getString(ref);
        groupLogging ? groupLog.push(logString) : console.log(logString);
      },
      endLog() {
        groupLogging = false;
        console.log(groupLog);
      },
    },
  }
);

const readsPtr = wasm.__allocString("reads");
const agePtr = wasm.__allocString("age");

console.log("======RUNNING WASM PROGRAM======");
const output = wasm.getValue();
console.log("=======END OF WASM PROGRAM======");
console.log(`Output for the (instrumented) function "getValue" is: ${output}`);
console.log(
  `Amount of times property "age" is being read after calling this function: ${
    wasm.getRes
      ? wasm.getRes(readsPtr, agePtr) === -2
        ? 0
        : wasm.getRes(readsPtr, agePtr)
      : null
  }`
);
