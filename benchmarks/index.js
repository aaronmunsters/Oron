console.log(`
=====================ORON BENCHMARKS=====================
          NOTE: These benchmarks require Node 14
=========================================================
`);

const fs = require("fs");
const child_process = require("child_process");
const assert = require("assert");

const benchDir = __dirname;
assert(benchDir.endsWith("benchmarks"), "Benchmark required in benchmarks");

const oronDir = __dirname + "/..";
const containsOron = fs.readdirSync(oronDir).some((file) => file === "oron.ts");
assert(containsOron);

const containsExamples = fs
  .readdirSync(__dirname)
  .some((dir) => dir === "examples");
assert(containsExamples, "examples folder required");
const examplesDir = benchDir + "/examples";

const analyses = fs
  .readdirSync(oronDir + "/orondefaults")
  .filter((file) => file.endsWith(".ts"));

const preTestingInstructions = `
    
cd ${oronDir}
echo "Compiling oron"
npx tsc oron.ts
echo "Finished compiling oron"
echo "Moving required files to benchmark-environment"
cp -r ./orondefaults ./benchmarks/benchmark-environment/orondefaults
echo "Installing required files in benchmark-environment"
cd benchmarks/benchmark-environment
npm install >/dev/null

`;

child_process.execSync(preTestingInstructions, { stdio: "inherit" });

for (const file of fs.readdirSync(examplesDir)) {
  for (const analysis of analyses) {
    const originalFile =
      oronDir + `/benchmarks/examples/${file}/assembly/index.ts`;

    const benchEnv = oronDir + "/benchmarks/benchmark-environment";
    const benchIndexDestination = benchEnv + "/assembly/index.ts";

    const buildAndBenchmark = (state) => `
  npm run asbuild >/dev/null
  echo "Running default benchmarks, ${state}"
  node ${benchEnv}/benchmarks ${state} ${file} ### => This will output the results to terminal
    `;

    const instructions = `
    
  echo "==============================="
  echo "${file} with ${analysis}"
  cp ${originalFile} ${benchIndexDestination}
  cd ${benchEnv}
  ${buildAndBenchmark("uninstrumented")}
  node ${oronDir}/oron.js ${originalFile} ${oronDir}/orondefaults/${analysis} ${benchIndexDestination}
  ${buildAndBenchmark("instrumented")}
  echo "==============================="

  `;

    const allInstructions = instructions;
    child_process.execSync(allInstructions, { stdio: "inherit" });
  }
}
