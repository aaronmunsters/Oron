const fs = require("fs");
const loader = require("@assemblyscript/loader");

const wasmStringLogger = [];
const wasm = loader.instantiateSync(
  fs.readFileSync(__dirname + "/build/optimized.wasm"),
  {
    output: {
      logString(x) {
        wasmStringLogger.push(x);
      },
    },
  }
);

const readsPtr = wasm.__allocString("reads");
const agePtr = wasm.__allocString("age");
console.log(
  `Output for the (instrumented) function "getValue" is: ${wasm.getValue()}`
);
console.log(
  `Amount of times property "age" is being read after calling this function: ${wasm.getRes(
    readsPtr,
    agePtr
  )}`
);

console.log("Program logs:");
wasmStringLogger.forEach((strPtr) => console.log(wasm.__getString(strPtr)));
