export declare const TAG: {
  readonly CONTENT_SEQUENCE: "x0040a730";
  readonly CONCEPT_NAME_CODE_SEQUENCE: "x0040a043";
  readonly CODE_VALUE: "x00080100";
  readonly CODING_SCHEME_DESIGNATOR: "x00080102";
  readonly CODE_MEANING: "x00080104";
  readonly TEXT_VALUE: "x0040a160";
  readonly VALUE_TYPE: "x0040a040";
};

export declare const DEFAULT_MAX_ELEMENT_LENGTH: number;

export type SrContentItem = Record<string, unknown>;

export type DicomInput = Uint8Array;

export interface MatchOptions {
  codingSchemeDesignator?: string;
  codeMeaning?: string;
}

export interface ParseOptions extends MatchOptions {
  codeValue: string;
  maxElementLength?: number;
}

export interface ParseResult {
  found: boolean;
  text: string | null;
  codeValue: string;
}

export interface SrTextMatch {
  text: string;
  /** 1-based ordinals along Content Sequence (Referenced Content Item Identifier style) */
  path: number[];
}

export interface ParseAllResult {
  found: boolean;
  matches: SrTextMatch[];
  codeValue: string;
}

export function matchesConceptCode(
  codeItem: SrContentItem | null | undefined,
  codeValue: string | null,
  codingSchemeDesignatorOrOptions?: string | MatchOptions | null
): boolean;

export function extractTextFromContentItem(
  item: SrContentItem
): string | null;

export function findAllByCodeValue(
  contentItems: SrContentItem[] | null | undefined,
  codeValue: string,
  codingSchemeDesignatorOrOptions?: string | MatchOptions | null
): SrTextMatch[];

export function findTextByCodeValue(
  contentItems: SrContentItem[] | null | undefined,
  codeValue: string,
  codingSchemeDesignatorOrOptions?: string | MatchOptions | null
): string | null;

export function findTextByCodeMeaning(
  contentItems: SrContentItem[] | null | undefined,
  codeMeaning: string,
  options?: MatchOptions
): string | null;

export function dataSetToContentTree(
  dataSet: unknown,
  options?: { maxElementLength?: number }
): SrContentItem[] | undefined;

export function parse(
  dicomFileAsBuffer: DicomInput,
  codeValue: string,
  options?: MatchOptions & { maxElementLength?: number }
): ParseResult;

export function parse(
  dicomFileAsBuffer: DicomInput,
  options: ParseOptions
): ParseResult;

export function parseAll(
  dicomFileAsBuffer: DicomInput,
  codeValue: string,
  options?: MatchOptions & { maxElementLength?: number }
): ParseAllResult;

export function parseFromFile(
  filePath: string,
  codeValue: string,
  options?: MatchOptions & { maxElementLength?: number }
): ParseResult;
