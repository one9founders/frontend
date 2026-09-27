import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { generateSEO } from '@/lib/utils/seo';
import { SERVICE_OFFERS, serviceBySlug } from '@/content/growthPages';
import ServiceInquiryForm from '@/components/features/services/ServiceInquiryForm';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICE_OFFERS.map((offer) => ({ slug: offer.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const offer = serviceBySlug(slug);
  if (!offer) return { title: 'Service not found' };
  return generateSEO({
    title: offer.title,
    description: offer.problem,
    path: `/services/${offer.slug}`,
  });
}

export default async function ServiceOfferPage({ params }: Props) {
  const { slug } = await params;
  const offer = serviceBySlug(slug);
  if (!offer) notFound();

  return (
    <div className="min-h-screen bg-[var(--ink)] text-[var(--paper)]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-12 space-y-8">
        <p className="text-sm"><Link href="/services" className="text-[var(--copper)]">All services</Link></p>
        <h1 className="font-display text-4xl">{offer.title}</h1>
        <section>
          <h2 className="text-lg mb-2">Problem</h2>
          <p className="text-[var(--gray-400)]">{offer.problem}</p>
        </section>
        <section>
          <h2 className="text-lg mb-2">Who it fits</h2>
          <p className="text-[var(--gray-400)]">{offer.fit}</p>
        </section>
        <List title="Deliverables" items={offer.deliverables} />
        <List title="Not included" items={offer.exclusions} />
        <List title="What you need to provide" items={offer.inputs} />
        <List title="Process" items={offer.process} />
        <p className="text-sm text-[var(--gray-500)]">
          Supported systems are the ones you can grant access to and that we confirm in writing. No customer proof is published on this page.
        </p>
        <section className="border border-[var(--line)] p-5">
          <h2 className="text-lg mb-4">Intake</h2>
          <ServiceInquiryForm offer={offer.offer} />
        </section>
      </main>
      <Footer />
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="text-lg mb-2">{title}</h2>
      <ul className="list-disc pl-5 text-sm text-[var(--gray-400)] space-y-1">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}
