import type { Template } from '../types.js';
import { rect, text } from '../utils/svg.js';
import { attrsToString } from '../utils/svg.js';
import { resolveColors, MARGIN } from '../utils/layout.js';
import { bodyTop, bodyBottom, DEFAULT_FONT, renderHeader, renderFooter } from '../utils/parts.js';

const STAR_PATH = 'M 0 -8 L 2.4 -2.6 L 8 -2.5 L 3.6 1.4 L 5.2 6.8 L 0 4 L -5.2 6.8 L -3.6 1.4 L -8 -2.5 L -2.4 -2.6 Z';
const DEFAULT_ROWS = 5;
const STARS_PER_ROW = 10;

function star(cx: number, cy: number, fill: string, stroke: string): string {
  return `<path transform="translate(${cx},${cy})" d="${STAR_PATH}"${attrsToString({ fill, stroke, 'stroke-width': 1 })}/>`;
}

export function renderStarChart(t: Template, width: number, height: number, attribution: boolean): string {
  const c = resolveColors(t.colors);
  const top = bodyTop();
  const bottom = bodyBottom(height);
  const tableWidth = width - MARGIN * 2;
  const labelWidth = 150;
  const starsRequired = t.starsRequired ?? STARS_PER_ROW;

  const rows = t.rows && t.rows.length > 0
    ? t.rows
    : Array.from({ length: DEFAULT_ROWS }, () => ({ label: '' }));
  const rowHeight = (bottom - top - 60) / rows.length;
  const starColWidth = (tableWidth - labelWidth) / starsRequired;

  const cells: string[] = [];

  // Reward banner
  const rewardText = t.rewardText ?? `Earn ${starsRequired} stars to unlock your reward!`;
  cells.push(
    rect(MARGIN, top, tableWidth, 32, { fill: c.accent, opacity: 0.18, rx: 4, ry: 4 }),
    text(width / 2, top + 21, rewardText, {
      'text-anchor': 'middle',
      'font-family': DEFAULT_FONT,
      'font-size': 12,
      'font-weight': 600,
      fill: c.header,
    }),
  );

  // Rows
  rows.forEach((row, i) => {
    const y = top + 40 + rowHeight * i;
    const bg = i % 2 === 0 ? c.rowEven : c.rowOdd;
    cells.push(rect(MARGIN, y, tableWidth, rowHeight, { fill: bg }));

    if (row.label) {
      cells.push(
        text(MARGIN + 12, y + rowHeight / 2 + 5, row.label, {
          'font-family': DEFAULT_FONT,
          'font-size': 11,
          fill: c.border,
        }),
      );
    }

    for (let s = 0; s < starsRequired; s++) {
      const cx = MARGIN + labelWidth + starColWidth * (s + 0.5);
      const cy = y + rowHeight / 2;
      cells.push(star(cx, cy, 'none', c.checkmark));
    }
  });

  cells.push(
    rect(MARGIN, top + 40, tableWidth, rowHeight * rows.length, {
      fill: 'none',
      stroke: c.border,
      'stroke-width': 1,
      rx: 4,
      ry: 4,
    }),
  );

  return renderHeader(t, width, 'Star Chart') + cells.join('') + renderFooter(t, width, height, attribution);
}
