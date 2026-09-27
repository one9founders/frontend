import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { generateSEO } from '@/lib/utils/seo';
import SavedListings from '@/components/features/tools/SavedListings';

export const metadata: Metadata = generateSEO({
  title: 'Saved listings',
  description: 'Tools and agents saved in this browser.',
  path: '/saved',
  robots: { index: false, follow: true },
});

export default function SavedPage() {
  return (
    <div className="min-h-screen bg-[var(--ink)] text-[var(--paper)]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-12">
        <h1 className="font-display text-4xl mb-4">Saved listings</h1>
        <p className="text-sm text-[var(--gray-400)] mb-8">
          Stored in this browser only. Clearing site data removes the list.
        </p>
        <SavedListings />
      </main>
      <Footer />
    </div>
  );
}
