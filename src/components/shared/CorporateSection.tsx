'use client';

const SERVICES = [
  {
    title: 'AI Consulting',
    description: 'Find the right AI tools for your enterprise workflows',
    emoji: '💡',
  },
  {
    title: 'AI Automation',
    description: 'Implement AI-powered automation for your business processes',
    emoji: '⚙️',
  },
  {
    title: 'AI Training',
    description: 'Upskill your team with structured AI workshops',
    emoji: '🎓',
  },
  {
    title: 'Startup Listing',
    description: 'Get your AI startup listed and discovered',
    emoji: '📋',
  },
];

export default function CorporateSection() {
  return (
    <section id="corporate-section" className="py-10 md:py-14 px-4 md:px-6 bg-[var(--gray-black)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">AI solutions for your business</h2>
          <p className="text-sm text-[var(--gray-400)]">From tool discovery to automation implementation</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="p-5 rounded-xl bg-[var(--gray-900)] border border-[var(--gray-800)] hover:border-[var(--gray-700)] transition-colors"
            >
              <span className="text-2xl mb-3 block">{service.emoji}</span>
              <h3 className="text-sm font-semibold text-white mb-1">{service.title}</h3>
              <p className="text-xs text-[var(--gray-400)] leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="mailto:hello@one9founders.com"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg font-semibold text-sm text-white btn-primary"
          >
            Talk to Us
          </a>
        </div>
      </div>
    </section>
  );
}
