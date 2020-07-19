const assert = require("assert");
const myModule = require("..");
assert.equal(myModule.exports.main(), 358400);
console.log("math-partial-sum - Uninstrumented behavior - ok");
