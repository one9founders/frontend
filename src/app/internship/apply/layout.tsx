import type { Metadata } from 'next';
import { generateSEO } from '@/lib/utils/seo';

export const metadata: Metadata = generateSEO({
  title: 'Internship Application',
  description: 'Submit your One9Founders campus internship application.',
  path: '/internship/apply',
  robots: { index: false, follow: false },
});

export default function InternshipApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
