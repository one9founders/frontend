'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { Target02Icon, Settings01Icon, BotIcon, CheckmarkCircle01Icon, Clock01Icon, Mortarboard01Icon, File01Icon, ArtboardIcon, SparklesIcon } from '@hugeicons/core-free-icons';

const tracks = [
  { id: 'product', icon: Target02Icon, title: 'PRODUCT TRACK', desc: 'Audit our platform, suggest improvements, challenge our assumptions', perfect: 'Critical thinkers who spot what\'s broken' },
  { id: 'uiux', icon: ArtboardIcon, title: 'UI/UX TRACK', desc: 'Analyze user experience, find friction points, design better flows', perfect: 'Design thinkers who understand users' },
  { id: 'design', icon: SparklesIcon, title: 'SOCIAL MEDIA TRACK', desc: 'Evaluate our Instagram, audit brand identity, create visual magic', perfect: 'Creative minds who see beyond pixels' },
  { id: 'tech', icon: Settings01Icon, title: 'TECH TRACK', desc: 'Help rank 2,500+ AI tools, solve technical challenges, build systems', perfect: 'Problem solvers who love tech' }
];

export default function InternshipLanding() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Hero - Applications Closed */}
      <div className="text-center mb-16">
        <div className="inline-block bg-gradient-to-r from-[var(--brand-primary)]/20 to-[var(--brand-secondary)]/20 border border-[var(--brand-primary)]/30 rounded-full px-6 py-2 mb-6">
          <span className="text-[var(--brand-primary)] font-semibold">1000+ Applications Received</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Applications Are Now Closed
        </h1>
        <h2 className="text-2xl md:text-4xl text-[var(--gray-400)] mb-6">
          Thank you for your overwhelming response!
        </h2>
        <p className="text-lg text-[var(--gray-500)] mb-8 max-w-2xl mx-auto">
          We received an incredible number of applications for our internship program backed by IIT Bombay and mentored by Prof. Ramesh Kuruva. Stay tuned for further updates!
        </p>
      </div>

      {/* Benefits - Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
        <div className="md:col-span-2 bg-gradient-to-br from-[var(--brand-primary)]/20 to-[var(--gray-900)] border border-[var(--brand-primary)]/30 rounded-2xl p-8 flex flex-col justify-center">
          <HugeiconsIcon icon={Mortarboard01Icon} className="w-12 h-12 text-[var(--brand-primary)] mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">IIT Bombay-Backed Startup</h3>
          <p className="text-[var(--gray-400)]">Work with the founding team under Prof. Ramesh Kuruva's mentorship</p>
        </div>
        <div className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-2xl p-6 hover:border-[var(--brand-primary)]/50 transition-colors">
          <HugeiconsIcon icon={File01Icon} className="w-10 h-10 text-[var(--brand-primary)] mb-3" />
          <h4 className="text-lg font-semibold text-white mb-1">Letter of Recommendation</h4>
          <p className="text-sm text-[var(--gray-500)]">From Prof. Ramesh Kuruva for standout contributors</p>
        </div>
        <div className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-2xl p-6 hover:border-[var(--brand-primary)]/50 transition-colors">
          <HugeiconsIcon icon={BotIcon} className="w-10 h-10 text-[var(--brand-primary)] mb-3" />
          <h4 className="text-lg font-semibold text-white mb-1">Premium AI Tools</h4>
          <p className="text-sm text-[var(--gray-500)]">
₹50,000+ worth of cutting-edge tools. Access to the latest AI technologies</p>
        </div>
        <div className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-2xl p-6 hover:border-[var(--brand-primary)]/50 transition-colors">
          <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-10 h-10 text-[var(--brand-primary)] mb-3" />
          <h4 className="text-lg font-semibold text-white mb-1">No Resume Needed</h4>
          <p className="text-sm text-[var(--gray-500)]">Just your passion and the out of the box thinking</p>
        </div>
        <div className="bg-gradient-to-r from-[var(--brand-primary)]/20 to-[var(--gray-900)] border border-[var(--brand-primary)]/30 rounded-2xl p-6">
          <HugeiconsIcon icon={Clock01Icon} className="w-10 h-10 text-[var(--brand-primary)] mb-3" />
          <h4 className="text-lg font-semibold text-white mb-1">Applications Closed</h4>
          <p className="text-sm text-[var(--gray-400)]">Stay tuned for future opportunities!</p>
        </div>
      </div>

      {/* Tracks - Now showing as closed */}
      <div id="tracks-section">
        <h3 className="text-3xl font-bold text-white text-center mb-8">Our Tracks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tracks.map(track => (
            <div
              key={track.id}
              className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-2xl p-8"
            >
              <HugeiconsIcon icon={track.icon} className="w-12 h-12 text-[var(--brand-primary)] mb-4" />
              <h4 className="text-xl font-bold text-white mb-3">{track.title}</h4>
              <p className="text-[var(--gray-400)] mb-4">{track.desc}</p>
              <p className="text-sm text-[var(--gray-500)]">Perfect for: <span className="text-[var(--gray-400)]">{track.perfect}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
