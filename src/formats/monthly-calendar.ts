import type { Template } from '../types.js';
import { rect, text, line } from '../utils/svg.js';
import { resolveColors, MARGIN } from '../utils/layout.js';
import { bodyTop, bodyBottom, DEFAULT_FONT, renderHeader, renderFooter } from '../utils/parts.js';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function renderMonthlyCalendar(t: Template, width: number, height: number, attribution: boolean): string {
  const c = resolveColors(t.colors);
  const top = bodyTop();
  const bottom = bodyBottom(height);
  const tableWidth = width - MARGIN * 2;
  const cols = 7;
  const rows = 6;
  const colWidth = tableWidth / cols;
  const headerStripH = 28;
  const cellH = (bottom - top - headerStripH - 32) / rows;

  const cells: string[] = [];

  // Month label strip
  cells.push(
    rect(MARGIN, top, tableWidth, 28, { fill: c.accent, opacity: 0.18, rx: 4, ry: 4 }),
    text(MARGIN + 16, top + 19, 'Month:', {
      'font-family': DEFAULT_FONT,
      'font-size': 13,
      'font-weight': 600,
      fill: c.header,
    }),
    line(MARGIN + 70, top + 22, MARGIN + tableWidth - 16, top + 22, {
      stroke: c.border,
      'stroke-width': 1,
    }),
  );

  // Day-of-week headers
  const gridTop = top + 32 + headerStripH;
  DAYS.forEach((d, i) => {
    cells.push(
      rect(MARGIN + colWidth * i, gridTop - headerStripH, colWidth, headerStripH, {
        fill: c.header,
        opacity: 0.85,
      }),
      text(MARGIN + colWidth * (i + 0.5), gridTop - 9, d, {
        'text-anchor': 'middle',
        'font-family': DEFAULT_FONT,
        'font-size': 12,
        'font-weight': 700,
        fill: c.headerText,
      }),
    );
  });

  // Cells
  for (let r = 0; r < rows; r++) {
    for (let cIdx = 0; cIdx < cols; cIdx++) {
      const x = MARGIN + colWidth * cIdx;
      const y = gridTop + cellH * r;
      const bg = (r + cIdx) % 2 === 0 ? c.rowEven : c.rowOdd;
      cells.push(
        rect(x, y, colWidth, cellH, { fill: bg, stroke: c.border, 'stroke-width': 0.6 }),
        rect(x + 5, y + 5, 18, 14, { fill: 'none', stroke: c.border, 'stroke-width': 0.8, rx: 2, ry: 2 }),
      );
    }
  }

  cells.push(
    rect(MARGIN, gridTop - headerStripH, tableWidth, headerStripH + cellH * rows, {
      fill: 'none',
      stroke: c.border,
      'stroke-width': 1.2,
      rx: 4,
      ry: 4,
    }),
  );

  return renderHeader(t, width, 'Monthly Calendar') + cells.join('') + renderFooter(t, width, height, attribution);
}
