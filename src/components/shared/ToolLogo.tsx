'use client';

import { useState } from 'react';

interface ToolLogoProps {
  logoUrl?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  containerClassName?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-10 h-10 text-lg',
  md: 'w-12 h-12 text-xl',
  lg: 'w-16 h-16 text-2xl',
  xl: 'w-32 h-32 text-5xl',
};

const bgColors = [
  'bg-purple-600',
  'bg-blue-600',
  'bg-green-600',
  'bg-orange-600',
  'bg-pink-600',
  'bg-cyan-600',
  'bg-indigo-600',
  'bg-teal-600',
  'bg-rose-600',
  'bg-amber-600',
];

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % bgColors.length;
  return bgColors[index];
}

export default function ToolLogo({ 
  logoUrl, 
  name, 
  size = 'sm',
  className = '',
  containerClassName = ''
}: ToolLogoProps) {
  const [imageError, setImageError] = useState(false);
  const sizeClass = sizeClasses[size];
  const firstLetter = name.charAt(0).toUpperCase();
  const bgColor = getColorFromName(name);

  const showFallback = !logoUrl || imageError;

  if (showFallback) {
    return (
      <div 
        className={`${sizeClass} ${bgColor} rounded-lg flex items-center justify-center font-bold text-white ${containerClassName}`}
      >
        {firstLetter}
      </div>
    );
  }

  return (
    <div className={`bg-white p-1 rounded-lg ${containerClassName}`}>
      <img
        src={logoUrl}
        alt={name}
        className={`${sizeClass} object-contain ${className}`}
        onError={() => setImageError(true)}
      />
    </div>
  );
}
