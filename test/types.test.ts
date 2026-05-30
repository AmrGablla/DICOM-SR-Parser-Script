/**
 * Compile-only checks for hand-written declarations (src/index.d.ts).
 * Run: npm run test:types
 */
import {
  findAllByCodeValue,
  findTextByCodeValue,
  parse,
  parseAll,
  TAG,
  type ParseAllResult,
  type ParseResult,
} from "../src/index.js";

const buffer = new Uint8Array([0]);

const byCodeValue: ParseResult = parse(buffer, "QURE_CODE_12");
const byOptions: ParseResult = parse(buffer, {
  codeValue: "QURE_CODE_12",
  codingSchemeDesignator: "99TEST",
});

const all: ParseAllResult = parseAll(buffer, "QURE_CODE_12");
const matches = findAllByCodeValue([], "X");

const nestedText: string | null = findTextByCodeValue(
  [{ [TAG.TEXT_VALUE]: "ok" }],
  "CODE",
  null
);

void byCodeValue.found;
void byOptions.text;
void all.matches[0]?.path;
void matches.length;
void nestedText;
void TAG.CODE_MEANING;
