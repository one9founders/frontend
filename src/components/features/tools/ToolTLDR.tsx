import { Tool } from '@/types';

interface ToolTLDRProps {
  tool: Tool;
}

export default function ToolTLDR({ tool }: ToolTLDRProps) {
  const category = tool.categories?.[0]?.name || 'AI';
  const pricingLabel = tool.pricing_models?.includes('Free')
    ? 'free'
    : tool.pricing_models?.includes('Freemium')
      ? 'freemium'
      : 'paid';
  const securityText = tool.security_score != null
    ? `security score of ${tool.security_score}/100`
    : 'security assessment pending';

  const priceText = tool.pricing_inr != null
    ? `Starting from ₹${tool.pricing_inr.toLocaleString('en-IN')}/mo`
    : tool.pricing_from != null
      ? `Starting from $${tool.pricing_from}/mo`
      : '';

  const summary = `${tool.name} is a ${pricingLabel} ${category.toLowerCase()} tool${tool.startup_friendly ? ' built for startups' : ''}. ${priceText ? priceText + '. ' : ''}It offers ${tool.features?.slice(0, 2).join(' and ') || 'powerful features'} with a ${securityText}. Published by One9Founders.`;

  return (
    <div className="mt-8 bg-[var(--gray-800)] border-l-4 border-purple-500 rounded-r-lg p-5">
      <h2 className="text-lg font-semibold text-white mb-2">TL;DR — {tool.name}</h2>
      <p className="text-[var(--gray-300)] text-sm leading-relaxed">{summary}</p>
    </div>
  );
}
