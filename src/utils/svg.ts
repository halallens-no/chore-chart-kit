/** Tiny SVG helpers — pure string concat, no DOM. */

const XML_ESCAPE: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};

export function escapeXml(input: string | number): string {
  return String(input).replace(/[&<>"']/g, (c) => XML_ESCAPE[c]!);
}

export function rect(
  x: number,
  y: number,
  w: number,
  h: number,
  attrs: Record<string, string | number | undefined> = {},
): string {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}"${attrsToString(attrs)}/>`;
}

export function line(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  attrs: Record<string, string | number | undefined> = {},
): string {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"${attrsToString(attrs)}/>`;
}

export function text(
  x: number,
  y: number,
  content: string,
  attrs: Record<string, string | number | undefined> = {},
): string {
  return `<text x="${x}" y="${y}"${attrsToString(attrs)}>${escapeXml(content)}</text>`;
}

export function group(content: string, attrs: Record<string, string | number | undefined> = {}): string {
  return `<g${attrsToString(attrs)}>${content}</g>`;
}

export function attrsToString(attrs: Record<string, string | number | undefined>): string {
  return Object.entries(attrs)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => ` ${k}="${escapeXml(String(v))}"`)
    .join('');
}

/** Open SVG root element with a viewBox. Caller must close with `</svg>`. */
export function svgRoot(width: number, height: number): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" ` +
    `viewBox="0 0 ${width} ${height}" ` +
    `width="${width}" height="${height}">`
  );
}
