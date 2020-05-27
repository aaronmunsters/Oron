const assert = require("assert");
const myModule = require("..");
assert.equal(myModule.exports.main(), 303);
console.log("Function application - Uninstrumented behavior - ok");
