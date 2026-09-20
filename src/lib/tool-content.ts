import { Tool } from '../types';
import { RATING_MIN_PROVISIONAL } from './toolRating';

export const MIN_DESCRIPTION_WORDS = 40;
/** Lower bar for attributed catalogue rows (HN, etc.) that already have a source URL. */
export const MIN_CATALOGUE_DESCRIPTION_WORDS = 15;

export const JOB_CLUSTERS = [
  { value: 'performance-marketing', label: 'Performance Marketing', color: 'bg-rose-600' },
  { value: 'sales', label: 'Sales', color: 'bg-blue-600' },
  { value: 'support', label: 'Support', color: 'bg-green-600' },
  { value: 'product', label: 'Product', color: 'bg-orange-600' },
  { value: 'engineering', label: 'Engineering', color: 'bg-indigo-600' },
  { value: 'operations', label: 'Operations', color: 'bg-teal-600' },
] as const;

const PLACEHOLDER_VALUES = new Set(['n/a', 'coming soon']);

function descriptionWordCount(text: string | null | undefined): number {
  const trimmed = (text ?? '').trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function isNonPlaceholderString(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return !PLACEHOLDER_VALUES.has(trimmed.toLowerCase());
}

function hasPresentValue(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === 'number') return Number.isFinite(value);
  if (typeof value === 'string') return isNonPlaceholderString(value);
  if (Array.isArray(value)) return value.some((item) => hasPresentValue(item));
  return false;
}

function toolDescriptionText(tool: Tool): string {
  return [tool.description, tool.short_description].filter(Boolean).join(' ');
}

export function hasHackerNewsAttribution(tool: Tool): boolean {
  if (Array.isArray(tool.tags) && tool.tags.includes('hackernews')) return true;
  if (!Array.isArray(tool.sources)) return false;
  return tool.sources.some((row) => row.source === 'hackernews');
}

export function hasSubstantiveContent(tool: Tool): boolean {
  // Prefer full description; fall back to combined text when list payloads omit it.
  const primary = descriptionWordCount(tool.description);
  const wordCount =
    primary > 0 ? primary : descriptionWordCount(toolDescriptionText(tool));
  if (wordCount < MIN_DESCRIPTION_WORDS) return false;

  // Tool has no pros/cons fields; only pricing and use_cases exist on the type.
  const secondarySignal =
    hasPresentValue(tool.pricing_models) ||
    hasPresentValue(tool.pricing_type) ||
    hasPresentValue(tool.pricing_from) ||
    hasPresentValue(tool.pricing_tiers) ||
    hasPresentValue(tool.use_cases);

  return secondarySignal;
}

/** Provisional+ editorial assessment — mirrors backend RATING_MIN_PROVISIONAL. */
export function isToolAssessedForIndex(tool: Tool): boolean {
  if (tool.assessed === true) return true;
  const completed = Number(tool.criteria_completed ?? 0);
  return Number.isFinite(completed) && completed >= RATING_MIN_PROVISIONAL;
}

/**
 * Whether `/tool/{slug}` should be indexable for search / answer engines.
 * Keep aligned with backend `api.hygiene.indexability.indexable_queryset`
 * so the XML sitemap and page `robots` meta describe the same URL set.
 */
export function isToolIndexable(tool: Tool): boolean {
  if (isToolAssessedForIndex(tool)) return true;
  if (hasSubstantiveContent(tool)) return true;

  // HN-attributed catalogue rows: allow indexing with a shorter blurb when we
  // still have a public website or secondary product signal.
  if (!hasHackerNewsAttribution(tool)) return false;
  const words = descriptionWordCount(toolDescriptionText(tool));
  if (words < MIN_CATALOGUE_DESCRIPTION_WORDS) return false;
  return (
    hasPresentValue(tool.website) ||
    hasPresentValue(tool.pricing_models) ||
    hasPresentValue(tool.pricing_type) ||
    hasPresentValue(tool.use_cases)
  );
}
