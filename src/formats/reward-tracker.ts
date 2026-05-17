import type { Template } from '../types.js';
import { rect, text, attrsToString } from '../utils/svg.js';
import { resolveColors, MARGIN } from '../utils/layout.js';
import { bodyTop, bodyBottom, DEFAULT_FONT, renderHeader, renderFooter } from '../utils/parts.js';

const STAR_PATH = 'M 0 -10 L 3 -3.2 L 10 -3.1 L 4.5 1.7 L 6.5 8.5 L 0 5 L -6.5 8.5 L -4.5 1.7 L -10 -3.1 L -3 -3.2 Z';

function star(cx: number, cy: number, fill: string, stroke: string): string {
  return `<path transform="translate(${cx},${cy})" d="${STAR_PATH}"${attrsToString({ fill, stroke, 'stroke-width': 1.2 })}/>`;
}

export function renderRewardTracker(t: Template, width: number, height: number, attribution: boolean): string {
  const c = resolveColors(t.colors);
  const top = bodyTop();
  const bottom = bodyBottom(height);
  const tableWidth = width - MARGIN * 2;
  const slots = t.starsRequired ?? 20;

  const cells: string[] = [];

  // Goal banner
  const goal = t.rewardText ?? 'My Reward Is: ____________________';
  cells.push(
    rect(MARGIN, top, tableWidth, 60, { fill: c.accent, opacity: 0.18, rx: 8, ry: 8 }),
    text(width / 2, top + 27, 'My Goal', {
      'text-anchor': 'middle',
      'font-family': DEFAULT_FONT,
      'font-size': 11,
      'font-weight': 600,
      fill: c.header,
      'letter-spacing': 2,
    }),
    text(width / 2, top + 48, goal, {
      'text-anchor': 'middle',
      'font-family': DEFAULT_FONT,
      'font-size': 15,
      'font-weight': 600,
      fill: c.border,
    }),
  );

  // Star grid — auto-fit columns
  const gridTop = top + 80;
  const gridHeight = bottom - gridTop - 30;
  const cols = Math.min(10, slots);
  const rows = Math.ceil(slots / cols);
  const colWidth = tableWidth / cols;
  const rowHeight = gridHeight / rows;
  const cellSize = Math.min(colWidth, rowHeight) * 0.7;

  for (let s = 0; s < slots; s++) {
    const ri = Math.floor(s / cols);
    const ci = s % cols;
    const cx = MARGIN + colWidth * (ci + 0.5);
    const cy = gridTop + rowHeight * (ri + 0.5);
    cells.push(
      rect(cx - cellSize / 2, cy - cellSize / 2, cellSize, cellSize, {
        fill: 'white',
        stroke: c.border,
        'stroke-width': 1.2,
        rx: 6,
        ry: 6,
      }),
      star(cx, cy, 'none', c.checkmark),
      text(cx, cy + cellSize / 2 + 12, String(s + 1), {
        'text-anchor': 'middle',
        'font-family': DEFAULT_FONT,
        'font-size': 9,
        fill: c.border,
        opacity: 0.6,
      }),
    );
  }

  return renderHeader(t, width, 'Reward Tracker') + cells.join('') + renderFooter(t, width, height, attribution);
}
