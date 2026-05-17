import type { Template } from '../types.js';
import { rect, text } from './svg.js';
import { resolveColors, HEADER_HEIGHT, FOOTER_HEIGHT, MARGIN } from './layout.js';

const DEFAULT_FONT = 'Helvetica, Arial, sans-serif';

/** Header band with the template title and optional subtitle. */
export function renderHeader(t: Template, width: number, subtitle?: string): string {
  const c = resolveColors(t.colors);
  const y = MARGIN;
  const w = width - MARGIN * 2;
  const titleY = y + 32;
  const subY = y + 56;
  return (
    rect(MARGIN, y, w, HEADER_HEIGHT, { fill: c.header, rx: 8, ry: 8 }) +
    text(width / 2, titleY, t.title, {
      'text-anchor': 'middle',
      'font-family': DEFAULT_FONT,
      'font-size': 24,
      'font-weight': 700,
      fill: c.headerText,
    }) +
    (subtitle
      ? text(width / 2, subY, subtitle, {
          'text-anchor': 'middle',
          'font-family': DEFAULT_FONT,
          'font-size': 12,
          fill: c.headerText,
          opacity: 0.85,
        })
      : '')
  );
}

/** Required CC-BY attribution footer. */
export function renderFooter(t: Template, width: number, height: number, show: boolean): string {
  if (!show) return '';
  const c = resolveColors(t.colors);
  const y = height - MARGIN - FOOTER_HEIGHT;
  const credit = 'Chart template by Flinkis — printablechorechart.com  •  CC-BY-4.0';
  return text(width / 2, y + FOOTER_HEIGHT - 8, credit, {
    'text-anchor': 'middle',
    'font-family': DEFAULT_FONT,
    'font-size': 9,
    fill: c.border,
    opacity: 0.7,
  });
}

/** Y-coordinate where the body content starts (below header). */
export function bodyTop(): number {
  return MARGIN + HEADER_HEIGHT + 12;
}

/** Y-coordinate where the body content ends (above footer). */
export function bodyBottom(height: number): number {
  return height - MARGIN - FOOTER_HEIGHT - 12;
}

export { DEFAULT_FONT };
