const assert = require("assert");
const myModule = require("..");
assert.equal(myModule.exports.main(), undefined); // returns void
console.log("math-partial-sum - Uninstrumented behavior - ok");
