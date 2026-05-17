import type { Template } from '../types.js';
import { line, rect, text } from '../utils/svg.js';
import { resolveColors, MARGIN } from '../utils/layout.js';
import { bodyTop, bodyBottom, DEFAULT_FONT, renderHeader, renderFooter } from '../utils/parts.js';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DEFAULT_ROWS = 8;

export function renderBlankTemplate(t: Template, width: number, height: number, attribution: boolean): string {
  const c = resolveColors(t.colors);
  const top = bodyTop();
  const bottom = bodyBottom(height);
  const tableWidth = width - MARGIN * 2;
  const labelWidth = 160;
  const dayCols = t.columns ?? DAYS;
  const colWidth = (tableWidth - labelWidth) / dayCols.length;

  const numRows = t.rows?.length || DEFAULT_ROWS;
  const rowHeight = (bottom - top - 32) / numRows;

  const cells: string[] = [];

  // Column header
  cells.push(
    rect(MARGIN, top, tableWidth, 28, { fill: c.header, opacity: 0.85, rx: 4, ry: 4 }),
    text(MARGIN + labelWidth / 2, top + 19, 'Chore', {
      'text-anchor': 'middle',
      'font-family': DEFAULT_FONT,
      'font-size': 12,
      'font-weight': 700,
      fill: c.headerText,
    }),
  );
  dayCols.forEach((day, i) => {
    cells.push(
      text(MARGIN + labelWidth + colWidth * (i + 0.5), top + 19, day, {
        'text-anchor': 'middle',
        'font-family': DEFAULT_FONT,
        'font-size': 12,
        'font-weight': 700,
        fill: c.headerText,
      }),
    );
  });

  // Blank rows with write-in lines
  for (let i = 0; i < numRows; i++) {
    const y = top + 28 + rowHeight * i;
    const bg = i % 2 === 0 ? c.rowEven : c.rowOdd;
    cells.push(rect(MARGIN, y, tableWidth, rowHeight, { fill: bg }));
    // Write-in line in label column
    cells.push(
      line(MARGIN + 12, y + rowHeight - 8, MARGIN + labelWidth - 12, y + rowHeight - 8, {
        stroke: c.border,
        'stroke-width': 0.8,
        opacity: 0.4,
      }),
    );
    // Checkbox cells
    const boxSize = Math.min(rowHeight - 14, 18);
    dayCols.forEach((_d, di) => {
      const cx = MARGIN + labelWidth + colWidth * (di + 0.5);
      const cy = y + rowHeight / 2;
      cells.push(
        rect(cx - boxSize / 2, cy - boxSize / 2, boxSize, boxSize, {
          fill: 'white',
          stroke: c.border,
          'stroke-width': 1,
          rx: 3,
          ry: 3,
        }),
      );
    });
  }

  cells.push(
    rect(MARGIN, top, tableWidth, 28 + rowHeight * numRows, {
      fill: 'none',
      stroke: c.border,
      'stroke-width': 1,
      rx: 4,
      ry: 4,
    }),
    line(MARGIN + labelWidth, top, MARGIN + labelWidth, top + 28 + rowHeight * numRows, {
      stroke: c.border,
      'stroke-width': 0.8,
    }),
  );

  return renderHeader(t, width, 'Write Your Own Chores') + cells.join('') + renderFooter(t, width, height, attribution);
}
