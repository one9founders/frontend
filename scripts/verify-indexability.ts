/**
 * Lightweight sanity checks for sitemap/robots indexability alignment.
 * Run: npx tsx scripts/verify-indexability.ts
 */
import {
  hasSubstantiveContent,
  isToolAssessedForIndex,
  isToolIndexable,
} from '../src/lib/tool-content';
import type { Tool } from '../src/types';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const thin: Tool = {
  id: 1,
  name: 'Thin',
  slug: 'thin',
  short_description: 'Short',
  description: 'Short.',
  categories: [],
  pricing_models: [],
  use_cases: [],
  pricing_type: '',
  criteria_completed: 0,
  website: '',
  tags: [],
} as Tool;

const assessedShort: Tool = {
  ...thin,
  name: 'Assessed Short',
  slug: 'assessed-short',
  criteria_completed: 6,
  overall_score: 3.5,
} as Tool;

const substantive: Tool = {
  ...thin,
  name: 'Substantive',
  slug: 'substantive',
  description:
    'A substantive product description with enough words for founders evaluating AI tools across pricing, security, and workflow fit in early stage startups today. It covers onboarding, integrations, compliance posture, and how teams decide between free tiers and paid plans with clear evidence.',
  pricing_models: ['paid'],
  use_cases: ['Coding'],
} as Tool;

assert(!isToolIndexable(thin), 'thin stub must be noindex');
assert(isToolAssessedForIndex(assessedShort), 'criteria_completed >= 6 counts as assessed');
assert(isToolIndexable(assessedShort), 'assessed short must be indexable (sitemap alignment)');
assert(hasSubstantiveContent(substantive), 'substantive content gate');
assert(isToolIndexable(substantive), 'substantive must be indexable');

console.log('verify-indexability: ok');
