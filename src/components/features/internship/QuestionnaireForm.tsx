'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { submitApplication, saveProgress } from '@/lib/actions/internship';

const questions = {
  product: [
    { id: 'p1', prompt: 'Visit one9founders.com and spend 10 minutes exploring the platform. List 3-5 things that feel confusing, broken, or could be improved from a user\'s perspective. Be specific about where you found each issue.', maxChars: 1000 },
    { id: 'p2', prompt: 'Imagine you\'re the product manager. We can only build ONE new feature in the next month. What should it be and why? Consider: user needs, business impact, and feasibility.', maxChars: 800 },
    { id: 'p3', prompt: 'Find 2-3 other AI tools directories or similar platforms. What do they do better than us? What do we do better than them?', maxChars: 1000 },
    { id: 'p4', prompt: 'Describe a time when you were frustrated using a website or app. What went wrong? How would you have fixed it if you were building it?', maxChars: 600 }
  ],
  uiux: [
    { id: 'u1', prompt: 'Visit one9founders.com for the first time. Within 30 seconds, what do you understand about what we do? What\'s confusing? What caught your attention first?', maxChars: 800 },
    { id: 'u2', prompt: 'Try to complete this task on our website: Find an AI tool for email marketing, compare it with 2 other similar tools, then save it for later. Describe each step. Where did you get stuck or feel frustrated?', maxChars: 1200 },
    { id: 'u3', prompt: 'Open our website on your phone. What works well? What doesn\'t? How would you improve the mobile experience?', maxChars: 800 },
    { id: 'u4', prompt: 'Sketch or describe a redesigned homepage for One9Founders. What would you change? You can draw on paper, use Figma, or just describe it in detail.', maxChars: 1000 }
  ],
  design: [
    { id: 'd1', prompt: 'Visit @one9founders on Instagram. Scroll through our last 10 posts. What works visually? What doesn\'t grab your attention? What would you change?', maxChars: 1000 },
    { id: 'd2', prompt: 'Look at our website and Instagram together. What personality/vibe does our brand give off? Is it consistent? What emotion should users feel when they see our brand?', maxChars: 800 },
    { id: 'd3', prompt: 'Look at our homepage hero section. What do your eyes naturally look at first, second, third? Is this the order we WANT users to look? How would you guide their attention better?', maxChars: 800 },
    { id: 'd4', prompt: 'Design one Instagram post for us announcing this internship program. You can sketch it, use Canva, or describe it in extreme detail. Show us your creative thinking.', maxChars: 1000 }
  ],
  tech: [
    { id: 't1', prompt: 'Open one9founders.com and inspect the website (right-click → Inspect). Based on what you see in the code, what tech stack do you think we\'re using? What technical issues or opportunities do you notice?', maxChars: 1200 },
    { id: 't2', prompt: 'We have 2,500+ AI tools to organize. If you were designing the search and ranking algorithm, what factors would you consider? How would you ensure users find the BEST tool for their needs, not just the most popular one?', maxChars: 1000 },
    { id: 't3', prompt: 'Use browser dev tools to check our website\'s performance (Network tab, Lighthouse, etc.). What\'s slow? What could be optimized? How would you improve load times?', maxChars: 1200 },
    { id: 't4', prompt: 'We want to add a \'Compare Tools\' feature where users can select 2-3 AI tools and see them side-by-side. How would you build this? Describe your technical approach.', maxChars: 1500 }
  ]
};

export default function QuestionnaireForm({ track, user, basicDetails }: { track: string; user: any; basicDetails: any }) {
  const router = useRouter();
  const trackQuestions = questions[track as keyof typeof questions] || [];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [charCounts, setCharCounts] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(answers).length > 0) {
        saveProgress({ step: 'questionnaire', track, answers });
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [answers, track]);

  const handleAnswerChange = (id: string, value: string, maxChars: number) => {
    const trimmed = value.slice(0, maxChars);
    setAnswers({ ...answers, [id]: trimmed });
    setCharCounts({ ...charCounts, [id]: trimmed.length });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await submitApplication({
        ...basicDetails,
        answers
      });
      router.push('/campus-internship/success');
    } catch (error) {
      alert('Submission failed. Please try again.');
      setSubmitting(false);
    }
  };

  const getCharColor = (count: number, max: number) => {
    const ratio = count / max;
    if (ratio > 0.9) return 'text-red-500';
    if (ratio > 0.8) return 'text-yellow-500';
    return 'text-[var(--gray-500)]';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">{track.toUpperCase()} Track Questions</h2>
        <p className="text-[var(--gray-400)]">Answer all questions thoughtfully. Show your thinking process.</p>
      </div>

      {trackQuestions.map((q, idx) => (
        <div key={q.id} className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg p-6">
          <h3 className="text-white font-semibold mb-3">Question {idx + 1}</h3>
          <p className="text-[var(--gray-400)] mb-4">{q.prompt}</p>
          <textarea
            value={answers[q.id] || ''}
            onChange={e => handleAnswerChange(q.id, e.target.value, q.maxChars)}
            className="w-full bg-[var(--gray-950)] border border-[var(--gray-800)] rounded-lg px-4 py-3 text-white h-40"
            required
          />
          <p className={`text-sm mt-2 ${getCharColor(charCounts[q.id] || 0, q.maxChars)}`}>
            {charCounts[q.id] || 0}/{q.maxChars} characters
          </p>
        </div>
      ))}

      <button type="submit" disabled={submitting} className="btn-primary w-full py-4">
        {submitting ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}
