# Blog draft: Extract impression text from DICOM SR in Node

**Title:** Extract impression text from DICOM Structured Reports in Node (without a PACS SDK)

**Hook:** Radiology AI and reporting pipelines often receive DICOM SR files with vendor-specific concept codes. You do not need a full toolkit to read one TEXT field.

**Outline:**

1. What is an SR Content Sequence (diagram: root → container → text item).
2. Code Value `0008,0100` vs your vendor’s `QURE_CODE_12`.
3. Three lines with `dicom-sr-parser`:

```js
const { parse } = require("dicom-sr-parser");
const { found, text } = parse(fs.readFileSync("report.dcm"), "QURE_CODE_12");
```

4. Nested items — why flat parsers fail.
5. When to use dcmjs + OHIF instead.
6. Link: npm package, GitHub, `docs/guide.md`.

**Tags:** DICOM, Structured Report, Node.js, radiology, medical imaging
