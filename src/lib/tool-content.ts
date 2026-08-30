import { Tool } from '../types';

export const MIN_DESCRIPTION_WORDS = 40;

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

export function hasSubstantiveContent(tool: Tool): boolean {
  const wordCount = descriptionWordCount(tool.description);
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
