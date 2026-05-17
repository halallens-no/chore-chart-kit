import type { Template } from '../types.js';
import { rect, text, line } from '../utils/svg.js';
import { resolveColors, MARGIN } from '../utils/layout.js';
import { bodyTop, bodyBottom, DEFAULT_FONT, renderHeader, renderFooter } from '../utils/parts.js';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DEFAULT_KIDS = ['Kid 1', 'Kid 2'];
const DEFAULT_ROWS = 5;

/**
 * Multi-kid weekly grid. Side-by-side panels, one per kid.
 * v1 supports up to 3 kids on a single Letter sheet.
 */
export function renderMultiKid(t: Template, width: number, height: number, attribution: boolean): string {
  const c = resolveColors(t.colors);
  const top = bodyTop();
  const bottom = bodyBottom(height);
  const tableWidth = width - MARGIN * 2;
  const kids = t.columns ?? DEFAULT_KIDS;
  const numKids = Math.min(kids.length, 3);
  const panelWidth = (tableWidth - (numKids - 1) * 12) / numKids;

  const rows = t.rows && t.rows.length > 0
    ? t.rows
    : Array.from({ length: DEFAULT_ROWS }, () => ({ label: '' }));
  const dayCols = DAYS;
  const labelW = 60;
  const dayW = (panelWidth - labelW) / dayCols.length;
  const rowHeight = (bottom - top - 56) / rows.length;

  const cells: string[] = [];

  kids.slice(0, numKids).forEach((kidName, ki) => {
    const px = MARGIN + (panelWidth + 12) * ki;

    // Kid name banner
    cells.push(
      rect(px, top, panelWidth, 24, { fill: c.accent, opacity: 0.25, rx: 4, ry: 4 }),
      text(px + panelWidth / 2, top + 17, kidName, {
        'text-anchor': 'middle',
        'font-family': DEFAULT_FONT,
        'font-size': 12,
        'font-weight': 700,
        fill: c.header,
      }),
    );

    // Day headers
    const headerY = top + 28;
    cells.push(
      rect(px, headerY, panelWidth, 22, { fill: c.header, opacity: 0.85 }),
      text(px + labelW / 2, headerY + 15, 'Task', {
        'text-anchor': 'middle',
        'font-family': DEFAULT_FONT,
        'font-size': 9,
        'font-weight': 700,
        fill: c.headerText,
      }),
    );
    dayCols.forEach((d, di) => {
      cells.push(
        text(px + labelW + dayW * (di + 0.5), headerY + 15, d.slice(0, 1), {
          'text-anchor': 'middle',
          'font-family': DEFAULT_FONT,
          'font-size': 9,
          'font-weight': 700,
          fill: c.headerText,
        }),
      );
    });

    // Rows
    rows.forEach((row, ri) => {
      const y = headerY + 22 + rowHeight * ri;
      const bg = ri % 2 === 0 ? c.rowEven : c.rowOdd;
      cells.push(rect(px, y, panelWidth, rowHeight, { fill: bg }));
      if (row.label) {
        cells.push(
          text(px + 4, y + rowHeight / 2 + 4, row.label, {
            'font-family': DEFAULT_FONT,
            'font-size': 9,
            fill: c.border,
          }),
        );
      }
      const boxSize = Math.min(rowHeight - 8, 12);
      dayCols.forEach((_d, di) => {
        const cx = px + labelW + dayW * (di + 0.5);
        const cy = y + rowHeight / 2;
        cells.push(
          rect(cx - boxSize / 2, cy - boxSize / 2, boxSize, boxSize, {
            fill: 'white',
            stroke: c.border,
            'stroke-width': 0.8,
            rx: 2,
            ry: 2,
          }),
        );
      });
    });

    cells.push(
      rect(px, headerY, panelWidth, 22 + rowHeight * rows.length, {
        fill: 'none',
        stroke: c.border,
        'stroke-width': 0.8,
        rx: 4,
        ry: 4,
      }),
      line(px + labelW, headerY, px + labelW, headerY + 22 + rowHeight * rows.length, {
        stroke: c.border,
        'stroke-width': 0.6,
      }),
    );
  });

  return renderHeader(t, width, 'Multi-Kid Chart') + cells.join('') + renderFooter(t, width, height, attribution);
}
