import { Tool } from '@/types';

interface ToolQASectionProps {
  tool: Tool;
}

interface QAPair {
  question: string;
  answer: string;
}

/** Extract human-readable feature descriptions from raw "Name:: Description" strings. */
function parseFeatures(features: string[]): { name: string; desc: string }[] {
  return features.map(f => {
    const sepIdx = f.indexOf('::');
    if (sepIdx > 0) {
      return {
        name: f.substring(0, sepIdx).trim(),
        desc: f.substring(sepIdx + 2).trim().replace(/\.$/, ''),
      };
    }
    return { name: f.trim(), desc: '' };
  });
}

function generateQAPairs(tool: Tool): QAPair[] {
  const category = tool.categories?.[0]?.name || 'AI';
  const pricingLabel = tool.pricing_models?.includes('Free')
    ? 'free to use'
    : tool.pricing_models?.includes('Freemium')
      ? 'freemium with a free tier'
      : 'a paid tool';
  const alternatives = tool.alternatives?.slice(0, 3).map(a => a.name).join(', ');
  const parsed = parseFeatures(tool.features ?? []);

  // Pricing Q&A — specific numbers, not filler
  const priceIndia = tool.pricing_inr != null && tool.pricing_inr > 0
    ? `starts at ₹${tool.pricing_inr.toLocaleString('en-IN')}/month${tool.gst_applicable ? ' (plus 18% GST)' : ''}`
    : tool.pricing_from != null && tool.pricing_from > 0
      ? `starts at $${tool.pricing_from}/month (approximately ₹${Math.round(tool.pricing_from * 83.5).toLocaleString('en-IN')}/month)`
      : `is ${pricingLabel}`;

  const pricingAnswer = [
    `${tool.name} ${priceIndia}.`,
    tool.pricing_has_india_plan ? `India-specific pricing plans are available.` : '',
    tool.free_tier_available ? `A free tier is available to get started.` : '',
  ].filter(Boolean).join(' ');

  // Security Q&A — concrete details
  const securityAnswer = tool.security_score != null
    ? `${tool.name} scored ${tool.security_score}/100 on our 10-point security framework${tool.security_assessed_at ? ` (last assessed ${new Date(tool.security_assessed_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })})` : ''}. ${tool.startup_friendly ? 'It is rated startup-friendly with favorable terms for early-stage companies.' : 'Review the full security report on One9Founders before adopting it for sensitive data.'}`
    : `${tool.name} has not yet been assessed on our security framework. We recommend checking its own security documentation and certifications (SOC 2, GDPR compliance, etc.) before using it for sensitive startup data.`;

  // What-does-it-do Q&A — use actual description + parsed features
  const descBase = tool.short_description || tool.description?.substring(0, 200) || `${tool.name} is a ${category.toLowerCase()} tool`;
  const featureBullets = parsed.slice(0, 3).map(f => f.desc ? `${f.name} — ${f.desc}` : f.name);
  const whatAnswer = [
    `${descBase}${descBase.endsWith('.') ? '' : '.'}`,
    featureBullets.length > 0 ? `Key capabilities: ${featureBullets.join('; ')}.` : '',
    tool.use_cases?.length ? `Commonly used for ${tool.use_cases.slice(0, 3).join(', ')}.` : '',
  ].filter(Boolean).join(' ');

  const pairs: QAPair[] = [
    {
      question: `What is ${tool.name} and what does it do?`,
      answer: whatAnswer,
    },
    {
      question: `What does ${tool.name} cost in India?`,
      answer: pricingAnswer,
    },
    {
      question: `Is ${tool.name} safe for startups?`,
      answer: securityAnswer,
    },
  ];

  if (alternatives) {
    pairs.push({
      question: `What are the best alternatives to ${tool.name}?`,
      answer: `Top alternatives include ${alternatives}. Compare features, pricing, and security scores side-by-side on One9Founders to find the best fit.`,
    });
  }

  const topAlternative = tool.alternatives?.[0];
  if (topAlternative) {
    pairs.push({
      question: `How does ${tool.name} compare to ${topAlternative.name}?`,
      answer: `Both are ${category.toLowerCase()} tools. ${tool.name} ${tool.rating > (topAlternative.rating || 0) ? `is rated higher (${tool.rating}/5)` : 'is competitively rated'} on One9Founders. See our head-to-head comparison for a detailed breakdown of features, pricing, and security.`,
    });
  }

  return pairs;
}

export default function ToolQASection({ tool }: ToolQASectionProps) {
  const qaPairs = generateQAPairs(tool);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-white mb-4">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {qaPairs.map((qa, index) => (
          <div key={index} className="bg-[var(--gray-800)] rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">{qa.question}</h3>
            <p className="text-[var(--gray-300)] text-sm leading-relaxed">{qa.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export { generateQAPairs };
export type { QAPair };
