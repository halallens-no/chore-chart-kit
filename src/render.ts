import type { Template, RenderOptions } from './types.js';
import { resolvePage } from './utils/layout.js';
import { svgRoot } from './utils/svg.js';
import { renderWeeklyGrid } from './formats/weekly-grid.js';
import { renderDailyChecklist } from './formats/daily-checklist.js';
import { renderStarChart } from './formats/star-chart.js';
import { renderRewardTracker } from './formats/reward-tracker.js';
import { renderBlankTemplate } from './formats/blank-template.js';
import { renderMonthlyCalendar } from './formats/monthly-calendar.js';
import { renderRoutineSchedule } from './formats/routine-schedule.js';
import { renderMultiKid } from './formats/multi-kid.js';

/**
 * Render a chart template to a self-contained SVG string.
 *
 * @example
 * import { renderChart } from 'chore-chart-kit';
 * import template from './templates/chore-charts/dinosaur-weekly.json';
 * const svg = renderChart(template);
 * fs.writeFileSync('out.svg', svg);
 */
export function renderChart(template: Template, options: RenderOptions = {}): string {
  validateTemplate(template);
  const { width, height, attribution } = resolvePage(options);

  let body: string;
  switch (template.format) {
    case 'weekly-grid':
      body = renderWeeklyGrid(template, width, height, attribution);
      break;
    case 'daily-checklist':
      body = renderDailyChecklist(template, width, height, attribution);
      break;
    case 'star-chart':
      body = renderStarChart(template, width, height, attribution);
      break;
    case 'reward-tracker':
      body = renderRewardTracker(template, width, height, attribution);
      break;
    case 'blank-template':
      body = renderBlankTemplate(template, width, height, attribution);
      break;
    case 'monthly-calendar':
      body = renderMonthlyCalendar(template, width, height, attribution);
      break;
    case 'routine-schedule':
      body = renderRoutineSchedule(template, width, height, attribution);
      break;
    case 'multi-kid':
      body = renderMultiKid(template, width, height, attribution);
      break;
    default: {
      const _exhaustive: never = template.format;
      throw new Error(`Unsupported format: ${String(_exhaustive)}`);
    }
  }

  return svgRoot(width, height) + body + '</svg>';
}

const VALID_FORMATS = new Set([
  'weekly-grid', 'daily-checklist', 'star-chart', 'reward-tracker',
  'multi-kid', 'blank-template', 'monthly-calendar', 'routine-schedule',
]);

function validateTemplate(t: Template): void {
  if (!t.slug || typeof t.slug !== 'string') {
    throw new TypeError('template.slug is required');
  }
  if (!t.title || typeof t.title !== 'string') {
    throw new TypeError('template.title is required');
  }
  if (!t.format || !VALID_FORMATS.has(t.format)) {
    throw new TypeError(`template.format is invalid: ${String(t.format)}`);
  }
}
