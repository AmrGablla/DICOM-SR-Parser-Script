var nat = require("../lib/naturalized");

function requireDcmjs() {
  try {
    return require("dcmjs");
  } catch (err) {
    throw new Error(
      "dicom-sr-parser/dcmjs: install optional peer dependency: npm install dcmjs"
    );
  }
}

/**
 * Extract text from an already-naturalized dcmjs dataset (PascalCase keys).
 */
function parseNaturalizedDataset(dataset, codeValue, options) {
  options = options || {};
  var contentSequence = nat.getContentSequenceFromDataset(dataset);
  var text = nat.findTextByCodeValueNaturalized(contentSequence, codeValue, options);

  return {
    found: text != null,
    text: text,
    codeValue: codeValue,
  };
}

function parseAllNaturalizedDataset(dataset, codeValue, options) {
  options = options || {};
  var contentSequence = nat.getContentSequenceFromDataset(dataset);
  var matches = nat.findAllByCodeValueNaturalized(contentSequence, codeValue, options);

  return {
    found: matches.length > 0,
    matches: matches,
    codeValue: codeValue,
  };
}

/**
 * Read Part 10 bytes with dcmjs, naturalize, then extract by Code Value.
 */
function parseWithDcmjs(dicomBytes, codeValue, options) {
  var dcmjs = requireDcmjs();
  var buffer =
    dicomBytes instanceof ArrayBuffer
      ? dicomBytes
      : dicomBytes.buffer instanceof ArrayBuffer
        ? dicomBytes.buffer.slice(
            dicomBytes.byteOffset,
            dicomBytes.byteOffset + dicomBytes.byteLength
          )
        : dicomBytes;

  var dicomDict = dcmjs.data.DicomMessage.readFile(buffer);
  var dataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(dicomDict.dict);
  return parseNaturalizedDataset(dataset, codeValue, options);
}

module.exports = {
  parseNaturalizedDataset: parseNaturalizedDataset,
  parseAllNaturalizedDataset: parseAllNaturalizedDataset,
  parseWithDcmjs: parseWithDcmjs,
  NAT: nat.NAT,
};
