import type { ChartColors, RenderOptions } from '../types.js';

/** US Letter portrait at 72dpi: 8.5" × 11" = 612pt × 792pt. */
export const US_LETTER = { width: 612, height: 792 } as const;
export const MARGIN = 36;        // half inch
export const HEADER_HEIGHT = 72;
export const FOOTER_HEIGHT = 28;

export const DEFAULT_COLORS: Required<Pick<ChartColors,
  'header' | 'headerText' | 'accent' | 'rowEven' | 'rowOdd' | 'border' | 'checkmark'
>> = {
  header: '#2D5BBA',
  headerText: '#FFFFFF',
  accent: '#FFB400',
  rowEven: '#F4F6FB',
  rowOdd: '#FFFFFF',
  border: '#1F3F8B',
  checkmark: '#2D5BBA',
};

/** Resolve render options to concrete page dimensions. */
export function resolvePage(opts: RenderOptions): { width: number; height: number; attribution: boolean } {
  return {
    width: opts.pageWidth ?? US_LETTER.width,
    height: opts.pageHeight ?? US_LETTER.height,
    attribution: opts.attribution ?? true,
  };
}

/** Merge template colors with defaults — never returns undefined values. */
export function resolveColors(input: ChartColors | undefined): typeof DEFAULT_COLORS {
  return {
    header: input?.header ?? DEFAULT_COLORS.header,
    headerText: input?.headerText ?? DEFAULT_COLORS.headerText,
    accent: input?.accent ?? DEFAULT_COLORS.accent,
    rowEven: input?.rowEven ?? DEFAULT_COLORS.rowEven,
    rowOdd: input?.rowOdd ?? DEFAULT_COLORS.rowOdd,
    border: input?.border ?? DEFAULT_COLORS.border,
    checkmark: input?.checkmark ?? DEFAULT_COLORS.checkmark,
  };
}
