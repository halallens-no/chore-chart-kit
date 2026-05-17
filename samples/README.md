# Samples

Ready-to-print PDFs and preview PNGs generated from
`templates/chore-charts/`.

## Structure

- `pdfs/` — US Letter, 300dpi, watermark-free (CC-BY attribution
  covers credit)
- `png/` — 600×800 previews for the README + GH Pages gallery

## Regenerating

PDFs are auto-built by the GH Actions workflow on every push to
`templates/chore-charts/`. Do not commit PDFs by hand — CI owns
them.

PNGs are committed by hand for now (until the rendering CI is
wired up in Phase 4).

## v1 target

50 PDFs, one per format-theme combination (8 formats × ~6
themes).
