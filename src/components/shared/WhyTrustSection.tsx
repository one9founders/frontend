export default function WhyTrustSection() {
  const trustCards = [
    {
      title: 'Security Validated',
      description: '10-point security check on every tool',
      emoji: '🔒',
    },
    {
      title: 'Zero Affiliate Bias',
      description: 'No commissions, no sponsored rankings',
      emoji: '🎯',
    },
    {
      title: 'Uniform Rating',
      description: 'Standardized evaluation framework',
      emoji: '⭐',
    },
    {
      title: 'IIT Bombay Backed',
      description: 'Supported by India\'s premier institution',
      emoji: '🏛️',
    },
  ];

  return (
    <section className="py-10 md:py-14 px-4 md:px-6 bg-[var(--gray-black)]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg md:text-xl font-bold text-white mb-6 text-center">Why founders trust One9Founders</h2>
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
