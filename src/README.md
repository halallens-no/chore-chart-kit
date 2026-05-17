# Renderer

Pure TypeScript library that turns a JSON template into an SVG.
Zero framework dependencies — works in Node, the browser, or any
JS runtime.

## v1 scope

- [ ] `render.ts` — JSON → SVG string
- [ ] `types.ts` — public types shared with `templates/schema.json`
- [ ] `index.ts` — public exports
- [ ] `__tests__/` — Vitest tests covering each chart format

## Future

- `pdf.ts` — SVG → PDF using @react-pdf/renderer or similar
- Streaming variant for very large multi-kid charts

## Status

- Phase 3 (in `ROADMAP` of the parent project) — not started.
- Port algorithms from `apps/printable-chore-chart/src/components/charts/`
  in the HalalLens monorepo. Same author, MIT-licensed for this
  kit.
