const fs = require("fs");
const loader = require("@assemblyscript/loader");
module.exports = loader.instantiateSync(
  fs.readFileSync(__dirname + "/build/as_nbody.wasm"),
  {
    env: {
      memory: new WebAssembly.Memory({ initial: 10 }),
      abort: (_, line, column) => {
        throw Error("abort called at " + line + ":" + column);
      },
    },
  }
).exports;
