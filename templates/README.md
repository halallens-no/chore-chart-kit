# Templates

100+ chore chart templates as JSON files. Each template conforms
to [`schema.json`](schema.json).

## Structure

- `schema.json` — JSON Schema definition for all templates
- `index.json` — auto-generated catalog (slug → metadata)
- `chore-charts/` — individual template files

## Validation

```bash
npx ajv validate -s schema.json -d "chore-charts/*.json"
```

CI runs this on every PR via `.github/workflows/validate.yml`.

## Naming

Filename = `<slug>.json`. The slug field inside the JSON must
match the filename (minus `.json`).

```
chore-charts/dinosaur-weekly.json
                    ↑
              slug: "dinosaur-weekly"
```

## v1 status

- [ ] Phase 2: migrate 100 hand-picked templates from
      printablechorechart.com MySQL → JSON files (text-only)
- [ ] Phase 4: regenerate `index.json`

Coming in v1.1 (pending image-licensing review):

- [ ] Themed background images
