'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { Target02Icon, Settings01Icon, BotIcon, CheckmarkCircle01Icon, Clock01Icon, Mortarboard01Icon, File01Icon, ArtboardIcon, SparklesIcon } from '@hugeicons/core-free-icons';

const tracks = [
  { id: 'product', icon: Target02Icon, title: 'PRODUCT TRACK', desc: 'Audit our platform, suggest improvements, challenge our assumptions', perfect: 'Critical thinkers who spot what\'s broken', link: 'https://typeform.com/product' },
  { id: 'uiux', icon: ArtboardIcon, title: 'UI/UX TRACK', desc: 'Analyze user experience, find friction points, design better flows', perfect: 'Design thinkers who understand users', link: 'https://typeform.com/uiux' },
  { id: 'design', icon: SparklesIcon, title: 'DESIGN TRACK', desc: 'Evaluate our Instagram, audit brand identity, create visual magic', perfect: 'Creative minds who see beyond pixels', link: 'https://typeform.com/design' },
  { id: 'tech', icon: Settings01Icon, title: 'TECH TRACK', desc: 'Help rank 2,500+ AI tools, solve technical challenges, build systems', perfect: 'Problem solvers who love tech', link: 'https://typeform.com/tech' }
];

export default function InternshipLanding() {
  const scrollToTracks = () => {
    const tracksSection = document.querySelector('#tracks-section');
    if (tracksSection) {
      tracksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Work with IIT Bombay IITians
        </h1>
        <h2 className="text-2xl md:text-4xl text-[var(--gray-400)] mb-6">
          Build the Future of AI Discovery
        </h2>
        <p className="text-lg text-[var(--gray-500)] mb-8">
          Get hands-on startup experience mentored by Prof. Ramesh Kuruva
        </p>
        <div className="flex justify-center">
          <button onClick={scrollToTracks} className="btn-primary px-8 py-4 text-lg cursor-pointer">
            APPLY NOW
          </button>
        </div>
      </div>

      {/* Benefits - Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
        <div className="md:col-span-2 bg-gradient-to-br from-[var(--brand-primary)]/20 to-[var(--gray-900)] border border-[var(--brand-primary)]/30 rounded-2xl p-8 flex flex-col justify-center">
          <HugeiconsIcon icon={Mortarboard01Icon} className="w-12 h-12 text-[var(--brand-primary)] mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Work with IIT Bombay Alumni</h3>
          <p className="text-[var(--gray-400)]">Learn from experienced founders and get mentored by Prof. Ramesh Kuruva</p>
        </div>
        <div className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-2xl p-6 hover:border-[var(--brand-primary)]/50 transition-colors">
          <HugeiconsIcon icon={File01Icon} className="w-10 h-10 text-[var(--brand-primary)] mb-3" />
          <h4 className="text-lg font-semibold text-white mb-1">Letter of Recommendation</h4>
          <p className="text-sm text-[var(--gray-500)]">From Prof. Ramesh Kuruva</p>
        </div>
        <div className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-2xl p-6 hover:border-[var(--brand-primary)]/50 transition-colors">
          <HugeiconsIcon icon={BotIcon} className="w-10 h-10 text-[var(--brand-primary)] mb-3" />
          <h4 className="text-lg font-semibold text-white mb-1">Premium AI Tools</h4>
          <p className="text-sm text-[var(--gray-500)]">₹50,000+ worth</p>
        </div>
        <div className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-2xl p-6 hover:border-[var(--brand-primary)]/50 transition-colors">
          <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-10 h-10 text-[var(--brand-primary)] mb-3" />
          <h4 className="text-lg font-semibold text-white mb-1">No Resume Needed</h4>
          <p className="text-sm text-[var(--gray-500)]">Just your passion</p>
        </div>
        <div className="bg-gradient-to-r from-red-500/20 to-[var(--gray-900)] border border-red-500/30 rounded-2xl p-6">
          <HugeiconsIcon icon={Clock01Icon} className="w-10 h-10 text-red-400 mb-3" />
          <h4 className="text-lg font-semibold text-white mb-1">Applications Close Soon</h4>
          <p className="text-sm text-[var(--gray-400)]">January 30, 2025 - Don't miss out!</p>
        </div>
      </div>

      {/* Tracks */}
      <div id="tracks-section">
        <h3 className="text-3xl font-bold text-white text-center mb-8">Choose Your Track</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tracks.map(track => (
            <div
              key={track.id}
              className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-2xl p-8 hover:border-[var(--brand-primary)] transition-colors"
            >
              <HugeiconsIcon icon={track.icon} className="w-12 h-12 text-[var(--brand-primary)] mb-4" />
              <h4 className="text-xl font-bold text-white mb-3">{track.title}</h4>
              <p className="text-[var(--gray-400)] mb-4">{track.desc}</p>
              <p className="text-sm text-[var(--gray-500)] mb-6">Perfect for: <span className="text-[var(--gray-400)]">{track.perfect}</span></p>
              <a
                href={track.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block btn-primary px-6 py-2 text-sm cursor-pointer"
              >
                Apply Now →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
