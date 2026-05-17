/**
 * Public types for chore-chart-kit. Mirrors templates/schema.json.
 */

export type ChartFormat =
  | 'weekly-grid'
  | 'daily-checklist'
  | 'star-chart'
  | 'reward-tracker'
  | 'multi-kid'
  | 'blank-template'
  | 'monthly-calendar'
  | 'routine-schedule';

/**
 * Color palette keyed by role. Values are CSS color strings — hex, rgb(),
 * rgba(), or named colors. The renderer treats unknown keys as
 * decorative and ignores them.
 */
export interface ChartColors {
  readonly header?: string;
  readonly headerText?: string;
  readonly accent?: string;
  readonly rowEven?: string;
  readonly rowOdd?: string;
  readonly border?: string;
  readonly checkmark?: string;
  readonly [extra: string]: string | undefined;
}

export interface AgeRange {
  readonly min: number;
  readonly max: number;
}

export interface ChartRow {
  readonly label: string;
  readonly icon?: string;
}

export interface Template {
  readonly slug: string;
  readonly title: string;
  readonly format: ChartFormat;
  readonly version: string;
  readonly license: 'CC-BY-4.0';
  readonly theme?: string;
  readonly description?: string;
  readonly ageRange?: AgeRange;
  readonly colors?: ChartColors;
  readonly rows?: readonly ChartRow[];
  readonly columns?: readonly string[];
  readonly rewardText?: string;
  readonly starsRequired?: number;
  readonly previewImage?: string;
  readonly tags?: readonly string[];
}

export interface RenderOptions {
  /** Paper size in points. Defaults to US Letter portrait. */
  readonly pageWidth?: number;
  readonly pageHeight?: number;
  /** Show "Designed by Flinkis — printablechorechart.com" footer. */
  readonly attribution?: boolean;
}
