import { Metadata } from 'next';
import { generateSEO } from '@/lib/utils/seo';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import QuizClient from './QuizClient';

export const metadata: Metadata = generateSEO({
  title: 'AI Learning Quiz - Find Your Perfect Track',
  description: 'Take a quick quiz to discover the best AI learning path for you. Get personalized recommendations based on your background and goals.',
  path: '/learn/quiz',
  keywords: ['AI quiz', 'learning recommendation', 'AI course finder', 'personalized AI learning'],
});

export default function QuizPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Learn', path: '/learn' },
          { name: 'Quiz', path: '/learn/quiz' },
        ]}
      />
      <QuizClient />
    </>
  );
}
