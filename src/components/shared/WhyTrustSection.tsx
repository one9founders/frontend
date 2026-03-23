import { STATS } from '@/lib/constants/stats';

export default function WhyTrustSection() {
  const trustCards = [
    {
      title: 'Security Validated',
      description: 'Every tool undergoes our 10-point security assessment. We check data handling, encryption standards, compliance certifications, and third-party sharing practices.',
      emoji: '🔒',
    },
    {
      title: 'Zero Affiliate Bias',
      description: 'We don\'t take affiliate commissions. Rankings are based purely on our evaluation criteria, never on who pays more.',
      emoji: '🎯',
    },
    {
      title: 'Uniform Ratings',
      description: `All ${STATS.totalResources} tools evaluated using identical methodology. Apples-to-apples comparisons you can actually trust. No favorites, no shortcuts.`,
      emoji: '⭐',
    },
    {
      title: 'Supported by IIT Bombay',
      description: 'Supported by IIT Bombay with academic mentorship from the Desai Sethi School of Entrepreneurship. Research-grade rigor applied to every evaluation.',
      emoji: '🏛️',
    },
  ];

  return (
    <section className="py-10 md:py-14 px-4 md:px-6 bg-[var(--gray-black)]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg md:text-xl font-bold text-white mb-6 text-center">Why 5,000+ founders trust One9Founders</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {trustCards.map((card) => (
            <div
              key={card.title}
              className="p-4 rounded-xl bg-[var(--gray-900)] border border-[var(--gray-800)] text-center"
            >
              <span className="text-xl mb-2 block">{card.emoji}</span>
              <h3 className="text-xs md:text-sm font-semibold text-white mb-1">{card.title}</h3>
              <p className="text-[10px] md:text-xs text-[var(--gray-400)]">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
