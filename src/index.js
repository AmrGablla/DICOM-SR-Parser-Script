var fs = require("fs");
var core = require("./core");

/**
 * Read a DICOM SR file from disk and parse it (same return shape as parse()).
 */
function parseFromFile(filePath, codeValue, options) {
  var buffer = fs.readFileSync(filePath);
  return core.parse(buffer, codeValue, options);
}

module.exports = {
  parse: core.parse,
  parseAll: core.parseAll,
  parseFromFile: parseFromFile,
  findTextByCodeValue: core.findTextByCodeValue,
  findAllByCodeValue: core.findAllByCodeValue,
  findTextByCodeMeaning: core.findTextByCodeMeaning,
  matchesConceptCode: core.matchesConceptCode,
  extractTextFromContentItem: core.extractTextFromContentItem,
  dataSetToContentTree: core.dataSetToContentTree,
  TAG: core.TAG,
  DEFAULT_MAX_ELEMENT_LENGTH: core.DEFAULT_MAX_ELEMENT_LENGTH,
};
