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
const containsOron = fs.readdirSync(oronDir).some((file) => file === "Oron.ts");
assert(containsOron);

const containsExamples = fs
  .readdirSync(__dirname)
  .some((dir) => dir === "examples");
assert(containsExamples, "examples folder required");
const examplesDir = testDir + "/examples";

const analyses = fs
  .readdirSync(oronDir + "/orondefaults")
  .filter((file) => file.endsWith(".ts"));

const keepInstrumented = false;

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
  echo "Running ORON tests for case: [${file}] with analysis [${analysis}] "
  echo "Copying oron required files to ${file} directory"
  cp -r ./orondefaults ./tests/examples/${file}/orondefaults
  cd ./tests/examples/${file}
  echo "Running default tests, uninstrumented"
  npm run asbuild && npm test
  echo "Running Oron to output instrumented code"
  node ../../../Oron.js ./assembly/index.ts ./orondefaults/${analysis} ./assembly/output.ts
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
  rm -r ./orondefaults
  echo "==============================="

  `;

    const allInstructions = instructions;
    child_process.execSync(allInstructions, { stdio: "inherit" });
  }
}

// const examplesDir = "./examples";
// const exampleFolders = fs
//   .readdirSync(examplesDir)
//   .filter((folder) => !(folder.startsWith(".") || folder.endsWith(".md")));

// function arrayContains(list, el) {
//   return list.some((f, idx, arr) => f === el);
// }

// function testExampleFolder(folder, index, array) {
//   exampleSubFiles = fs.readdirSync(`${examplesDir}/${folder}`);
//   if (!arrayContains(exampleSubFiles, "tests")) {
//     console.error(
//       `Example [${folder}] does not contain 'tests' folder with tests, skipping test`
//     );
//     return;
//   }
//   if (!arrayContains(exampleSubFiles, "assembly")) {
//     console.error(
//       `Example [${folder}] does not contain 'assembly' folder with sources, skipping test`
//     );
//     return;
//   } else if (
//     !arrayContains(
//       fs.readdirSync(`${examplesDir}/${folder}/assembly`),
//       "index.ts"
//     )
//   ) {
//     console.error(
//       `Example [${folder}] does not contain 'assembly/index.ts' file, skipping test`
//     );
//     return;
//   }

//   console.log(`Testing [${folder}]:`);

//   const oronLocation = __dirname + "/../Oron.js";
//   const analysisDependancies = __dirname + "/../orondefaults";

//   const testExecution =
//     // Here the tests are ran, also documenting each step
//     `
//     cd ./examples/${folder}/ ### Change to effective directory
//     npm i                    ### Install dependancies for current test
//     npm run asbuild          ### Build default test
//     npm test                 ### Run the test provided by the example

//     echo "Add Oron requirements"
//     cp -r ${analysisDependancies} ./orondefaults
//     echo "Rename example entry point"
//     mv assembly/index.ts assembly/indexOld.ts
//     echo "Run entry transformation"
//     echo "node ${oronLocation} $(pwd)/assembly/indexOld.ts $(pwd)/orondefaults/emptyAnalysisContained.ts $(pwd)/assembly/index.ts"
//     node ${oronLocation} assembly/indexOld.ts orondefaults/emptyAnalysisContained.ts assembly/index.ts
//     echo "Output changes in character count"
//     wc assembly/index.ts assembly/indexOld.ts

//     npm run asbuild          ### Build instrumented test
//     npm test                 ### Run instrumented test
//   `;

//   const testCleanup = `
//   echo "Cleaning up what the test just ran"
//   cd ./examples
//   rm -r *
//   git restore .
//   `;

//   child_process.execSync(
//     `
//     echo "Copying corrected n-body file"
//     cp n-body_tests_index.js examples/n-body/tests/index.js
//     `,
//     { stdio: "inherit" }
//   );

//   child_process.execSync(
//     testExecution,
//     { stdio: "inherit" } // child stdio will be seen for test runner
//   );

//   child_process.execSync(testCleanup, { stdio: "inherit" });

//   console.log(`Done running rest [${folder}]`);
// }
// child_process.execSync("npx tsc Oron");
// exampleFolders.forEach(testExampleFolder);
