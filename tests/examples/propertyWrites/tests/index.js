const assert = require("assert");
const myModule = require("..");
assert.equal(myModule.exports.main(), 1);
console.log("Property write - Uninstrumented behavior - ok");
