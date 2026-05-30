var dicomParser = require("dicom-parser");

var TAG = {
  CONTENT_SEQUENCE: "x0040a730",
  CONCEPT_NAME_CODE_SEQUENCE: "x0040a043",
  CODE_VALUE: "x00080100",
  CODING_SCHEME_DESIGNATOR: "x00080102",
  CODE_MEANING: "x00080104",
  TEXT_VALUE: "x0040a160",
  VALUE_TYPE: "x0040a040",
};

var DEFAULT_MAX_ELEMENT_LENGTH = 1048576;

function extractTextFromContentItem(item) {
  if (item[TAG.TEXT_VALUE] != null) {
    return normalizeText(item[TAG.TEXT_VALUE]);
  }
  return null;
}

function normalizeText(value) {
  if (value == null) {
    return null;
  }
  if (Array.isArray(value)) {
    return value.map(String).join("\n");
  }
  return String(value);
}

function normalizeMatchOptions(codingSchemeDesignatorOrOptions) {
  if (typeof codingSchemeDesignatorOrOptions === "string") {
    return { codingSchemeDesignator: codingSchemeDesignatorOrOptions };
  }
  return codingSchemeDesignatorOrOptions || {};
}

function isBufferLike(value) {
  return (
    typeof Buffer !== "undefined" &&
    Buffer.isBuffer != null &&
    Buffer.isBuffer(value)
  );
}

function normalizeParseArgs(dicomFileAsBuffer, codeValue, options) {
  if (codeValue != null && typeof codeValue === "object" && !isBufferLike(codeValue)) {
    options = codeValue;
    codeValue = options.codeValue;
  }
  options = options || {};

  if (!dicomFileAsBuffer) {
    throw new TypeError("dicom-sr-parser: dicomFileAsBuffer is required");
  }
  if (!codeValue) {
    throw new TypeError("dicom-sr-parser: codeValue is required");
  }

  return { buffer: dicomFileAsBuffer, codeValue: codeValue, options: options };
}

function dataSetToContentTree(dataSet, options) {
  var jsOptions = {
    omitPrivateAttibutes: true,
    maxElementLength:
      options.maxElementLength != null
        ? options.maxElementLength
        : DEFAULT_MAX_ELEMENT_LENGTH,
  };
  var json = dicomParser.explicitDataSetToJS(dataSet, jsOptions);
  return json[TAG.CONTENT_SEQUENCE];
}

function matchesConceptCode(codeItem, codeValue, codingSchemeDesignatorOrOptions) {
  var options = normalizeMatchOptions(codingSchemeDesignatorOrOptions);

  if (!codeItem) {
    return false;
  }
  if (codeValue != null && codeItem[TAG.CODE_VALUE] !== codeValue) {
    return false;
  }
  if (options.codeMeaning != null && codeItem[TAG.CODE_MEANING] !== options.codeMeaning) {
    return false;
  }
  if (codeValue == null && options.codeMeaning == null) {
    return false;
  }
  if (options.codingSchemeDesignator == null) {
    return true;
  }
  return codeItem[TAG.CODING_SCHEME_DESIGNATOR] === options.codingSchemeDesignator;
}

function walkContentSequence(contentItems, basePath, onMatch) {
  if (!Array.isArray(contentItems)) {
    return;
  }

  for (var i = 0; i < contentItems.length; i++) {
    var item = contentItems[i];
    if (!item || typeof item !== "object") {
      continue;
    }

    var path = basePath.concat(i + 1);
    var conceptCodes = item[TAG.CONCEPT_NAME_CODE_SEQUENCE];

    if (Array.isArray(conceptCodes)) {
      for (var j = 0; j < conceptCodes.length; j++) {
        onMatch(item, conceptCodes[j], path);
      }
    }

    var nested = item[TAG.CONTENT_SEQUENCE];
    if (nested) {
      walkContentSequence(nested, path, onMatch);
    }
  }
}

function findAllByCodeValue(contentItems, codeValue, codingSchemeDesignatorOrOptions) {
  var options = normalizeMatchOptions(codingSchemeDesignatorOrOptions);
  var matches = [];

  walkContentSequence(contentItems, [], function (item, conceptCode, path) {
    if (!matchesConceptCode(conceptCode, codeValue, options)) {
      return;
    }
    var text = extractTextFromContentItem(item);
    if (text != null) {
      matches.push({
        text: text,
        path: path,
      });
    }
  });

  return matches;
}

function findTextByCodeValue(contentItems, codeValue, codingSchemeDesignatorOrOptions) {
  var matches = findAllByCodeValue(contentItems, codeValue, codingSchemeDesignatorOrOptions);
  return matches.length ? matches[0].text : null;
}

function findTextByCodeMeaning(contentItems, codeMeaning, options) {
  options = options || {};
  options.codeMeaning = codeMeaning;
  return findTextByCodeValue(contentItems, null, options);
}

function parse(dicomFileAsBuffer, codeValue, options) {
  var args = normalizeParseArgs(dicomFileAsBuffer, codeValue, options);
  var dataSet = dicomParser.parseDicom(args.buffer);
  var contentSequence = dataSetToContentTree(dataSet, args.options);
  var text = findTextByCodeValue(
    contentSequence,
    args.codeValue,
    args.options
  );

  return {
    found: text != null,
    text: text,
    codeValue: args.codeValue,
  };
}

function parseAll(dicomFileAsBuffer, codeValue, options) {
  var args = normalizeParseArgs(dicomFileAsBuffer, codeValue, options);
  var dataSet = dicomParser.parseDicom(args.buffer);
  var contentSequence = dataSetToContentTree(dataSet, args.options);
  var matches = findAllByCodeValue(
    contentSequence,
    args.codeValue,
    args.options
  );

  return {
    found: matches.length > 0,
    matches: matches,
    codeValue: args.codeValue,
  };
}

module.exports = {
  parse: parse,
  parseAll: parseAll,
  findTextByCodeValue: findTextByCodeValue,
  findAllByCodeValue: findAllByCodeValue,
  findTextByCodeMeaning: findTextByCodeMeaning,
  matchesConceptCode: matchesConceptCode,
  extractTextFromContentItem: extractTextFromContentItem,
  dataSetToContentTree: dataSetToContentTree,
  TAG: TAG,
  DEFAULT_MAX_ELEMENT_LENGTH: DEFAULT_MAX_ELEMENT_LENGTH,
};
