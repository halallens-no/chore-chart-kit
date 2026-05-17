# chore-chart-kit

> Free, open-source library of printable chore chart templates.
> 100+ designs across 8 chart formats. JSON-defined, SVG/PDF
> renderable, CC-BY-4.0 licensed.

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC_BY_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Code: MIT](https://img.shields.io/badge/code-MIT-blue.svg)](LICENSE-MIT)

> 🚧 **v1.0 in active development.** Templates and renderer are
> being curated and ported now. Star the repo to follow along —
> first batch lands when phase 2 completes.

## What's in here

- **100+ chore chart templates** as JSON (text-only in v1; themed
  backgrounds added in v1.1 after image-licensing confirmation)
- **50 ready-to-print PDFs** (US Letter, watermark-free)
- **TypeScript renderer** in `src/` — pure JSON → SVG, no
  framework dependency
- **Examples** for Next.js and plain HTML
- **GitHub Pages gallery** at
  https://halallens-no.github.io/chore-chart-kit

## Quick start

### Just want a PDF?

Browse `samples/pdfs/` and download the one you like. Drag it into
any printer dialog. Done.

### Building an app?

```ts
import { renderChart } from './src';
import dinosaurWeekly from './templates/chore-charts/dinosaur-weekly.json';

const svg = renderChart(dinosaurWeekly);
// → SVG string, ready to inject into a page or convert to PDF
```

### Browsing in your browser?

→ https://halallens-no.github.io/chore-chart-kit

The Pages site renders every template in the repo with download
links to the corresponding PDF.

## Chart formats

| Format | Description |
|--------|-------------|
| Weekly grid | Chores as rows, Mon–Sun columns |
| Daily checklist | Single day, checkboxes by time of day |
| Star / sticker chart | Earn stars per completed chore |
| Reward tracker | Progress bar toward a goal |
| Multiple kids | Side-by-side charts for siblings |
| Blank template | Themed grid, parent writes in chores |
| Monthly calendar | 30-day view with daily checkboxes |
| Routine schedule | Time-slot based schedule |

## Template schema

Every template is a JSON file conforming to
[`templates/schema.json`](templates/schema.json). Validate locally
with:

```bash
npx ajv validate -s templates/schema.json -d "templates/chore-charts/*.json"
```

## Contributing

Template submissions welcome — see
[CONTRIBUTING.md](CONTRIBUTING.md). PRs need:

1. JSON file in `templates/chore-charts/`
2. PNG preview in `samples/png/`
3. Passes schema validation (CI checks this)

## License

- **Templates (`templates/`, `samples/`):** [CC-BY-4.0](LICENSE).
  Free for any use — commercial, personal, modified — with credit
  to Flinkis / printablechorechart.com.
- **Code (`src/`, `examples/`):** [MIT](LICENSE-MIT). No
  restrictions.

## Want a no-code editor for these?

We also run [**printablechorechart.com**](https://printablechorechart.com)
— a free web editor that customizes any of these templates without
touching code. Same source, friendlier UI, no install.
