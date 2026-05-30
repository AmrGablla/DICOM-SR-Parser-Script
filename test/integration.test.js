/**
 * Expected fixture codes:
 * - minimal-nested-sr.dcm: TEST_CODE_01 / 99TEST → "Hello from fixture" at path [1,1]
 * - duplicate-codes-sr.dcm: DUP_CODE → two matches at [1] and [2,1]
 */
var assert = require("assert");
var fs = require("fs");
var path = require("path");
var { parse, parseAll } = require("../src/index");

require("./build-fixture");

var fixturesDir = path.join(__dirname, "fixtures");

var minimal = path.join(fixturesDir, "minimal-nested-sr.dcm");
var minimalBuf = fs.readFileSync(minimal);

var minimalResult = parse(minimalBuf, "TEST_CODE_01");
assert.strictEqual(minimalResult.found, true);
assert.strictEqual(minimalResult.text, "Hello from fixture");

var minimalAll = parseAll(minimalBuf, "TEST_CODE_01");
assert.deepStrictEqual(minimalAll.matches, [
  { text: "Hello from fixture", path: [1, 1] },
]);

var duplicate = path.join(fixturesDir, "duplicate-codes-sr.dcm");
var duplicateAll = parseAll(fs.readFileSync(duplicate), "DUP_CODE");
assert.strictEqual(duplicateAll.found, true);
assert.strictEqual(duplicateAll.matches.length, 2);
assert.strictEqual(duplicateAll.matches[0].text, "First duplicate");
assert.strictEqual(duplicateAll.matches[1].text, "Second duplicate");

console.log("ok");
