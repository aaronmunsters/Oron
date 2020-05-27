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
const containsOron = fs.readdirSync(oronDir).some((file) => file === "Oron.ts");
assert(containsOron);

const containsExamples = fs
  .readdirSync(__dirname)
  .some((dir) => dir === "examples");
assert(containsExamples, "examples folder required");
const examplesDir = benchDir + "/examples";

const analyses = fs
  .readdirSync(oronDir + "/orondefaults")
  .filter((file) => file.endsWith(".ts"));

const keepInstrumented = true;

const preTestingInstructions = `
    
echo "Compiling oron"
npx tsc Oron.ts
echo "Finished compiling oron"

`;

child_process.execSync(preTestingInstructions, { stdio: "inherit" });

for (const file of fs.readdirSync(examplesDir)) {
  for (const analysis of analyses) {
    const instructions = `

  cd ${oronDir}
  echo "==============================="
  echo "Running ORON benchmarks for case: [${file}] with analysis [${analysis}] "
  echo "Copying oron required files to ${file} directory"
  cp -r ./orondefaults ./benchmarks/examples/${file}/orondefaults
  cd ./benchmarks/examples/${file}
  npm install >/dev/null
  echo "Running default benchmarks, uninstrumented"
  npm run asbuild >/dev/null
  node ./benchmarks/index.js uninstrumented
  echo "Running Oron to output instrumented code"
  node ../../../Oron.js ./assembly/index.ts ./orondefaults/${analysis} ./assembly/output.ts >/dev/null
  cd ./assembly
  mv index.ts  uninstrumented.ts
  echo "Replacing entry point with instrumented version"
  mv output.ts index.ts
  echo "Running default benchmarks, instrumented"
  npm run asbuild >/dev/null
  cd ..
  node ./benchmarks/index.js instrumented
  cd ./assembly
  echo "Replacing instrumented with uninstrumented code"
  ${keepInstrumented ? "mv index.ts __instrumented" + analysis : ""}
  mv uninstrumented.ts index.ts
  echo "Removing oron required files from ${file} directory"
  cd ..
  rm -r ./orondefaults
  echo "==============================="

  `;

    const allInstructions = instructions;
    child_process.execSync(allInstructions, { stdio: "inherit" });
  }
}
