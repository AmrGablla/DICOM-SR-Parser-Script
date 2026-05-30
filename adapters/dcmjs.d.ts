import type { MatchOptions, ParseAllResult, ParseResult } from "../src/index";

export declare const NAT: {
  readonly CONTENT_SEQUENCE: "ContentSequence";
  readonly CONCEPT_NAME_CODE_SEQUENCE: "ConceptNameCodeSequence";
  readonly CODE_VALUE: "CodeValue";
  readonly CODING_SCHEME_DESIGNATOR: "CodingSchemeDesignator";
  readonly CODE_MEANING: "CodeMeaning";
  readonly TEXT_VALUE: "TextValue";
};

export function parseNaturalizedDataset(
  dataset: Record<string, unknown>,
  codeValue: string,
  options?: MatchOptions
): ParseResult;

export function parseAllNaturalizedDataset(
  dataset: Record<string, unknown>,
  codeValue: string,
  options?: MatchOptions
): ParseAllResult;

export function parseWithDcmjs(
  dicomBytes: Uint8Array | ArrayBuffer,
  codeValue: string,
  options?: MatchOptions
): ParseResult;
