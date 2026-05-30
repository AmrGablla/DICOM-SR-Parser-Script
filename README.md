# dicom-sr-parser

Extract **TEXT** (`0040,A160`) from DICOM **Structured Reports** by **Concept Name Code Value** (`0008,0100`) — minimal Node API built on [`dicom-parser`](https://www.npmjs.com/package/dicom-parser).

```bash
npm install dicom-sr-parser
```

**Requires Node.js 18+**

## Quick start

### CLI

```bash
npx dicom-sr-parser report.dcm QURE_CODE_12
npx dicom-sr-parser --all --json report.dcm TEST_CODE_01
npx dicom-sr-parser --coding-scheme 99VENDOR report.dcm QURE_CODE_12
```

| Flag | Description |
|------|-------------|
| `--all` | All matches (uses `parseAll`) |
| `--json` | JSON on stdout |
| `--coding-scheme <id>` | Filter `(0008,0102)` |
| `--code-meaning <text>` | Filter `(0008,0104)` |
| `-h`, `--help` | Usage |

Default `codeValue`: `QURE_CODE_12`

### Library

```js
const fs = require("fs");
const { parse, parseAll, parseFromFile } = require("dicom-sr-parser");

const buffer = fs.readFileSync("report.dcm");

const { found, text } = parse(buffer, "QURE_CODE_12");
const all = parseAll(buffer, "QURE_CODE_12", {
  codingSchemeDesignator: "99VENDOR",
});
const fromDisk = parseFromFile("report.dcm", "TEST_CODE_01");
```

Long impressions (TEXT / UT): by default strings up to **1MB** are read (`maxElementLength`; dicom-parser alone truncates at 128).

```js
parse(buffer, "IMPRESSION", { maxElementLength: 2 * 1024 * 1024 });
```

### ESM

```js
import { parse, parseAll } from "dicom-sr-parser";
```

### TypeScript

Types ship with the package (`src/index.d.ts`). Run `npm run test:types`.

### dcmjs (optional)

```bash
npm install dcmjs
```

```js
const { parseNaturalizedDataset, parseWithDcmjs } = require("dicom-sr-parser/dcmjs");

parseNaturalizedDataset(naturalizedDataset, "126000");
parseWithDcmjs(buffer, "QURE_CODE_12");
```

### Browser

```bash
npm run build
```

```js
import { parse } from "dicom-sr-parser/browser";
```

See [`examples/browser-demo.html`](examples/browser-demo.html) and [`docs/guide.md`](docs/guide.md).

### Vendor presets

[`templates/qure.js`](templates/qure.js), [`templates/rsna.js`](templates/rsna.js), [`templates/tid3110.js`](templates/tid3110.js)

## API reference

| Export | Description |
|--------|-------------|
| `parse(buffer, codeValue, options?)` | First match → `{ found, text, codeValue }` |
| `parseAll(buffer, codeValue, options?)` | All matches → `{ found, matches: [{ text, path }], codeValue }` |
| `parseFromFile(path, codeValue, options?)` | Same as `parse` |
| `findTextByCodeValue(items, codeValue, options?)` | Walk pre-parsed Content Sequence |
| `findAllByCodeValue(items, codeValue, options?)` | All matches on pre-parsed tree |
| `findTextByCodeMeaning(items, codeMeaning, options?)` | Match `(0008,0104)` only |
| `matchesConceptCode(codeItem, codeValue, options?)` | Low-level concept matcher |
| `extractTextFromContentItem(item)` | Read TEXT/UT from one content item |
| `dataSetToContentTree(dataSet, options?)` | `explicitDataSetToJS` → Content Sequence |
| `TAG` | Hex tag keys used internally |
| `DEFAULT_MAX_ELEMENT_LENGTH` | Default `maxElementLength` (1MB) |

`path` in matches uses **1-based** ordinals along nested `(0040,A730)` (DICOM Referenced Content Item Identifier style).

## dicom-sr-parser vs dcmjs

| | **dicom-sr-parser** | **dcmjs** |
|--|----------------------|-----------|
| Size / deps | Tiny, `dicom-parser` only | Large, full DICOM toolkit |
| Goal | Get labeled SR text by code | Read/write SR, SEG, TID 1500, OHIF |
| API | `parse(buffer, "CODE")` | Naturalized JSON, derivations |
| Best for | ETL, scripts, vendor codes | Web viewers, derived objects |

Use **dcmjs** when you need standards-first SR creation or OHIF integration. Use **dicom-sr-parser** when you only need one field from an SR in Node.

## Examples

```bash
node examples/node-etl.cjs ./dicoms
node examples/import-esm.mjs report.dcm TEST_CODE_01
```

## Development

```bash
npm install
npm run build
npm test
npm run test:types
```

## Roadmap

[ROADMAP.md](ROADMAP.md)

## Changelog

[CHANGELOG.md](CHANGELOG.md)

## License

MIT
