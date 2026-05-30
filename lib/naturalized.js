/**
 * Walk dcmjs-style naturalized SR trees (PascalCase attribute names).
 */
var NAT = {
  CONTENT_SEQUENCE: "ContentSequence",
  CONCEPT_NAME_CODE_SEQUENCE: "ConceptNameCodeSequence",
  CODE_VALUE: "CodeValue",
  CODING_SCHEME_DESIGNATOR: "CodingSchemeDesignator",
  CODE_MEANING: "CodeMeaning",
  TEXT_VALUE: "TextValue",
};

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

function matchesConceptCodeNaturalized(codeItem, codeValue, options) {
  if (!codeItem) {
    return false;
  }
  if (codeValue != null && codeItem[NAT.CODE_VALUE] !== codeValue) {
    return false;
  }
  if (options.codeMeaning != null && codeItem[NAT.CODE_MEANING] !== options.codeMeaning) {
    return false;
  }
  if (codeValue == null && options.codeMeaning == null) {
    return false;
  }
  if (options.codingSchemeDesignator == null) {
    return true;
  }
  return codeItem[NAT.CODING_SCHEME_DESIGNATOR] === options.codingSchemeDesignator;
}

function extractTextFromNaturalizedItem(item) {
  if (item[NAT.TEXT_VALUE] != null) {
    return normalizeText(item[NAT.TEXT_VALUE]);
  }
  return null;
}

function walkNaturalizedContentSequence(contentItems, basePath, onMatch) {
  if (!Array.isArray(contentItems)) {
    return;
  }

  for (var i = 0; i < contentItems.length; i++) {
    var item = contentItems[i];
    if (!item || typeof item !== "object") {
      continue;
    }

    var path = basePath.concat(i + 1);
    var conceptCodes = item[NAT.CONCEPT_NAME_CODE_SEQUENCE];
    if (!Array.isArray(conceptCodes)) {
      conceptCodes = conceptCodes ? [conceptCodes] : [];
    }

    for (var j = 0; j < conceptCodes.length; j++) {
      onMatch(item, conceptCodes[j], path);
    }

    var nested = item[NAT.CONTENT_SEQUENCE];
    if (nested) {
      if (!Array.isArray(nested)) {
        nested = [nested];
      }
      walkNaturalizedContentSequence(nested, path, onMatch);
    }
  }
}

function findAllByCodeValueNaturalized(
  contentItems,
  codeValue,
  codingSchemeDesignatorOrOptions
) {
  var options = normalizeMatchOptions(codingSchemeDesignatorOrOptions);
  var matches = [];

  walkNaturalizedContentSequence(contentItems, [], function (item, conceptCode, path) {
    if (!matchesConceptCodeNaturalized(conceptCode, codeValue, options)) {
      return;
    }
    var text = extractTextFromNaturalizedItem(item);
    if (text != null) {
      matches.push({ text: text, path: path });
    }
  });

  return matches;
}

function findTextByCodeValueNaturalized(
  contentItems,
  codeValue,
  codingSchemeDesignatorOrOptions
) {
  var matches = findAllByCodeValueNaturalized(
    contentItems,
    codeValue,
    codingSchemeDesignatorOrOptions
  );
  return matches.length ? matches[0].text : null;
}

function getContentSequenceFromDataset(dataset) {
  if (!dataset || typeof dataset !== "object") {
    return undefined;
  }
  return dataset[NAT.CONTENT_SEQUENCE];
}

module.exports = {
  NAT: NAT,
  findAllByCodeValueNaturalized: findAllByCodeValueNaturalized,
  findTextByCodeValueNaturalized: findTextByCodeValueNaturalized,
  extractTextFromNaturalizedItem: extractTextFromNaturalizedItem,
  getContentSequenceFromDataset: getContentSequenceFromDataset,
};
