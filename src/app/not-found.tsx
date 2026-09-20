import Link from 'next/link';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { generateSEO } from '@/lib/utils/seo';

export const metadata: Metadata = generateSEO({
  title: 'Page Not Found',
  description: 'This page does not exist. Browse AI tools, agents, and LLMs for startup founders.',
  path: '/',
  robots: { index: false, follow: true },
});

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--gray-black)] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
        <p className="text-sm uppercase tracking-widest text-[var(--gray-500)] mb-3">404</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Page not found
        </h1>
        <p className="text-[var(--gray-400)] max-w-md mb-8">
          This URL is not in our directory. Head home or browse tools for founders.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="rounded-md bg-[var(--brand-primary,#C47A3A)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Go home
          </Link>
          <Link
            href="/compare"
            className="rounded-md border border-[var(--gray-700)] px-5 py-2.5 text-sm font-semibold text-white hover:border-[var(--gray-500)]"
          >
            Compare tools
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
