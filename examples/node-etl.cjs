#!/usr/bin/env node
/** Example: batch extract one code from SR files in a directory. */
const fs = require("fs");
const path = require("path");
const { parse } = require("dicom-sr-parser");
const codes = require("../templates/qure.js");

const dir = process.argv[2] || ".";
const codeValue = process.argv[3] || codes.codes.impression;

for (const name of fs.readdirSync(dir)) {
  if (!name.toLowerCase().endsWith(".dcm")) continue;
  const file = path.join(dir, name);
  try {
    const { found, text } = parse(fs.readFileSync(file), codeValue);
    console.log(name, found ? text : "(not found)");
  } catch (e) {
    console.error(name, e.message);
  }
}
