var assert = require("assert");
var fs = require("fs");
var os = require("os");
var path = require("path");
var {
  findTextByCodeValue,
  findAllByCodeValue,
  findTextByCodeMeaning,
  matchesConceptCode,
  parse,
  parseAll,
  parseFromFile,
} = require("../src/index");

var nestedFixture = [
  {
    x0040a043: [{ x00080100: "OTHER", x00080102: "99TEST" }],
    x0040a730: [
      {
        x0040a043: [{ x00080100: "QURE_CODE_12", x00080102: "99VENDOR" }],
        x0040a160: "Nested impression text",
      },
    ],
  },
];

var duplicateCodeFixture = [
  {
    x0040a043: [{ x00080100: "QURE_CODE_12", x00080102: "99VENDOR" }],
    x0040a160: "First match",
  },
  {
    x0040a043: [{ x00080100: "OTHER" }],
    x0040a730: [
      {
        x0040a043: [{ x00080100: "QURE_CODE_12", x00080102: "99VENDOR" }],
        x0040a160: "Second match",
      },
      {
        x0040a043: [{ x00080100: "QURE_CODE_12", x00080102: "99VENDOR" }],
        x0040a160: "Third match",
      },
    ],
  },
];

assert.strictEqual(
  findTextByCodeValue(nestedFixture, "QURE_CODE_12"),
  "Nested impression text"
);

assert.strictEqual(
  findTextByCodeValue(nestedFixture, "QURE_CODE_12", "99VENDOR"),
  "Nested impression text"
);

assert.strictEqual(
  findTextByCodeValue(nestedFixture, "QURE_CODE_12", "WRONG_SCHEME"),
  null
);

assert.strictEqual(
  findTextByCodeValue(
    [{ x0040a043: [{ x00080100: "A" }], x0040a160: ["line1", "line2"] }],
    "A"
  ),
  "line1\nline2"
);

assert.deepStrictEqual(findAllByCodeValue(duplicateCodeFixture, "QURE_CODE_12"), [
  { text: "First match", path: [1] },
  { text: "Second match", path: [2, 1] },
  { text: "Third match", path: [2, 2] },
]);

assert.deepStrictEqual(
  findAllByCodeValue(duplicateCodeFixture, "QURE_CODE_12", "99VENDOR"),
  [
    { text: "First match", path: [1] },
    { text: "Second match", path: [2, 1] },
    { text: "Third match", path: [2, 2] },
  ]
);

assert.deepStrictEqual(
  findAllByCodeValue(duplicateCodeFixture, "QURE_CODE_12", "WRONG_SCHEME"),
  []
);

var codeMeaningFixture = [
  {
    x0040a043: [
      {
        x00080100: "121071",
        x00080102: "DCM",
        x00080104: "Finding",
      },
    ],
    x0040a160: "Finding text",
  },
];

assert.strictEqual(
  findTextByCodeMeaning(codeMeaningFixture, "Finding"),
  "Finding text"
);

assert.strictEqual(
  findTextByCodeMeaning(codeMeaningFixture, "Impression"),
  null
);

assert.strictEqual(
  findTextByCodeValue(codeMeaningFixture, "121071", { codeMeaning: "Finding" }),
  "Finding text"
);

assert.strictEqual(
  findTextByCodeValue(codeMeaningFixture, "121071", { codeMeaning: "Wrong" }),
  null
);

assert.strictEqual(
  matchesConceptCode(
    { x00080100: "121071", x00080104: "Finding" },
    "121071",
    { codeMeaning: "Finding" }
  ),
  true
);

assert.throws(() => parse(null, "X"), TypeError);
assert.throws(() => parse(Buffer.from([0]), ""), TypeError);

require("./build-fixture");

var fixturePath = path.join(__dirname, "fixtures", "minimal-nested-sr.dcm");

var parseAllResult = parseAll(fs.readFileSync(fixturePath), "TEST_CODE_01");
assert.strictEqual(parseAllResult.found, true);
assert.strictEqual(parseAllResult.codeValue, "TEST_CODE_01");
assert.deepStrictEqual(parseAllResult.matches, [
  { text: "Hello from fixture", path: [1, 1] },
]);

var parseFromFileResult = parseFromFile(fixturePath, "TEST_CODE_01");
assert.strictEqual(parseFromFileResult.found, true);
assert.strictEqual(parseFromFileResult.text, "Hello from fixture");
assert.strictEqual(parseFromFileResult.codeValue, "TEST_CODE_01");

var tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "dicom-sr-parser-"));
var tempFile = path.join(tempDir, "sample.dcm");
fs.writeFileSync(tempFile, Buffer.from([0]));

assert.throws(() => parseFromFile(tempFile, "QURE_CODE_12"));

fs.rmSync(tempDir, { recursive: true, force: true });

console.log("ok");
