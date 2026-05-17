# Samples

Generated artifacts produced by `npm run build:samples`. Each
sample triple corresponds to one entry in `templates/chore-charts/`.

## Structure

- `svg/<slug>.svg` — vector source straight from the renderer
- `png/<slug>.png` — 600px-wide thumbnail (used by the GH Pages
  gallery in `docs/`)
- `pdfs/<slug>.pdf` — print-quality PDF, US Letter portrait,
  rendered at 300dpi, raster-embedded (text is not selectable —
  by design; this is a printable, not a document)

## v1 contents

50 samples balanced across 7 chart formats:

| Format | Count |
|--------|-------|
| weekly-grid | 8 |
| daily-checklist | 7 |
| star-chart | 7 |
| reward-tracker | 7 |
| blank-template | 7 |
| monthly-calendar | 7 |
| routine-schedule | 7 |
| multi-kid | 0 (no curated templates yet) |
| **Total** | **50** |

## Regeneration

```bash
npm run build:samples
```

Runs `tsc` first, then `scripts/build-samples.mjs`. The script
clears `svg/`, `png/`, and `pdfs/` and re-emits a fresh set every
time, picking from the latest `templates/chore-charts/` round-robin
across formats.

## Licensing

All artifacts in this directory are derivatives of the templates,
which are CC-BY-4.0. You can use the PDFs commercially or
personally; the attribution requirement is satisfied if you keep
the footer credit visible (it's baked into every PDF).

## Size budget

The full `samples/` tree is ~10 MB. We aim to keep it under 50 MB
even as v1.1 templates land. PDF size dominates (~150-220 KB
each at 300dpi). If we ever bump the count above 100 we should
move to release artifacts or a separate CDN.
