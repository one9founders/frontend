import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { generateSEO } from '@/lib/utils/seo';
import { SOLUTION_GUIDES } from '@/content/growthPages';

export const metadata: Metadata = generateSEO({
  title: 'Solutions',
  description: 'Task guides for support, content, coding, and internal knowledge search. Each one is a selection checklist with a workflow example.',
  path: '/solutions',
});

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-[var(--ink)] text-[var(--paper)]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-12">
        <h1 className="font-display text-4xl md:text-5xl mb-4">Solutions</h1>
        <p className="text-[var(--gray-400)] max-w-2xl mb-10">
          Short guides for a job. They link into the directory and into services. They do not claim a measured search-demand ranking.
        </p>
        <div className="grid gap-4">
          {SOLUTION_GUIDES.map((guide) => (
            <Link key={guide.slug} href={`/solutions/${guide.slug}`} className="border border-[var(--line)] p-6 hover:border-[var(--copper-dim)]">
              <h2 className="text-2xl mb-2">{guide.title}</h2>
              <p className="text-sm text-[var(--gray-400)]">{guide.task}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
