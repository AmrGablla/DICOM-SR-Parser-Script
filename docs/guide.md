# DICOM SR text extraction guide

## Content Sequence `(0040,A730)`

Structured Reports store narrative and coded findings in a **tree** of content items. Each item can have:

| Attribute | Tag | Role |
|-----------|-----|------|
| Concept Name Code Sequence | `(0040,A043)` | What this node means (Code Value `0008,0100`) |
| Text Value | `(0040,A160)` | TEXT / UT string payload |
| Content Sequence | `(0040,A730)` | Child nodes |

**dicom-sr-parser** walks this tree recursively and returns `Text Value` when the concept code matches.

## Code Value vs Code Meaning

- **Code Value** `(0008,0100)` — usually what vendors expose (e.g. `QURE_CODE_12`).
- **Code Meaning** `(0008,0104)` — human label (e.g. `Finding` in TID 3110).

```js
const { parse, findTextByCodeMeaning } = require("dicom-sr-parser");

parse(buffer, "121071", { codeMeaning: "Finding", codingSchemeDesignator: "DCM" });
findTextByCodeMeaning(contentItems, "Finding");
```

## Paths

`findAllByCodeValue` returns `path: [1, 2, 1]` — 1-based indices into nested Content Sequences (same idea as Referenced Content Item Identifier).

## Long text (UT)

`dicom-parser` truncates strings at 128 bytes by default. This library uses `maxElementLength` (default 1MB):

```js
parse(buffer, "IMPRESSION", { maxElementLength: 2 * 1024 * 1024 });
```

## dcmjs

If you already naturalize with [dcmjs](https://www.npmjs.com/package/dcmjs):

```js
const { parseNaturalizedDataset } = require("dicom-sr-parser/dcmjs");
parseNaturalizedDataset(dataset, "126000");
```

## Browser

```html
<script type="module">
  import { parse } from "./node_modules/dicom-sr-parser/dist/browser.mjs";
  const res = await fetch("report.dcm");
  const buf = new Uint8Array(await res.arrayBuffer());
  console.log(parse(buf, "TEST_CODE_01"));
</script>
```

Build: `npm run build`
