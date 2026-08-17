import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SavedStackView from '@/components/features/stacks/SavedStackView';
import { fetchJobStack } from '@/lib/api/jobStack';
import { generateSEO } from '@/lib/utils/seo';

export const dynamic = 'force-dynamic';

interface StackByIdProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: StackByIdProps): Promise<Metadata> {
  const { id } = await params;
  const stack = await fetchJobStack(id);
  if (!stack) {
    return { title: 'Stack not found | One9Founders' };
  }
  return generateSEO({
    title: stack.title,
    description: stack.blurb || `A free-first stack for: ${stack.query}`,
    path: `/stack/${stack.public_id}`,
  });
}

export default async function SavedStackPage({ params }: StackByIdProps) {
  const { id } = await params;
  const stack = await fetchJobStack(id);
  if (!stack) notFound();

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <Navbar />
      <SavedStackView stack={stack} />
      <Footer />
    </div>
  );
}
