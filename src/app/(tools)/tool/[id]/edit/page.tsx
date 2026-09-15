import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateSEO } from '@/lib/utils/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getOwnedListing } from '@/lib/actions/listings';
import EditListingClient from './EditListingClient';
import EditListingLoginPrompt from './EditListingLoginPrompt';

export const dynamic = 'force-dynamic';

interface EditListingPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditListingPageProps): Promise<Metadata> {
  const { id } = await params;
  return generateSEO({
    title: 'Edit listing',
    description: 'Update your One9Founders directory listing.',
    path: `/tool/${id}/edit`,
    robots: { index: false, follow: false },
  });
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = await params;
  const result = await getOwnedListing(id);

  if (result.status === 'forbidden') {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <Navbar />
      {result.status === 'unauthenticated' ? (
        <EditListingLoginPrompt slug={id} />
      ) : (
        <EditListingClient tool={result.tool} />
      )}
      <Footer />
    </div>
  );
}
