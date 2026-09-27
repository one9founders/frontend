import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { generateSEO } from '@/lib/utils/seo';
import SubmissionStatus from '@/components/features/tools/SubmissionStatus';

export const metadata: Metadata = generateSEO({
  title: 'Submission status',
  description: 'Check a tool submission with its private status link.',
  path: '/submit/status',
  robots: { index: false, follow: false },
});

export default async function SubmissionStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="min-h-screen bg-[var(--ink)] text-[var(--paper)]">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 md:px-6 py-12">
        <h1 className="font-display text-4xl mb-4">Submission status</h1>
        <SubmissionStatus token={params.token || ''} />
      </main>
      <Footer />
    </div>
  );
}
