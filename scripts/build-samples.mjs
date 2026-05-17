/**
 * Build 50 sample artifacts from the curated template JSON files.
 *
 * For each picked template, writes:
 *   samples/svg/<slug>.svg    — vector source from renderChart()
 *   samples/png/<slug>.png    — 600×800 thumbnail for the GH Pages gallery
 *   samples/pdfs/<slug>.pdf   — print-quality PDF (US Letter @ 300dpi)
 *
 * Run via `npm run build:samples` (requires `npm run build` first).
 * Selection: balanced across formats via round-robin.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { PDFDocument } from 'pdf-lib';
import { renderChart } from '../dist/index.js';

const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(__filename), '..');
const TEMPLATES_DIR = path.join(REPO_ROOT, 'templates', 'chore-charts');
const SAMPLES_DIR = path.join(REPO_ROOT, 'samples');
const SVG_DIR = path.join(SAMPLES_DIR, 'svg');
const PNG_DIR = path.join(SAMPLES_DIR, 'png');
const PDF_DIR = path.join(SAMPLES_DIR, 'pdfs');
const TARGET_COUNT = 50;

const FORMATS = [
  'weekly-grid', 'daily-checklist', 'star-chart', 'reward-tracker',
  'multi-kid', 'blank-template', 'monthly-calendar', 'routine-schedule',
];

// US Letter at 300dpi
const PDF_PT_W = 612;
const PDF_PT_H = 792;
const DPI = 300;
const PNG_PRINT_W = Math.round((PDF_PT_W / 72) * DPI); // 2550
const PNG_THUMB_W = 600;

function loadAllTemplates() {
  return fs
    .readdirSync(TEMPLATES_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(TEMPLATES_DIR, f), 'utf-8')));
}

function pickBalanced(all, target) {
  const byFormat = new Map();
  for (const t of all) {
    if (!byFormat.has(t.format)) byFormat.set(t.format, []);
    byFormat.get(t.format).push(t);
  }
  const picked = [];
  let safety = 0;
  while (picked.length < target && safety < 500) {
    let added = false;
    for (const fmt of FORMATS) {
      if (picked.length >= target) break;
      const supply = byFormat.get(fmt);
      if (!supply || supply.length === 0) continue;
      picked.push(supply.shift());
      added = true;
    }
    if (!added) break;
    safety++;
  }
  return picked;
}

async function renderOne(t) {
  const svg = renderChart(t);
  fs.writeFileSync(path.join(SVG_DIR, `${t.slug}.svg`), svg, 'utf-8');

  // Thumbnail for GH Pages gallery
  const thumb = new Resvg(svg, {
    fitTo: { mode: 'width', value: PNG_THUMB_W },
    font: { loadSystemFonts: true },
  }).render().asPng();
  fs.writeFileSync(path.join(PNG_DIR, `${t.slug}.png`), thumb);

  // Print-quality raster for PDF embedding
  const print = new Resvg(svg, {
    fitTo: { mode: 'width', value: PNG_PRINT_W },
    font: { loadSystemFonts: true },
  }).render().asPng();

  // Wrap raster in a PDF
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([PDF_PT_W, PDF_PT_H]);
  const pngImage = await pdf.embedPng(print);
  page.drawImage(pngImage, { x: 0, y: 0, width: PDF_PT_W, height: PDF_PT_H });
  pdf.setTitle(t.title);
  pdf.setAuthor('Flinkis (printablechorechart.com)');
  pdf.setCreator('chore-chart-kit');
  pdf.setSubject(`${t.format} chore chart template`);
  pdf.setKeywords([t.format, 'chore-chart', 'printable', ...(t.tags ?? [])]);
  const pdfBytes = await pdf.save();
  fs.writeFileSync(path.join(PDF_DIR, `${t.slug}.pdf`), pdfBytes);

  return {
    svgBytes: Buffer.byteLength(svg),
    pngThumbBytes: thumb.length,
    pdfBytes: pdfBytes.length,
  };
}

async function main() {
  fs.mkdirSync(SVG_DIR, { recursive: true });
  fs.mkdirSync(PNG_DIR, { recursive: true });
  fs.mkdirSync(PDF_DIR, { recursive: true });

  // Clean old artifacts (re-runnable)
  for (const dir of [SVG_DIR, PNG_DIR, PDF_DIR]) {
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith('.svg') || f.endsWith('.png') || f.endsWith('.pdf')) {
        fs.unlinkSync(path.join(dir, f));
      }
    }
  }

  const all = loadAllTemplates();
  const picked = pickBalanced(all, TARGET_COUNT);
  console.log(`Selected ${picked.length} templates`);
  const byFmt = new Map();
  for (const t of picked) byFmt.set(t.format, (byFmt.get(t.format) ?? 0) + 1);
  for (const [fmt, n] of [...byFmt.entries()].sort()) console.log(`  ${fmt.padEnd(20)} ${n}`);
  console.log();

  let totalPdfBytes = 0;
  let totalPngBytes = 0;
  for (let i = 0; i < picked.length; i++) {
    const t = picked[i];
    const r = await renderOne(t);
    totalPdfBytes += r.pdfBytes;
    totalPngBytes += r.pngThumbBytes;
    if ((i + 1) % 10 === 0 || i === picked.length - 1) {
      console.log(`  [${i + 1}/${picked.length}] ${t.slug}`);
    }
  }

  console.log();
  console.log(`Wrote ${picked.length} samples`);
  console.log(`  Total PDF size: ${(totalPdfBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Total PNG size: ${(totalPngBytes / 1024 / 1024).toFixed(2)} MB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
