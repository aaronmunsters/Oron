const [_0, _1, instrumentedOrNot, benchmarkName] = process.argv;
const benchOptLocation = __dirname + "/../../benchmark-options.json";
const bench = JSON.parse(require("fs").readFileSync(benchOptLocation, "utf-8"));
const myModule = require("..");
const before = process.hrtime();
const timesToRunBenchmark = bench[benchmarkName];

for (let i = 0; i < timesToRunBenchmark; i++) myModule.exports.main();
console.log(process.hrtime(before));
console.log(
  `Benchmark - ${
    instrumentedOrNot || "[[un]instrumented not specified]"
  } - done`
);
