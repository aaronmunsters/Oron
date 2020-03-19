const wasmModule = require("./index");

for (let i = 1; i < 100; i++) {
  console.log(wasmModule.squaresSum(i));

  console.log(
    new Array(i)
      .fill(null)
      .map((n, i) => i * i)
      .reduce((p, n) => p + n)
  );
}
