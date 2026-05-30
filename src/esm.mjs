import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const api = require("./index.js");

export const parse = api.parse;
export const parseAll = api.parseAll;
export const parseFromFile = api.parseFromFile;
export const findTextByCodeValue = api.findTextByCodeValue;
export const findAllByCodeValue = api.findAllByCodeValue;
export const findTextByCodeMeaning = api.findTextByCodeMeaning;
export const matchesConceptCode = api.matchesConceptCode;
export const extractTextFromContentItem = api.extractTextFromContentItem;
export const dataSetToContentTree = api.dataSetToContentTree;
export const TAG = api.TAG;
export const DEFAULT_MAX_ELEMENT_LENGTH = api.DEFAULT_MAX_ELEMENT_LENGTH;

export default api;
