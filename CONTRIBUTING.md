# Contributing

Thanks for considering a contribution! This repo accepts:

- New chart templates (JSON files in `templates/chore-charts/`)
- Bug fixes for the renderer in `src/`
- Documentation improvements
- New examples in `examples/`

## Submitting a template

1. Fork the repo
2. Create a JSON file at
   `templates/chore-charts/<your-slug>.json` matching
   `templates/schema.json`
3. Generate a 600×800 PNG preview and put it at
   `samples/png/<your-slug>.png`
4. Open a PR. CI will validate the JSON against the schema and
   regenerate the PDF from your template.

## Template guidelines

- **Slug:** lowercase, hyphens, 2-5 words. Match the filename.
- **Title:** human-readable, e.g. "Dinosaur Weekly Chore Chart"
- **Format:** one of `weekly-grid`, `daily-checklist`,
  `star-chart`, `reward-tracker`, `multi-kid`, `blank-template`,
  `monthly-calendar`, `routine-schedule`
- **Theme:** keep simple (`dinosaur`, `space`, `unicorn`,
  `minimalist`, etc.)
- **Color contrast:** must meet WCAG AA (4.5:1 for text)
- **Print-safe colors:** test on a B&W printer. Avoid colors
  that vanish to white.

## Code contributions

- TypeScript only (no JS)
- `npm test` must pass
- New behaviors need tests in `src/__tests__/`

## Licensing

- Templates and PNGs/PDFs you contribute → CC-BY-4.0
- Code you contribute → MIT

By submitting a PR, you agree to these terms. Don't submit
templates you didn't create or didn't license correctly.
