const arg = process.argv[2];
const myModule = require("..");
const before = process.hrtime();
for (let i = 0; i < 20; i++) myModule.exports.main();
console.log(process.hrtime(before));
console.log(
  `Function application - ${
    arg || "[[un]instrumented not specified]"
  } behavior - ok`
);
