import type { Template } from '../types.js';
import { line, rect, text } from '../utils/svg.js';
import { resolveColors, MARGIN } from '../utils/layout.js';
import { bodyTop, bodyBottom, DEFAULT_FONT, renderHeader, renderFooter } from '../utils/parts.js';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DEFAULT_ROWS = 7;

export function renderWeeklyGrid(t: Template, width: number, height: number, attribution: boolean): string {
  const c = resolveColors(t.colors);
  const top = bodyTop();
  const bottom = bodyBottom(height);
  const tableWidth = width - MARGIN * 2;
  const labelWidth = 140;
  const dayCols = t.columns ?? DAYS;
  const dayColWidth = (tableWidth - labelWidth) / dayCols.length;

  const rows = t.rows && t.rows.length > 0
    ? t.rows
    : Array.from({ length: DEFAULT_ROWS }, () => ({ label: '' }));
  const rowHeight = (bottom - top - 32) / rows.length;

  const headerY = top;
  const cells: string[] = [];

  // Column header strip
  cells.push(
    rect(MARGIN, headerY, tableWidth, 28, { fill: c.accent, opacity: 0.18 }),
    text(MARGIN + labelWidth / 2, headerY + 19, 'Task', {
      'text-anchor': 'middle',
      'font-family': DEFAULT_FONT,
      'font-size': 12,
      'font-weight': 600,
      fill: c.header,
    }),
  );
  dayCols.forEach((day, i) => {
    cells.push(
      text(MARGIN + labelWidth + dayColWidth * (i + 0.5), headerY + 19, day, {
        'text-anchor': 'middle',
        'font-family': DEFAULT_FONT,
        'font-size': 12,
        'font-weight': 600,
        fill: c.header,
      }),
    );
  });

  // Rows
  rows.forEach((row, i) => {
    const y = headerY + 28 + rowHeight * i;
    const bg = i % 2 === 0 ? c.rowEven : c.rowOdd;
    cells.push(rect(MARGIN, y, tableWidth, rowHeight, { fill: bg }));

    // Row label
    if (row.label) {
      cells.push(
        text(MARGIN + 10, y + rowHeight / 2 + 4, row.label, {
          'font-family': DEFAULT_FONT,
          'font-size': 11,
          fill: c.border,
        }),
      );
    }

    // Checkboxes
    const boxSize = Math.min(rowHeight - 12, 18);
    dayCols.forEach((_d, di) => {
      const cx = MARGIN + labelWidth + dayColWidth * (di + 0.5);
      const cy = y + rowHeight / 2;
      cells.push(
        rect(cx - boxSize / 2, cy - boxSize / 2, boxSize, boxSize, {
          fill: 'white',
          stroke: c.border,
          'stroke-width': 1.2,
          rx: 3,
          ry: 3,
        }),
      );
    });
  });

  // Outer border + column lines
  cells.push(
    rect(MARGIN, headerY, tableWidth, 28 + rowHeight * rows.length, {
      fill: 'none',
      stroke: c.border,
      'stroke-width': 1,
      rx: 4,
      ry: 4,
    }),
  );
  for (let i = 1; i <= dayCols.length; i++) {
    const x = MARGIN + labelWidth + dayColWidth * (i - 1);
    cells.push(line(x, headerY, x, headerY + 28 + rowHeight * rows.length, { stroke: c.border, 'stroke-width': 0.5, opacity: 0.4 }));
  }
  cells.push(
    line(MARGIN + labelWidth, headerY, MARGIN + labelWidth, headerY + 28 + rowHeight * rows.length, {
      stroke: c.border,
      'stroke-width': 0.8,
    }),
  );

  return renderHeader(t, width) + cells.join('') + renderFooter(t, width, height, attribution);
}
