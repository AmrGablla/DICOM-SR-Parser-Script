# Changelog

All notable changes to this project are documented in this file.

## [3.0.0] - 2026-05-30

### Added

- **ESM:** `import { parse } from "dicom-sr-parser"` via `src/esm.mjs` and `package.json` `exports`
- **dcmjs adapter:** `dicom-sr-parser/dcmjs` — `parseNaturalizedDataset`, `parseAllNaturalizedDataset`, `parseWithDcmjs` (optional peer `dcmjs`)
- **Browser bundle:** `dicom-sr-parser/browser` → `dist/browser.mjs` (esbuild, no `fs`)
- **Presets:** `templates/rsna.js`, `templates/tid3110.js`
- **Docs:** `docs/guide.md`, `docs/blog-draft.md`, `docs/awesome-dicom-pr.md`
- **Examples:** `examples/node-etl.cjs`, `examples/import-esm.mjs`, `examples/browser-demo.html`
- **Fixture:** `duplicate-codes-sr.dcm` for multi-match integration tests

### Changed

- `package.json` `exports` map; `prepublishOnly` runs build + tests
- Integration tests cover duplicate-code fixture

## [2.1.0] - 2026-05-30

### Added

- **`findAllByCodeValue`**, **`parseAll`**, **`parseFromFile`**, **`findTextByCodeMeaning`**, exported **`matchesConceptCode`**
- **`extractTextFromContentItem`**, **`dataSetToContentTree`** for advanced / pre-parsed trees
- **Long TEXT / UT support:** `maxElementLength` option (default 1MB) when converting datasets via `dicom-parser` (fixes truncation at 128 bytes)
- **CLI flags:** `--all`, `--json`, `--coding-scheme`, `--code-meaning`, `--help`
- **TypeScript:** `src/index.d.ts`, `npm run test:types`
- **CI:** GitHub Actions on Node 18 / 20 / 22; typecheck in CI
- **Tests:** integration fixture `test/fixtures/minimal-nested-sr.dcm`
- **Preset example:** `templates/qure.js`

### Changed

- README: API reference, CLI, TypeScript, comparison with dcmjs

## [2.0.0] - 2026-05-30

### Breaking changes

- **`parse()` return value:** Returns `{ found, text, codeValue }` instead of logging to the console.
- **Recursive Content Sequence walk:** Nested SR content items are searched recursively.

### Added

- **CLI:** `dicom-sr-parser` binary (`bin/cli.js`)
- **Optional `codingSchemeDesignator`** filter on Concept Name matches
- **Unit tests** via `npm test`
- **Node.js:** Requires Node.js 18 or newer

## [1.0.0]

### Added

- Initial release: extract TEXT (0040,A160) by Concept Name Code Value (0008,0100).
