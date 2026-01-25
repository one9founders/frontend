import { Metadata } from 'next';
import { generateSEO } from '@/lib/utils/seo';
import SubmitToolPageClient from './SubmitToolPageClient';

export const metadata: Metadata = generateSEO({
  title: 'Submit an AI Tool - Add to Directory',
  description: 'Help fellow founders discover amazing AI tools by submitting your recommendations to One9Founders directory. Share tools that accelerate startup growth.',
  path: '/submit',
  keywords: ['submit AI tool', 'add tool', 'tool submission', 'AI directory submission', 'recommend tools'],
});

export default function SubmitToolPage() {
  return <SubmitToolPageClient />;
}
