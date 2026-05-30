# Product roadmap

**Package:** [`dicom-sr-parser`](https://www.npmjs.com/package/dicom-sr-parser)  
**Current version:** 3.0.0  
**Status:** Roadmap complete for v1–v3 scope. Phase 4 deferred until community traction.

Last updated: 2026-05-30

---

## Status summary

| Phase | Theme | Status |
|-------|--------|--------|
| **1** | Credibility & 2.x release | **Done** |
| **2** | Focused API power | **Done** |
| **3** | Ecosystem hooks | **Done** |
| **4** | Growth experiments | **Deferred** (manual / external repos) |

---

## Phase 1 — Credibility

All items **done**, including npm publish (2.x / 3.x).

---

## Phase 2 — Focused API

All items **done**, including ESM (`src/esm.mjs` + `exports`), duplicate-code fixture, CLI flags.

---

## Phase 3 — Ecosystem

| Item | Status |
|------|--------|
| README vs dcmjs | Done |
| Presets qure / rsna / tid3110 | Done |
| dcmjs adapter (`dicom-sr-parser/dcmjs`) | Done |
| Browser bundle (`dicom-sr-parser/browser`) | Done |
| Developer guide (`docs/guide.md`) | Done |
| Blog + Awesome DICOM drafts | Done (`docs/blog-draft.md`, `docs/awesome-dicom-pr.md`) |
| Examples (Node ETL, ESM, browser HTML) | Done |
| Full VitePress docs site | **Out of scope** (guide.md sufficient) |

---

## Phase 4 — Deferred

Not planned in this repo unless there is clear demand:

- TID wrapper modules beyond `templates/tid3110.js`
- OHIF / Cornerstone plugin (use separate example repo)
- VS Code snippets
- PACS webhook service

---

## Release checklist (3.0.0)

1. [x] `npm run build` && `npm test` && `npm run test:types`
2. [x] CHANGELOG 3.0.0
3. [x] README ESM / dcmjs / browser
4. [ ] `npm publish` **3.0.0**
5. [ ] GitHub release notes (copy CHANGELOG)
6. [ ] Submit Awesome DICOM PR using `docs/awesome-dicom-pr.md`
7. [ ] Publish blog using `docs/blog-draft.md`

---

## Maintenance

- Keep `dicom-parser` / optional `dcmjs` peers updated
- Add presets as community reports vendor codes
- Issues: real `.dcm` samples (anonymized) welcome for fixture expansion

**One-liner:** *The smallest Node library to pull impression/findings text from DICOM SR by concept code.*
