import type { Metadata } from 'next';
import { generateSEO } from '@/lib/utils/seo';

export const metadata: Metadata = generateSEO({
  title: 'Application Received',
  description: 'Your One9Founders internship application was submitted.',
  path: '/internship/success',
  robots: { index: false, follow: false },
});

export default function InternshipSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
