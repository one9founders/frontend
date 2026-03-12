'use client';

import { HugeiconsIcon, Linkedin01Icon } from './icons';

interface InternCardProps {
  picture: string;
  name: string;
  linkedin: string;
  category: 'tech' | 'social';
}

export default function InternCard({ picture, name, linkedin, category }: InternCardProps) {
  return (
    <div className="intern-card group relative rounded-3xl overflow-hidden aspect-[4/5] max-w-sm">
      {/* Image */}
      <img
        src={picture}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Category badge */}
      <div className="absolute top-4 right-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
            category === 'tech'
              ? 'bg-purple-500/20 border-purple-400/40 text-purple-200'
              : 'bg-pink-500/20 border-pink-400/40 text-pink-200'
          }`}
        >
          {category === 'tech' ? (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          )}
          {category === 'tech' ? 'Tech' : 'Social Media'}
        </span>
      </div>

      {/* Name + LinkedIn at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-end justify-between">
          <div>
            <h4 className="text-lg font-bold text-white drop-shadow-lg leading-tight">{name}</h4>
            <p className="text-xs text-white/60 mt-0.5">Intern</p>
          </div>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[var(--brand-primary)] hover:border-[var(--brand-primary)] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25"
            aria-label={`${name}'s LinkedIn profile`}
          >
            <HugeiconsIcon icon={Linkedin01Icon} size={18} />
          </a>
        </div>
      </div>

      {/* Hover glow border */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-purple-500/50 transition-all duration-300 pointer-events-none" />
    </div>
  );
}
