import type { Template } from '../types.js';
import { line, rect, text } from '../utils/svg.js';
import { resolveColors, MARGIN } from '../utils/layout.js';
import { bodyTop, bodyBottom, DEFAULT_FONT, renderHeader, renderFooter } from '../utils/parts.js';

const DEFAULT_TIMES = [
  'Morning',
  'After Breakfast',
  'Late Morning',
  'Lunch',
  'Afternoon',
  'After School',
  'Before Dinner',
  'Evening',
  'Before Bed',
];

export function renderDailyChecklist(t: Template, width: number, height: number, attribution: boolean): string {
  const c = resolveColors(t.colors);
  const top = bodyTop();
  const bottom = bodyBottom(height);
  const tableWidth = width - MARGIN * 2;

  const rowLabels = t.rows && t.rows.length > 0
    ? t.rows.map((r) => r.label)
    : DEFAULT_TIMES;
  const rowHeight = (bottom - top - 40) / rowLabels.length;

  // Date strip
  const cells: string[] = [];
  cells.push(
    rect(MARGIN, top, tableWidth, 32, { fill: c.accent, opacity: 0.2, rx: 4, ry: 4 }),
    text(MARGIN + 16, top + 22, 'Date:', {
      'font-family': DEFAULT_FONT,
      'font-size': 13,
      'font-weight': 600,
      fill: c.header,
    }),
    line(MARGIN + 60, top + 22, MARGIN + tableWidth - 16, top + 22, {
      stroke: c.border,
      'stroke-width': 1,
    }),
  );

  rowLabels.forEach((label, i) => {
    const y = top + 40 + rowHeight * i;
    const bg = i % 2 === 0 ? c.rowEven : c.rowOdd;
    cells.push(rect(MARGIN, y, tableWidth, rowHeight, { fill: bg }));

    // Checkbox
    const boxSize = 22;
    cells.push(
      rect(MARGIN + 14, y + rowHeight / 2 - boxSize / 2, boxSize, boxSize, {
        fill: 'white',
        stroke: c.border,
        'stroke-width': 1.5,
        rx: 4,
        ry: 4,
      }),
    );

    // Label
    cells.push(
      text(MARGIN + 50, y + rowHeight / 2 + 5, label, {
        'font-family': DEFAULT_FONT,
        'font-size': 13,
        'font-weight': 500,
        fill: c.border,
      }),
    );
  });

  // Outer border
  cells.push(
    rect(MARGIN, top + 40, tableWidth, rowHeight * rowLabels.length, {
      fill: 'none',
      stroke: c.border,
      'stroke-width': 1,
      rx: 4,
      ry: 4,
    }),
  );

  return renderHeader(t, width, 'Daily Checklist') + cells.join('') + renderFooter(t, width, height, attribution);
}
