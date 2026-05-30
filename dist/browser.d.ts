import type {
  ParseResult,
  ParseAllResult,
  MatchOptions,
  SrTextMatch,
  SrContentItem,
} from "../src/index";

export const TAG: Record<string, string>;
export const DEFAULT_MAX_ELEMENT_LENGTH: number;

export function parse(
  buffer: Uint8Array,
  codeValue: string,
  options?: MatchOptions & { maxElementLength?: number }
): ParseResult;

export function parseAll(
  buffer: Uint8Array,
  codeValue: string,
  options?: MatchOptions & { maxElementLength?: number }
): ParseAllResult;

export function findTextByCodeValue(
  items: SrContentItem[] | null | undefined,
  codeValue: string,
  options?: MatchOptions | string | null
): string | null;

export function findAllByCodeValue(
  items: SrContentItem[] | null | undefined,
  codeValue: string,
  options?: MatchOptions | string | null
): SrTextMatch[];
