import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const api = require("./dcmjs.js");

export const parseNaturalizedDataset = api.parseNaturalizedDataset;
export const parseAllNaturalizedDataset = api.parseAllNaturalizedDataset;
export const parseWithDcmjs = api.parseWithDcmjs;
export const NAT = api.NAT;

export default api;
