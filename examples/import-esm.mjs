import { parse, parseAll } from "dicom-sr-parser";
import fs from "node:fs";

const buffer = fs.readFileSync(process.argv[2] || "report.dcm");
const code = process.argv[3] || "TEST_CODE_01";

console.log(parse(buffer, code));
console.log(parseAll(buffer, code));
