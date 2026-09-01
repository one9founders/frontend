import type { Metadata } from 'next';
import FounderSurveyForm from '@/components/features/survey/FounderSurveyForm';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { generateSEO } from '@/lib/utils/seo';

export const metadata: Metadata = generateSEO({
  title: 'What\'s slowing you down?',
  description: 'Tell us the one thing in your startup that wastes your time. We\'re building tools to fix real founder problems.',
  path: '/founder-survey',
});

export default function FounderSurveyPage() {
  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <Navbar />
      <main className="pt-8 pb-20">
        <FounderSurveyForm />
      </main>
      <Footer />
    </div>
  );
}
