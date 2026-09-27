import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { generateSEO } from '@/lib/utils/seo';

export const metadata: Metadata = generateSEO({
  title: 'Our products',
  description: 'One9 Worker is the desktop coworker built by One9Founders. Directory listings of other companies are not One9 products.',
  path: '/products',
});

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[var(--ink)] text-[var(--paper)]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-12 space-y-6">
        <h1 className="font-display text-4xl md:text-5xl">Our products</h1>
        <p className="text-[var(--gray-400)]">
          The directory lists products from many companies. This page is only for software One9Founders builds.
        </p>
        <article className="border border-[var(--line)] p-6 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--copper)]">Owned product</p>
          <h2 className="text-2xl">One9 Worker</h2>
          <p className="text-sm text-[var(--gray-400)]">
            A local desktop coworker. You install it, sign in through One9Founders Cloud, and add your own model key. Chats, files, and keys stay on the machine.
          </p>
          <p className="text-sm text-[var(--gray-400)]">
            Comparisons that mention Worker should say it is built by One9Founders. It is not an independent directory listing.
          </p>
          <Link href="/worker" className="inline-block text-sm text-[var(--copper)]">Product page and install steps</Link>
        </article>
      </main>
      <Footer />
    </div>
  );
}
