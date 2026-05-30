import assert from "node:assert/strict";
import { parse, TAG } from "../src/esm.mjs";

assert.equal(typeof parse, "function");
assert.equal(TAG.CONTENT_SEQUENCE, "x0040a730");

console.log("ok");
