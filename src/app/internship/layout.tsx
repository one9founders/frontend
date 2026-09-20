import type { Metadata } from 'next';
import { generateSEO } from '@/lib/utils/seo';

export const metadata: Metadata = generateSEO({
  title: 'Campus Internship',
  description: 'Apply for the One9Founders campus internship program.',
  path: '/internship',
  robots: { index: false, follow: false },
});

export default function InternshipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
