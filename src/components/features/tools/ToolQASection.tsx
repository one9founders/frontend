import { Tool } from '@/types';

interface ToolQASectionProps {
  tool: Tool;
}

interface QAPair {
  question: string;
  answer: string;
}

function generateQAPairs(tool: Tool): QAPair[] {
  const category = tool.categories?.[0]?.name || 'AI';
  const pricingLabel = tool.pricing_models?.includes('Free')
    ? 'free to use'
    : tool.pricing_models?.includes('Freemium')
      ? 'freemium with a free tier'
      : 'a paid tool';
  const securityText = tool.security_score != null
    ? `scored ${tool.security_score}/100 on our security framework`
    : 'currently undergoing our security assessment';
  const alternatives = tool.alternatives?.slice(0, 3).map(a => a.name).join(', ');

  const priceIndia = tool.pricing_inr != null
    ? `starts at ₹${tool.pricing_inr.toLocaleString('en-IN')}/month${tool.gst_applicable ? ' (plus 18% GST)' : ''}`
    : tool.pricing_from != null
      ? `starts at $${tool.pricing_from}/month (approximately ₹${Math.round(tool.pricing_from * 83.5).toLocaleString('en-IN')}/month)`
      : `is ${pricingLabel}`;

  const pairs: QAPair[] = [
    {
      question: `What does ${tool.name} cost in India?`,
      answer: `${tool.name} ${priceIndia}. ${tool.pricing_has_india_plan ? `${tool.name} offers India-specific pricing plans optimized for Indian startups.` : `Pricing is in USD and converted to INR at current exchange rates.`}${tool.free_tier_available ? ` A free tier is available to get started.` : ''}`,
    },
    {
      question: `Is ${tool.name} safe for startups?`,
      answer: `${tool.name} has ${securityText}. ${tool.startup_friendly ? `It is rated as startup-friendly by One9Founders, meaning it offers favorable terms for early-stage companies.` : `We recommend reviewing its security documentation before adopting it for sensitive data.`}`,
    },
    {
      question: `Is ${tool.name} suitable for Indian startups?`,
      answer: `${tool.name} is a ${category.toLowerCase()} tool ${tool.startup_friendly ? 'well-suited' : 'available'} for Indian startups. ${tool.pricing_has_india_plan ? 'It offers India-specific pricing.' : 'Pricing is available in INR through One9Founders.'} ${tool.use_cases?.length ? `Common use cases include ${tool.use_cases.slice(0, 2).join(' and ')}.` : ''}`,
    },
  ];

  if (alternatives) {
    pairs.push({
      question: `What are the best alternatives to ${tool.name}?`,
      answer: `Top alternatives to ${tool.name} include ${alternatives}. Each offers similar ${category.toLowerCase()} capabilities with different pricing and feature sets. Compare them on One9Founders to find the best fit for your startup.`,
    });
  }

  const topAlternative = tool.alternatives?.[0];
  if (topAlternative) {
    pairs.push({
      question: `How does ${tool.name} compare to ${topAlternative.name}?`,
      answer: `${tool.name} and ${topAlternative.name} are both ${category.toLowerCase()} tools. ${tool.name} ${tool.rating > (topAlternative.rating || 0) ? 'has a higher rating' : 'is competitively rated'} on One9Founders. Compare features, pricing, and security scores side-by-side on our comparison page.`,
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
