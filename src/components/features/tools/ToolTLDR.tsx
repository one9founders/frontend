import { Tool } from '@/types';

interface ToolTLDRProps {
  tool: Tool;
}

/** Extract human-readable feature names from raw "Name:: Description" strings. */
function parseFeatureNames(features: string[]): string[] {
  return features.map(f => {
    const sepIdx = f.indexOf('::');
    // Take the name part before "::", or the whole string if no separator
    const name = sepIdx > 0 ? f.substring(0, sepIdx).trim() : f.trim();
    // Strip trailing periods/colons and lowercase it
    return name.replace(/[.:]+$/, '').toLowerCase();
  });
}

export default function ToolTLDR({ tool }: ToolTLDRProps) {
  const category = tool.categories?.[0]?.name || 'AI';
  const pricingLabel = tool.pricing_models?.includes('Free')
    ? 'free'
    : tool.pricing_models?.includes('Freemium')
      ? 'freemium'
      : 'paid';

  // Build price snippet
  const priceSnippet = tool.pricing_inr != null
    ? `from ₹${tool.pricing_inr.toLocaleString('en-IN')}/mo`
    : tool.pricing_from != null
      ? `from $${tool.pricing_from}/mo`
      : '';

  // Build feature snippet from cleaned feature names
  const featureNames = parseFeatureNames(tool.features ?? []);
  const featureSnippet = featureNames.length >= 2
    ? `Key strengths include ${featureNames.slice(0, 3).join(', ')}.`
    : featureNames.length === 1
      ? `Known for ${featureNames[0]}.`
      : '';

  // Security snippet
  const securitySnippet = tool.security_score != null
    ? `Scores ${tool.security_score}/100 on our security framework.`
    : '';

  // Use the tool's own description as the base when available
  const descSnippet = tool.short_description || tool.description?.substring(0, 160) || '';

  // Compose summary: lead with what the tool does, then pricing + features
  const parts = [
    descSnippet ? `${descSnippet}${descSnippet.endsWith('.') ? '' : '.'}` : `${tool.name} is a ${pricingLabel} ${category.toLowerCase()} tool.`,
    priceSnippet ? `Pricing starts ${priceSnippet}${tool.free_tier_available ? ' with a free tier available' : ''}.` : '',
    featureSnippet,
    securitySnippet,
  ].filter(Boolean);

  const summary = parts.join(' ');

  return (
    <div className="mt-8 bg-[var(--gray-800)] border-l-4 border-purple-500 rounded-r-lg p-5">
      <h2 className="text-lg font-semibold text-white mb-2">TL;DR — {tool.name}</h2>
      <p className="text-[var(--gray-300)] text-sm leading-relaxed">{summary}</p>
    </div>
  );
}
