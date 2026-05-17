import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { renderChart } from '../render.js';
import type { Template } from '../types.js';

const REPO_ROOT = path.resolve(__dirname, '../..');
const TEMPLATES_DIR = path.join(REPO_ROOT, 'templates', 'chore-charts');

function loadTemplate(slug: string): Template {
  const raw = fs.readFileSync(path.join(TEMPLATES_DIR, `${slug}.json`), 'utf-8');
  return JSON.parse(raw) as Template;
}

function allTemplates(): Template[] {
  return fs
    .readdirSync(TEMPLATES_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(TEMPLATES_DIR, f), 'utf-8')) as Template);
}

describe('renderChart', () => {
  it('rejects an empty template', () => {
    expect(() => renderChart({} as Template)).toThrow();
  });

  it('rejects an unknown format', () => {
    const bad = {
      slug: 'x',
      title: 'x',
      format: 'mystery-format',
      version: '1.0.0',
      license: 'CC-BY-4.0',
    } as unknown as Template;
    expect(() => renderChart(bad)).toThrow(/format is invalid/);
  });

  it('produces valid SVG for the first real template', () => {
    const t = allTemplates()[0]!;
    const svg = renderChart(t);
    expect(svg.startsWith('<svg ')).toBe(true);
    expect(svg.endsWith('</svg>')).toBe(true);
    expect(svg).toContain(`viewBox="0 0 612 792"`); // US Letter
  });

  it('includes the template title in the output', () => {
    const t = allTemplates()[0]!;
    const svg = renderChart(t);
    // title may have XML-escaped chars; check the first 8 alphanum chars
    const stem = (t.title.match(/[A-Za-z0-9]+/g) ?? []).join(' ').slice(0, 8);
    expect(svg).toContain(stem);
  });

  it('includes the CC-BY attribution footer by default', () => {
    const t = allTemplates()[0]!;
    const svg = renderChart(t);
    expect(svg).toContain('Flinkis');
    expect(svg).toContain('CC-BY-4.0');
  });

  it('omits the attribution footer when disabled', () => {
    const t = allTemplates()[0]!;
    const svg = renderChart(t, { attribution: false });
    expect(svg).not.toContain('CC-BY-4.0');
  });

  it('renders all 100 curated templates without throwing', () => {
    const templates = allTemplates();
    expect(templates.length).toBe(100);
    for (const t of templates) {
      const svg = renderChart(t);
      expect(svg.length).toBeGreaterThan(500);
      expect(svg.startsWith('<svg ')).toBe(true);
      expect(svg.endsWith('</svg>')).toBe(true);
    }
  });

  describe('format dispatch', () => {
    const formats = [
      'weekly-grid',
      'daily-checklist',
      'star-chart',
      'reward-tracker',
      'blank-template',
      'monthly-calendar',
      'routine-schedule',
    ] as const;

    for (const fmt of formats) {
      it(`renders ${fmt}`, () => {
        const templates = allTemplates().filter((t) => t.format === fmt);
        expect(templates.length).toBeGreaterThan(0);
        const svg = renderChart(templates[0]!);
        expect(svg).toContain('<svg ');
        expect(svg).toContain('</svg>');
      });
    }

    it('renders multi-kid with synthetic data (no curated multi-kid templates yet)', () => {
      const synthetic: Template = {
        slug: 'test-multi-kid',
        title: 'Two-Kid Test',
        format: 'multi-kid',
        version: '1.0.0',
        license: 'CC-BY-4.0',
        columns: ['Alice', 'Bob'],
        rows: [{ label: 'Brush teeth' }, { label: 'Make bed' }, { label: 'Pack bag' }],
      };
      const svg = renderChart(synthetic);
      expect(svg).toContain('Alice');
      expect(svg).toContain('Bob');
    });
  });

  describe('color override', () => {
    it('uses template colors when provided', () => {
      const t: Template = {
        slug: 'color-test',
        title: 'Color Test',
        format: 'weekly-grid',
        version: '1.0.0',
        license: 'CC-BY-4.0',
        colors: { header: '#ABCDEF', headerText: '#123456' },
      };
      const svg = renderChart(t);
      expect(svg).toContain('#ABCDEF');
      expect(svg).toContain('#123456');
    });
  });

  describe('XML escaping', () => {
    it('escapes special chars in title', () => {
      const t: Template = {
        slug: 'xml-test',
        title: 'Title <with> "quotes" & ampersand',
        format: 'weekly-grid',
        version: '1.0.0',
        license: 'CC-BY-4.0',
      };
      const svg = renderChart(t);
      expect(svg).toContain('&lt;with&gt;');
      expect(svg).toContain('&quot;quotes&quot;');
      expect(svg).toContain('&amp;');
      expect(svg).not.toMatch(/Title <with>/);
    });
  });
});

describe('all templates pass schema invariants', () => {
  it('every template has required fields and a valid format', () => {
    const VALID = new Set([
      'weekly-grid', 'daily-checklist', 'star-chart', 'reward-tracker',
      'multi-kid', 'blank-template', 'monthly-calendar', 'routine-schedule',
    ]);
    for (const t of allTemplates()) {
      expect(t.slug).toBeTruthy();
      expect(t.title).toBeTruthy();
      expect(VALID.has(t.format)).toBe(true);
      expect(t.version).toBeTruthy();
      expect(t.license).toBe('CC-BY-4.0');
    }
  });

  it('every template slug matches its filename', () => {
    const files = fs.readdirSync(TEMPLATES_DIR).filter((f) => f.endsWith('.json'));
    for (const f of files) {
      const t = JSON.parse(fs.readFileSync(path.join(TEMPLATES_DIR, f), 'utf-8')) as Template;
      expect(t.slug).toBe(f.replace(/\.json$/, ''));
    }
  });
});
