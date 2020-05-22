console.log(`
=====================ORON TESTS=====================
          NOTE: These tests require Node 14
====================================================
`);

const fs = require("fs");
const child_process = require("child_process");

const examplesDir = "./examples";
const exampleFolders = fs
  .readdirSync(examplesDir)
  .filter((folder) => !(folder.startsWith(".") || folder.endsWith(".md")));

function arrayContains(list, el) {
  return list.some((f, idx, arr) => f === el);
}

function testExampleFolder(folder, index, array) {
  exampleSubFiles = fs.readdirSync(`${examplesDir}/${folder}`);
  if (!arrayContains(exampleSubFiles, "tests")) {
    console.error(
      `Example [${folder}] does not contain 'tests' folder with tests, skipping test`
    );
    return;
  }
  if (!arrayContains(exampleSubFiles, "assembly")) {
    console.error(
      `Example [${folder}] does not contain 'assembly' folder with sources, skipping test`
    );
    return;
  } else if (
    !arrayContains(
      fs.readdirSync(`${examplesDir}/${folder}/assembly`),
      "index.ts"
    )
  ) {
    console.error(
      `Example [${folder}] does not contain 'assembly/index.ts' file, skipping test`
    );
    return;
  }

  console.log(`Testing [${folder}]:`);

  const oronLocation = __dirname + "/Oron";
  const analysisDependancies = __dirname + "/orondefaults";
  const analysisLocation = __dirname + "/orondefaults/emptyAnalysis";

  const testExecution =
    // Here the tests are ran, also documenting each step
    `
    cd ./examples/${folder}/ ### Change to effective directory
    npm i                    ### Install dependancies for current test
    npm run asbuild          ### Build default test
    npm test                 ### Run the test provided by the example

    echo "Add Oron requirements"
    cp -r ${analysisDependancies} ./orondefaults
    echo "Rename example entry point"
    mv assembly/index.ts assembly/indexOld.ts 
    echo "Run entry transformation"
    echo "node ${oronLocation} $(pwd)/assembly/indexOld.ts $(pwd)/orondefaults/emptyAnalysis.ts $(pwd)/assembly/index.ts"
    node ${oronLocation} assembly/indexOld.ts orondefaults/emptyAnalysis.ts assembly/index.ts
    echo "Output changes in character count"
    wc assembly/index.ts assembly/indexOld.ts

    npm run asbuild          ### Build instrumented test
    npm test                 ### Run instrumented test

    ### Clean up mess
    mv assembly/indexOld.ts assembly/index.ts
  `;

  child_process.execSync(
    testExecution,
    { stdio: "inherit" } // child stdio will be seen for test runner
  );

  console.log(`Done running rest [${folder}]`);
}
child_process.execSync("npx tsc Oron");
exampleFolders.forEach(testExampleFolder);
