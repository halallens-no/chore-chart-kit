/**
 * Generate the GitHub Pages gallery from templates/ and samples/.
 *
 * Emits:
 *   docs/index.html               landing page (hero + top 12 thumbs)
 *   docs/gallery.html             full gallery, all 100, format-filterable
 *   docs/templates/<slug>.html    one detail page per template
 *
 * Run via `npm run build:gallery` (requires `npm run build` and
 * `npm run build:samples` to have run first so paths line up).
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(__filename), '..');
const TEMPLATES_DIR = path.join(REPO_ROOT, 'templates', 'chore-charts');
const PNG_DIR = path.join(REPO_ROOT, 'samples', 'png');
const PDF_DIR = path.join(REPO_ROOT, 'samples', 'pdfs');
const SVG_DIR = path.join(REPO_ROOT, 'samples', 'svg');
const DOCS_DIR = path.join(REPO_ROOT, 'docs');
const TEMPLATES_OUT = path.join(DOCS_DIR, 'templates');

const SITE_URL = 'https://halallens-no.github.io/chore-chart-kit';
const REPO_URL = 'https://github.com/halallens-no/chore-chart-kit';
const RAW_BASE = 'https://raw.githubusercontent.com/halallens-no/chore-chart-kit/main';
const LIVE_URL = 'https://printablechorechart.com';

const FORMAT_LABELS = {
  'weekly-grid': 'Weekly Grid',
  'daily-checklist': 'Daily Checklist',
  'star-chart': 'Star Chart',
  'reward-tracker': 'Reward Tracker',
  'multi-kid': 'Multi-Kid',
  'blank-template': 'Blank Template',
  'monthly-calendar': 'Monthly Calendar',
  'routine-schedule': 'Routine Schedule',
};

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
  })[c]);
}

function loadTemplates() {
  return fs
    .readdirSync(TEMPLATES_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(TEMPLATES_DIR, f), 'utf-8')));
}

function hasSample(slug, dir, ext) {
  return fs.existsSync(path.join(dir, `${slug}.${ext}`));
}

function templateCardHTML(t, hrefBase = '') {
  const slug = t.slug;
  const hasPng = hasSample(slug, PNG_DIR, 'png');
  const formatLabel = FORMAT_LABELS[t.format] ?? t.format;
  const href = `${hrefBase}templates/${slug}.html`;
  // Images live in samples/ which is OUTSIDE docs/ — use the raw URL so
  // GH Pages can resolve it.
  const thumb = hasPng
    ? `<img loading="lazy" src="${RAW_BASE}/samples/png/${slug}.png" alt="${esc(t.title)} preview">`
    : `<div class="card__thumb--placeholder">No preview yet — see JSON definition</div>`;
  return `
    <a class="card" href="${href}" data-format="${esc(t.format)}">
      <div class="card__thumb">${thumb}</div>
      <div class="card__body">
        <div class="card__title">${esc(t.title)}</div>
        <div class="card__meta">
          <span class="card__format">${esc(formatLabel)}</span>
          ${t.theme ? `<span>${esc(t.theme)}</span>` : ''}
        </div>
      </div>
    </a>`;
}

function header() {
  return `
  <header class="site-header">
    <div class="container">
      <a class="site-header__logo" href="./">chore-chart-kit</a>
      <nav class="site-header__nav">
        <a href="./gallery.html">Gallery</a>
        <a href="${REPO_URL}">GitHub</a>
        <a href="${LIVE_URL}">Live Editor</a>
      </nav>
    </div>
  </header>`;
}

function footer() {
  return `
  <footer class="site-footer">
    <div class="container">
      <p>
        Built by <a href="${LIVE_URL}">Flinkis</a>.
        <span class="site-footer__divider">•</span>
        Templates: CC-BY-4.0
        <span class="site-footer__divider">•</span>
        Code: MIT
        <span class="site-footer__divider">•</span>
        <a href="${REPO_URL}">Source on GitHub</a>
      </p>
      <p style="margin-top: 16px;">
        Want a no-code editor for these templates?
        Try <a href="${LIVE_URL}"><strong>printablechorechart.com</strong></a>
        — same source, friendlier UI, no install.
      </p>
    </div>
  </footer>`;
}

function landingPage(templates) {
  const totals = {
    templates: templates.length,
    pdfs: fs.readdirSync(PDF_DIR).filter(f => f.endsWith('.pdf')).length,
    formats: new Set(templates.map((t) => t.format)).size,
  };

  const featured = templates
    .filter((t) => hasSample(t.slug, PNG_DIR, 'png'))
    .slice(0, 12)
    .map((t) => templateCardHTML(t, ''))
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>chore-chart-kit — Free Open-Source Printable Chore Chart Templates</title>
<meta name="description" content="${totals.templates}+ free, open-source printable chore chart templates as JSON. CC-BY-4.0 licensed. Renderer + ${totals.pdfs} ready-to-print PDFs.">
<link rel="canonical" href="${SITE_URL}/">
<link rel="stylesheet" href="assets/styles.css">
<meta property="og:title" content="chore-chart-kit — Free Printable Chore Chart Templates">
<meta property="og:description" content="${totals.templates}+ open-source chart templates as JSON. CC-BY-4.0.">
<meta property="og:url" content="${SITE_URL}/">
<meta property="og:type" content="website">
</head>
<body>
${header()}
<main class="container">
  <section class="hero">
    <div class="hero__badges">
      <span class="badge">License: CC-BY-4.0</span>
      <span class="badge">Code: MIT</span>
      <span class="badge">${totals.templates} templates</span>
      <span class="badge">${totals.formats} formats</span>
    </div>
    <h1>Free, open-source printable<br>chore chart templates.</h1>
    <p class="tagline">
      ${totals.templates} chart designs as JSON. Render to SVG with our
      zero-dep TypeScript library, or download ${totals.pdfs}
      ready-to-print PDFs. Use them anywhere — credit
      <a href="${LIVE_URL}">printablechorechart.com</a>.
    </p>
    <div>
      <a class="btn btn-primary" href="gallery.html">Browse all ${totals.templates} templates</a>
      <a class="btn btn-secondary" href="${REPO_URL}">View on GitHub</a>
    </div>
  </section>

  <div class="stats">
    <div class="stat">
      <div class="stat__num">${totals.templates}</div>
      <div class="stat__label">Templates</div>
    </div>
    <div class="stat">
      <div class="stat__num">${totals.formats}/8</div>
      <div class="stat__label">Chart formats</div>
    </div>
    <div class="stat">
      <div class="stat__num">${totals.pdfs}</div>
      <div class="stat__label">Print-ready PDFs</div>
    </div>
    <div class="stat">
      <div class="stat__num">CC-BY</div>
      <div class="stat__label">4.0 license</div>
    </div>
  </div>

  <section>
    <h2 class="section-title">Featured templates</h2>
    <p class="section-intro">A handful of the highest-quality designs across our 8 chart formats. <a href="gallery.html">See all ${totals.templates} →</a></p>
    <div class="card-grid">${featured}</div>
  </section>

  <section>
    <h2 class="section-title">Quick start</h2>
    <p class="section-intro">Pick a template, render it with the kit, or grab the PDF.</p>
    <pre><code>npm install chore-chart-kit
# (not yet published — use the GitHub repo directly for v1)

import { renderChart } from 'chore-chart-kit';
import template from './templates/chore-charts/dinosaur-weekly.json';

const svg = renderChart(template);
// → SVG string, ready to inject or convert to PDF</code></pre>
  </section>
</main>
${footer()}
</body>
</html>`;
}

function galleryPage(templates) {
  const formats = [...new Set(templates.map((t) => t.format))].sort();
  const filterButtons = [
    `<button data-filter="*" class="is-active">All</button>`,
    ...formats.map(
      (f) => `<button data-filter="${esc(f)}">${esc(FORMAT_LABELS[f] ?? f)}</button>`,
    ),
  ].join('');
  const cards = templates.map((t) => templateCardHTML(t, '')).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Gallery — chore-chart-kit</title>
<meta name="description" content="Browse all ${templates.length} chore chart templates in chore-chart-kit. Filter by format.">
<link rel="canonical" href="${SITE_URL}/gallery.html">
<link rel="stylesheet" href="assets/styles.css">
</head>
<body>
${header()}
<main class="container">
  <section style="padding-top: 32px;">
    <h1 style="margin: 0 0 8px;">All templates</h1>
    <p class="section-intro">${templates.length} designs across ${formats.length} chart formats. Click any template for the full preview and PDF download.</p>
    <div class="filter-bar">${filterButtons}</div>
    <div class="card-grid" id="cards">${cards}</div>
  </section>
</main>
${footer()}
<script>
(function(){
  var bar = document.querySelector('.filter-bar');
  var cards = document.querySelectorAll('#cards .card');
  bar.addEventListener('click', function(e){
    var btn = e.target.closest('button');
    if (!btn) return;
    var f = btn.getAttribute('data-filter');
    bar.querySelectorAll('button').forEach(function(b){ b.classList.toggle('is-active', b === btn); });
    cards.forEach(function(c){
      var match = f === '*' || c.getAttribute('data-format') === f;
      c.style.display = match ? '' : 'none';
    });
  });
})();
</script>
</body>
</html>`;
}

function templatePage(t) {
  const slug = t.slug;
  const hasPng = hasSample(slug, PNG_DIR, 'png');
  const hasPdf = hasSample(slug, PDF_DIR, 'pdf');
  const hasSvg = hasSample(slug, SVG_DIR, 'svg');
  const formatLabel = FORMAT_LABELS[t.format] ?? t.format;

  const liveUrl = `${LIVE_URL}/en/templates/${slug}`;
  const jsonUrl = `${REPO_URL}/blob/main/templates/chore-charts/${slug}.json`;
  const pngUrl = `${RAW_BASE}/samples/png/${slug}.png`;
  const pdfUrl = `${RAW_BASE}/samples/pdfs/${slug}.pdf`;
  const svgUrl = `${RAW_BASE}/samples/svg/${slug}.svg`;

  const preview = hasPng
    ? `<img src="${pngUrl}" alt="${esc(t.title)} chart preview">`
    : `<div class="template-page__placeholder">No preview generated yet. Render this template yourself using the JSON file at <a href="${jsonUrl}">templates/chore-charts/${slug}.json</a>.</div>`;

  const downloads = [];
  if (hasPdf) {
    downloads.push(`<a class="btn btn-primary" href="${pdfUrl}" download>Download PDF</a>`);
  }
  if (hasSvg) {
    downloads.push(`<a class="btn btn-secondary" href="${svgUrl}" download>Download SVG</a>`);
  }
  downloads.push(`<a class="btn btn-secondary" href="${jsonUrl}">View JSON</a>`);

  const tags = (t.tags ?? []).slice(0, 6);

  // JSON-LD structured data
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    name: t.title,
    description: t.description ?? `${formatLabel} chore chart template — free, printable, CC-BY-4.0.`,
    fileFormat: hasPdf ? 'application/pdf' : 'image/svg+xml',
    license: 'https://creativecommons.org/licenses/by/4.0/',
    publisher: { '@type': 'Organization', name: 'Flinkis', url: LIVE_URL },
    url: `${SITE_URL}/templates/${slug}.html`,
    image: hasPng ? pngUrl : undefined,
    keywords: tags.length > 0 ? tags.join(', ') : undefined,
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(t.title)} — Free Printable ${esc(formatLabel)} Template</title>
<meta name="description" content="${esc(t.description ?? `${t.title}: free printable ${formatLabel.toLowerCase()} chore chart template. CC-BY-4.0 licensed, ready to download.`)}">
<link rel="canonical" href="${SITE_URL}/templates/${slug}.html">
<link rel="stylesheet" href="../assets/styles.css">
<meta property="og:title" content="${esc(t.title)} — Free Printable Chore Chart">
<meta property="og:description" content="${esc(t.description ?? `Free printable ${formatLabel} template, CC-BY-4.0.`)}">
<meta property="og:url" content="${SITE_URL}/templates/${slug}.html">
<meta property="og:type" content="article">
${hasPng ? `<meta property="og:image" content="${pngUrl}">` : ''}
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
${header()}
<main class="container">
  <p style="margin: 24px 0 8px; font-size: 14px;">
    <a href="../gallery.html">← All templates</a>
  </p>
  <article class="template-page">
    <div class="template-page__preview">${preview}</div>
    <div class="template-page__info">
      <h1>${esc(t.title)}</h1>
      ${t.description ? `<p class="description">${esc(t.description)}</p>` : ''}

      <div class="template-page__downloads">${downloads.join('')}</div>

      <div class="cta-box">
        <p>Want to customize this template — change colors, add your own chores, swap the theme?</p>
        <a class="btn btn-primary" href="${liveUrl}">Open in the free editor →</a>
        <p style="font-size: 12px; opacity: 0.7; margin: 12px 0 0;">
          Opens <code>printablechorechart.com</code> with this template loaded.
        </p>
      </div>

      <dl class="template-page__meta">
        <dt>Format</dt><dd>${esc(formatLabel)}</dd>
        ${t.theme ? `<dt>Theme</dt><dd>${esc(t.theme)}</dd>` : ''}
        <dt>Slug</dt><dd><code>${esc(slug)}</code></dd>
        <dt>Version</dt><dd>${esc(t.version)}</dd>
        <dt>License</dt><dd><a href="https://creativecommons.org/licenses/by/4.0/">${esc(t.license)}</a></dd>
        ${tags.length > 0 ? `<dt>Tags</dt><dd>${tags.map((k) => `<span class="badge" style="font-size:11px;margin:2px 4px 2px 0;">${esc(k)}</span>`).join('')}</dd>` : ''}
      </dl>
    </div>
  </article>
</main>
${footer()}
</body>
</html>`;
}

function main() {
  fs.mkdirSync(TEMPLATES_OUT, { recursive: true });
  // Clean old template pages (re-runnable)
  for (const f of fs.readdirSync(TEMPLATES_OUT)) {
    if (f.endsWith('.html')) fs.unlinkSync(path.join(TEMPLATES_OUT, f));
  }
  // Old /gallery/ subdir from Phase 1 → replace with /gallery.html
  const oldGalleryDir = path.join(DOCS_DIR, 'gallery');
  if (fs.existsSync(oldGalleryDir) && fs.statSync(oldGalleryDir).isDirectory()) {
    fs.rmSync(oldGalleryDir, { recursive: true, force: true });
  }

  const templates = loadTemplates();

  fs.writeFileSync(path.join(DOCS_DIR, 'index.html'), landingPage(templates));
  fs.writeFileSync(path.join(DOCS_DIR, 'gallery.html'), galleryPage(templates));

  let withPng = 0;
  let withPdf = 0;
  for (const t of templates) {
    if (hasSample(t.slug, PNG_DIR, 'png')) withPng++;
    if (hasSample(t.slug, PDF_DIR, 'pdf')) withPdf++;
    fs.writeFileSync(path.join(TEMPLATES_OUT, `${t.slug}.html`), templatePage(t));
  }

  // .nojekyll lets GH Pages serve files starting with _ if we add any
  fs.writeFileSync(path.join(DOCS_DIR, '.nojekyll'), '');

  console.log(`Wrote landing page → docs/index.html`);
  console.log(`Wrote gallery page → docs/gallery.html`);
  console.log(`Wrote ${templates.length} template pages → docs/templates/`);
  console.log(`  ${withPng}/${templates.length} have PNG thumbnails`);
  console.log(`  ${withPdf}/${templates.length} have PDF downloads`);
}

main();
