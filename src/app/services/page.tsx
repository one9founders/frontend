import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { generateSEO } from '@/lib/utils/seo';
import { SERVICE_OFFERS } from '@/content/growthPages';

export const metadata: Metadata = generateSEO({
  title: 'AI services',
  description: 'Workflow audit, scoped implementation, and maintenance. Intake is saved for a person to read. No price or reply-time promise is listed here.',
  path: '/services',
});

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[var(--ink)] text-[var(--paper)]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-12">
        <h1 className="font-display text-4xl md:text-5xl mb-4">AI services</h1>
        <p className="text-[var(--gray-400)] max-w-2xl mb-10">
          Three offers. Each one starts with a written intake. Scope, price, and whether we can take it are decided after a person reads that intake.
        </p>
        <div className="grid gap-4">
          {SERVICE_OFFERS.map((offer) => (
            <Link key={offer.slug} href={`/services/${offer.slug}`} className="border border-[var(--line)] p-6 hover:border-[var(--copper-dim)]">
              <h2 className="text-2xl mb-2">{offer.title}</h2>
              <p className="text-sm text-[var(--gray-400)]">{offer.problem}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
