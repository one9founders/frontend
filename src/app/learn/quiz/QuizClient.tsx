'use client';

import { useState } from 'react';
import Link from 'next/link';
import { educationAPI } from '@/lib/api/apiClient';

interface QuizQuestion {
  id: number;
  question: string;
  options: { label: string; value: string }[];
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What describes you best?',
    options: [
      { label: 'College student', value: 'student' },
      { label: 'Working professional', value: 'professional' },
      { label: 'Entrepreneur', value: 'entrepreneur' },
      { label: 'Business owner', value: 'business_owner' },
    ],
  },
  {
    id: 2,
    question: "What's your primary goal?",
    options: [
      { label: 'Get better at my current job', value: 'upskill' },
      { label: 'Land a job or internship', value: 'job' },
      { label: 'Build a business', value: 'build' },
      { label: 'Automate tasks', value: 'automate' },
    ],
  },
  {
    id: 3,
    question: 'Tech comfort level?',
    options: [
      { label: 'I use basic apps', value: 'basic' },
      { label: 'Comfortable with software', value: 'comfortable' },
      { label: 'I use no-code tools', value: 'nocode' },
      { label: 'I can code / am technical', value: 'technical' },
    ],
  },
  {
    id: 4,
    question: 'Weekly time available for learning?',
    options: [
      { label: '2-3 hours', value: 'low' },
      { label: '5-6 hours', value: 'medium' },
      { label: '10+ hours', value: 'high' },
    ],
  },
  {
    id: 5,
    question: 'What interests you most?',
    options: [
      { label: 'AI for content creation', value: 'content' },
      { label: 'AI for coding & development', value: 'coding' },
      { label: 'AI for marketing & sales', value: 'marketing' },
      { label: 'AI for automation & workflows', value: 'automation' },
    ],
  },
];

interface TrackRecommendation {
  title: string;
  description: string;
  href: string;
  tag: string;
  color: string;
}

const trackMap: Record<string, TrackRecommendation> = {
  students: {
    title: 'Student Track',
    description: 'Build practical AI skills that give you an edge in placements and your first job. Start with foundations, then specialize.',
    href: '/learn/students',
    tag: 'Best for Students',
    color: 'border-blue-500/30 bg-blue-500/5',
  },
  professionals: {
    title: 'Professional Track',
    description: 'Upskill in AI tools transforming your industry. Learn to automate workflows and boost productivity.',
    href: '/learn/professionals',
    tag: 'Best for Professionals',
    color: 'border-purple-500/30 bg-purple-500/5',
  },
  entrepreneurs: {
    title: 'Entrepreneur Track',
    description: 'Build faster, spend less, scale smarter. AI tools for founders who want to move fast without a technical co-founder.',
    href: '/learn/entrepreneurs',
    tag: 'Best for Entrepreneurs',
    color: 'border-orange-500/30 bg-orange-500/5',
  },
  business_owners: {
    title: 'Business Owner Track',
    description: 'Automate operations, reduce costs, and scale your business with practical AI tools.',
    href: '/learn/entrepreneurs',
    tag: 'Best for Business Owners',
    color: 'border-green-500/30 bg-green-500/5',
  },
};

function getRecommendation(answers: Record<number, string>): TrackRecommendation {
  const profile = answers[1] || 'student';
  if (profile === 'student') return trackMap.students;
  if (profile === 'professional') return trackMap.professionals;
  if (profile === 'entrepreneur') return trackMap.entrepreneurs;
  if (profile === 'business_owner') return trackMap.business_owners;
  return trackMap.students;
}

type QuizStep = 'quiz' | 'capture' | 'result';

export default function QuizClient() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [step, setStep] = useState<QuizStep>('quiz');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const progress = step === 'quiz'
    ? ((currentQuestion) / questions.length) * 100
    : step === 'capture' ? 90 : 100;

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 200);
    } else {
      setTimeout(() => setStep('capture'), 200);
    }
  };

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    setIsSubmitting(true);
    try {
      await educationAPI.submitCourseInquiry({
        name,
        email,
        phone,
        source_page: '/learn/quiz',
        message: `Quiz answers: ${JSON.stringify(answers)}`,
      });
      setSubmitted(true);
    } catch {
      // Still show results even if API fails
    }
    setIsSubmitting(false);
    setStep('result');
  };

  const recommendation = getRecommendation(answers);

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16 px-6">
      <div className="w-full max-w-xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-1.5 w-full rounded-full bg-[var(--gray-800)]">
            <div
              className="h-1.5 rounded-full bg-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-[var(--gray-500)] mt-2">
            {step === 'quiz' && `Question ${currentQuestion + 1} of ${questions.length}`}
            {step === 'capture' && 'Almost there!'}
            {step === 'result' && 'Your recommendation'}
          </p>
        </div>

        {/* Quiz Questions */}
        {step === 'quiz' && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6">
              {questions[currentQuestion].question}
            </h2>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    answers[questions[currentQuestion].id] === option.value
                      ? 'border-purple-500 bg-purple-500/10 text-white'
                      : 'border-[var(--gray-700)] bg-[var(--gray-900)] text-[var(--gray-300)] hover:border-[var(--gray-600)] hover:text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="mt-4 text-sm text-[var(--gray-500)] hover:text-white"
              >
                &larr; Previous
              </button>
            )}
          </div>
        )}

        {/* Capture Form */}
        {step === 'capture' && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-2">Get Your Personalized Recommendation</h2>
            <p className="text-[var(--gray-400)] mb-6">
              Enter your details to see your recommended learning track.
            </p>
            <form onSubmit={handleCapture} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--gray-300)] mb-1">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white placeholder-[var(--gray-500)] focus:outline-none focus:border-purple-500"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--gray-300)] mb-1">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white placeholder-[var(--gray-500)] focus:outline-none focus:border-purple-500"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--gray-300)] mb-1">Phone (WhatsApp) *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white placeholder-[var(--gray-500)] focus:outline-none focus:border-purple-500"
                  placeholder="+91 98765 43210"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !name || !email || !phone}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'See My Recommendation'}
              </button>
            </form>
            <button
              onClick={() => {
                setCurrentQuestion(questions.length - 1);
                setStep('quiz');
              }}
              className="mt-4 text-sm text-[var(--gray-500)] hover:text-white"
            >
              &larr; Back to questions
            </button>
          </div>
        )}

        {/* Result */}
        {step === 'result' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Your Recommended Track</h2>
              {submitted && (
                <p className="text-sm text-[var(--gray-500)]">
                  We&apos;ll also reach out within 24 hours with personalized suggestions.
                </p>
              )}
            </div>

            <div className={`rounded-xl border p-6 ${recommendation.color}`}>
              <span className="text-xs font-medium text-purple-400 mb-2 block">{recommendation.tag}</span>
              <h3 className="text-xl font-bold text-white mb-3">{recommendation.title}</h3>
              <p className="text-[var(--gray-300)] mb-6">{recommendation.description}</p>
              <div className="flex flex-wrap gap-3">
                <Link href={recommendation.href} className="btn-primary px-6 py-3">
                  Explore This Track
                </Link>
                <Link href="/learn/courses" className="btn-secondary px-6 py-3">
                  Browse All Courses
                </Link>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setCurrentQuestion(0);
                  setAnswers({});
                  setStep('quiz');
                  setName('');
                  setEmail('');
                  setPhone('');
                  setSubmitted(false);
                }}
                className="text-sm text-[var(--gray-500)] hover:text-white"
              >
                Retake quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
