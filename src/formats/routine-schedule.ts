import type { Template } from '../types.js';
import { rect, text, line } from '../utils/svg.js';
import { resolveColors, MARGIN } from '../utils/layout.js';
import { bodyTop, bodyBottom, DEFAULT_FONT, renderHeader, renderFooter } from '../utils/parts.js';

const DEFAULT_TIMES = [
  '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
  '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM',
];

export function renderRoutineSchedule(t: Template, width: number, height: number, attribution: boolean): string {
  const c = resolveColors(t.colors);
  const top = bodyTop();
  const bottom = bodyBottom(height);
  const tableWidth = width - MARGIN * 2;
  const timeColWidth = 80;

  const times = t.columns ?? DEFAULT_TIMES;
  const rowHeight = (bottom - top - 32) / times.length;

  const cells: string[] = [];

  // Column header
  cells.push(
    rect(MARGIN, top, tableWidth, 28, { fill: c.header, opacity: 0.85, rx: 4, ry: 4 }),
    text(MARGIN + timeColWidth / 2, top + 19, 'Time', {
      'text-anchor': 'middle',
      'font-family': DEFAULT_FONT,
      'font-size': 12,
      'font-weight': 700,
      fill: c.headerText,
    }),
    text(MARGIN + timeColWidth + (tableWidth - timeColWidth) / 2, top + 19, 'Activity', {
      'text-anchor': 'middle',
      'font-family': DEFAULT_FONT,
      'font-size': 12,
      'font-weight': 700,
      fill: c.headerText,
    }),
  );

  // Time-slot rows
  times.forEach((time, i) => {
    const y = top + 28 + rowHeight * i;
    const bg = i % 2 === 0 ? c.rowEven : c.rowOdd;
    cells.push(
      rect(MARGIN, y, tableWidth, rowHeight, { fill: bg }),
      // Time label
      text(MARGIN + timeColWidth / 2, y + rowHeight / 2 + 4, time, {
        'text-anchor': 'middle',
        'font-family': DEFAULT_FONT,
        'font-size': 11,
        'font-weight': 600,
        fill: c.border,
      }),
      // Write-in line
      line(
        MARGIN + timeColWidth + 16,
        y + rowHeight - 8,
        MARGIN + tableWidth - 16,
        y + rowHeight - 8,
        { stroke: c.border, 'stroke-width': 0.6, opacity: 0.35 },
      ),
    );
  });

  cells.push(
    rect(MARGIN, top, tableWidth, 28 + rowHeight * times.length, {
      fill: 'none',
      stroke: c.border,
      'stroke-width': 1,
      rx: 4,
      ry: 4,
    }),
    line(MARGIN + timeColWidth, top, MARGIN + timeColWidth, top + 28 + rowHeight * times.length, {
      stroke: c.border,
      'stroke-width': 0.8,
    }),
  );

  return renderHeader(t, width, 'Daily Routine') + cells.join('') + renderFooter(t, width, height, attribution);
}
