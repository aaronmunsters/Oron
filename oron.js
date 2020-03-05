const asc = require("assemblyscript/cli/asc");
asc.ready.then(() => {
  asc.main(
    [
      // "./assembly/game-of-life/assembly/index.ts",
      "./assembly/index.ts",
      "--binaryFile",
      "./build/optimized.wasm",
      "--transform",
      "./oronAdvice.ts"
    ],
    {
      stdout: process.stdout,
      stderr: process.stderr
    },
    function(err) {
      if (err) {
        console.log(err);
      }
    }
  );
});
