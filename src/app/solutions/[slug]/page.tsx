import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { generateSEO } from '@/lib/utils/seo';
import { SOLUTION_GUIDES, serviceBySlug, solutionBySlug } from '@/content/growthPages';
import CategoryFollowForm from '@/components/features/follow/CategoryFollowForm';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SOLUTION_GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = solutionBySlug(slug);
  if (!guide) return { title: 'Guide not found' };
  return generateSEO({
    title: guide.title,
    description: guide.task,
    path: `/solutions/${guide.slug}`,
  });
}

export default async function SolutionPage({ params }: Props) {
  const { slug } = await params;
  const guide = solutionBySlug(slug);
  if (!guide) notFound();
  const service = serviceBySlug(guide.serviceSlug);

  return (
    <div className="min-h-screen bg-[var(--ink)] text-[var(--paper)]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-12 space-y-8">
        <p className="text-sm"><Link href="/solutions" className="text-[var(--copper)]">All solutions</Link></p>
        <h1 className="font-display text-4xl">{guide.title}</h1>
        <p className="text-[var(--gray-400)]">{guide.task}</p>
        <p className="text-sm text-[var(--gray-400)]">For {guide.audience}</p>
        <List title="Selection criteria" items={guide.criteria} />
        <List title="Constraints" items={guide.constraints} />
        <List title="Workflow example" items={guide.workflow} />
        <section className="text-sm space-y-2">
          <h2 className="text-lg">Next steps</h2>
          <p>
            <Link href={`/?job=${guide.job}#tools-section`} className="text-[var(--copper)]">
              Directory filtered to {guide.job}
            </Link>
          </p>
          {service && (
            <p>
              <Link href={`/services/${service.slug}`} className="text-[var(--copper)]">
                {service.title}
              </Link>
              {' '}if you want help with this workflow.
            </p>
          )}
          <p>
            <Link href="/worker" className="text-[var(--copper)]">One9 Worker</Link>
            {' '}is built by One9Founders. It is a local desktop coworker, not a required part of this guide.
          </p>
        </section>
        <CategoryFollowForm source={`follow-${guide.slug}`.slice(0, 50)} label={guide.title} />
      </main>
      <Footer />
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="text-lg mb-2">{title}</h2>
      <ol className="list-decimal pl-5 text-sm text-[var(--gray-400)] space-y-1">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ol>
    </section>
  );
}
