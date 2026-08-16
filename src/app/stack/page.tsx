import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnswerEngineHome from '@/components/features/stacks/AnswerEngineHome';
import { generateSEO } from '@/lib/utils/seo';

export const metadata: Metadata = generateSEO({
  title: 'Assemble a free-first AI stack',
  description:
    'Tell us the job. One9Founders assembles a free-first stack: open source, agent skills, hosted tools, and One9 Worker last.',
  path: '/stack',
  keywords: [
    'AI stack',
    'free AI tools',
    'open source SEO',
    'agent skills',
    'MCP servers',
    'One9 Worker',
    'YC credits',
  ],
});

export default function StackPage() {
  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <Navbar />
      <AnswerEngineHome />
      <Footer />
    </div>
  );
}
