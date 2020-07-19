const assert = require("assert");
const myModule = require("..");
assert.equal(myModule.exports.main(), 13141);
console.log("math-partial-sum - Uninstrumented behavior - ok");
