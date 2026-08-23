'use client';

import Link from 'next/link';

const SERVICES = [
  {
    title: 'AI Consulting',
    description: 'Find the right tools for your workflows',
  },
  {
    title: 'AI Automation',
    description: 'Implement AI-powered processes',
  },
  {
    title: 'AI Training',
    description: 'Structured workshops for teams',
    href: '/learn/organizations',
  },
  {
    title: 'Startup Listing',
    description: 'Get your AI product discovered',
  },
];

export default function CorporateSection() {
  return (
    <section id="corporate-section" className="py-10 md:py-12 px-4 md:px-6 bg-[var(--ink)] border-t border-[var(--line)]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <div className="max-w-sm">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--copper)] mb-2">
            For colleges and companies
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-[var(--paper)]">
            Training, listing, and implementation
          </h2>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
          {SERVICES.map((service) => (
            <div key={service.title}>
              {'href' in service && service.href ? (
                <Link href={service.href} className="text-[var(--paper)] hover:text-[var(--copper)]">
                  {service.title}
                </Link>
              ) : (
                <p className="text-[var(--paper)]">{service.title}</p>
              )}
              <p className="text-xs text-[var(--gray-500)] mt-0.5">{service.description}</p>
            </div>
          ))}
        </div>

        <a
          href="mailto:hello@one9founders.com"
          className="text-sm text-[var(--copper)] hover:text-[var(--copper-bright)] shrink-0"
        >
          Talk to us
        </a>
      </div>
    </section>
  );
}
