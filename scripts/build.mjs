import * as esbuild from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

fs.mkdirSync(dist, { recursive: true });

await esbuild.build({
  entryPoints: [path.join(root, "src/browser-entry.js")],
  outfile: path.join(dist, "browser.mjs"),
  bundle: true,
  format: "esm",
  platform: "browser",
  target: ["es2020"],
  sourcemap: true,
  minify: true,
  define: {
    "process.env.NODE_DEBUG": '""',
  },
  banner: {
    js: "var global = globalThis;",
  },
});

const dts = `import type {
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
`;

fs.writeFileSync(path.join(dist, "browser.d.ts"), dts);
console.log("Built dist/browser.mjs");
