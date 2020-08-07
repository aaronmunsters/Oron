console.log(`
=====================ORON TESTS=====================
          NOTE: These tests require Node 14
====================================================
`);

const fs = require("fs");
const child_process = require("child_process");
const assert = require("assert");

const testDir = __dirname;
assert(testDir.endsWith("tests"), "Test file required to be in tests folder");

const oronDir = __dirname + "/..";
const containsOron = fs.readdirSync(oronDir).some((file) => file === "oron.ts");
assert(containsOron);

const containsExamples = fs
  .readdirSync(__dirname)
  .some((dir) => dir === "examples");
assert(containsExamples, "examples folder required");
const examplesDir = testDir + "/examples";

const analyses = fs
  .readdirSync(oronDir + "/orondefaults")
  .filter((file) => file.endsWith(".ts"));

const keepInstrumented = true;

const preTestingInstructions = `
    
echo "Compiling oron"
npx tsc oron.ts
echo "Finished compiling oron"

`;

child_process.execSync(preTestingInstructions, { stdio: "inherit" });

for (const file of fs.readdirSync(examplesDir)) {
  for (const analysis of analyses) {
    const instructions = `

  cd ${oronDir}
  echo "==============================="
  echo "Running ORON tests for case: [${file}] with analysis [${analysis}] "
  echo "Copying oron required files to ${file} directory"
  cp -r ./dependancies ./tests/examples/${file}/dependancies
  cp -r ./orondefaults ./tests/examples/${file}/orondefaults
  cd ./tests/examples/${file}
  npm install
  echo "Running default tests, uninstrumented"
  npm run asbuild && npm test
  echo "Running Oron to output instrumented code"
  node ../../../oron.js ./assembly/index.ts ./orondefaults/${analysis} ./assembly/output.ts
  cd ./assembly
  echo "Difference between instrumented and uninstrumented: lines words characters"
  mv output.ts __instrumented.ts
  mv index.ts  uninstrumented.ts
  wc __instrumented.ts uninstrumented.ts
  echo "Replacing entry point with instrumented version"
  mv __instrumented.ts index.ts
  echo "Running default tests, instrumented"
  npm run asbuild && npm test
  echo "Running instrumentation tests"
  cd .. && node ./tests/instrumentedIndex.js ${analysis}
  cd ./assembly
  echo "Replacing instrumented with uninstrumented code"
  ${keepInstrumented ? "mv index.ts __instrumented" + analysis : ""}
  mv uninstrumented.ts index.ts
  echo "Removing oron required files from ${file} directory"
  cd ..
  rm -r ./dependancies
  rm -r ./orondefaults
  echo "==============================="

  `;

    const allInstructions = instructions;
    child_process.execSync(allInstructions, { stdio: "inherit" });
  }
}
