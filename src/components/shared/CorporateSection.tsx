"use client";

const SERVICES = [
  {
    title: "AI Consulting",
    description: "Find the right AI tools for your enterprise workflows",
    icon: "💼",
  },
  {
    title: "AI Automation",
    description: "Implement AI-powered automation for your business processes",
    icon: "⚡",
  },
  {
    title: "AI Training",
    description: "Upskill your team with structured AI workshops",
    icon: "🎓",
  },
  {
    title: "Startup Listing",
    description: "Get your AI startup listed and discovered",
    icon: "📋",
  },
];

export default function CorporateSection() {
  return (
    <section id="corporate-section" className="py-10 md:py-14 px-4 md:px-6 bg-[var(--gray-900)]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          AI solutions for your business
        </h2>
        <p className="text-sm md:text-base text-[var(--gray-400)] mb-8">
          From tool discovery to automation implementation
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="bg-[var(--gray-800)] border border-[var(--gray-700)] rounded-xl p-5 text-left hover:border-purple-500/50 transition-colors"
            >
              <span className="text-2xl mb-3 block">{service.icon}</span>
              <h3 className="text-sm font-semibold text-white mb-1">
                {service.title}
              </h3>
              <p className="text-xs text-[var(--gray-400)] leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <a
          href="mailto:hello@one9founders.com"
          className="btn-primary inline-flex px-6 py-3"
        >
          Talk to Us
        </a>
      </div>
    </section>
  );
}
