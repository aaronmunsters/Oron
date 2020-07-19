const assert = require("assert");
const myModule = require("..");
assert.equal(myModule.exports.main(), 38);
console.log("math-partial-sum - Uninstrumented behavior - ok");
