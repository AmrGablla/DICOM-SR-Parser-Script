var assert = require("assert");
var {
  findAllByCodeValueNaturalized,
  findTextByCodeValueNaturalized,
} = require("../lib/naturalized");
var {
  parseNaturalizedDataset,
  parseAllNaturalizedDataset,
} = require("../adapters/dcmjs");

var dataset = {
  ContentSequence: [
    {
      ConceptNameCodeSequence: {
        CodeValue: "A",
        CodingSchemeDesignator: "99TEST",
      },
      TextValue: "Root A",
    },
    {
      ConceptNameCodeSequence: { CodeValue: "CONTAINER" },
      ContentSequence: [
        {
          ConceptNameCodeSequence: {
            CodeValue: "A",
            CodingSchemeDesignator: "99TEST",
          },
          TextValue: "Nested A",
        },
      ],
    },
  ],
};

assert.strictEqual(findTextByCodeValueNaturalized(dataset.ContentSequence, "A"), "Root A");

assert.deepStrictEqual(findAllByCodeValueNaturalized(dataset.ContentSequence, "A"), [
  { text: "Root A", path: [1] },
  { text: "Nested A", path: [2, 1] },
]);

var parsed = parseNaturalizedDataset(dataset, "A");
assert.strictEqual(parsed.found, true);
assert.strictEqual(parsed.text, "Root A");

var all = parseAllNaturalizedDataset(dataset, "A");
assert.strictEqual(all.matches.length, 2);

console.log("ok");
