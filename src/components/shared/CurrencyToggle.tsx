'use client';

import { useState, useEffect } from 'react';

export type Currency = 'USD' | 'INR';

interface CurrencyToggleProps {
  onChange?: (currency: Currency) => void;
  className?: string;
}

const CURRENCY_STORAGE_KEY = 'one9founders_currency';

function detectIndianLocale(): boolean {
  if (typeof navigator === 'undefined') return false;
  const lang = navigator.language || '';
  return lang.includes('en-IN') || lang.includes('hi') || lang.includes('ta') || lang.includes('te');
}

export function getCurrency(): Currency {
  if (typeof window === 'undefined') return 'USD';
  const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
  if (stored === 'USD' || stored === 'INR') return stored;
  return detectIndianLocale() ? 'INR' : 'USD';
}

export function setCurrency(currency: Currency): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
}

export default function CurrencyToggle({ onChange, className = '' }: CurrencyToggleProps) {
  const [currency, setCurrencyState] = useState<Currency>('USD');

  useEffect(() => {
    setCurrencyState(getCurrency());
  }, []);

  const toggle = () => {
    const next: Currency = currency === 'USD' ? 'INR' : 'USD';
    setCurrencyState(next);
    setCurrency(next);
    onChange?.(next);
  };

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
        currency === 'INR'
          ? 'bg-copper/20 text-copper border border-copper/30'
          : 'bg-[var(--gray-800)] text-[var(--gray-400)] border border-[var(--gray-700)]'
      } hover:opacity-80 ${className}`}
      aria-label={`Switch to ${currency === 'USD' ? 'INR' : 'USD'} pricing`}
    >
      <span className={currency === 'USD' ? 'font-bold' : 'opacity-60'}>$</span>
      <span className="text-[var(--gray-600)]">/</span>
      <span className={currency === 'INR' ? 'font-bold' : 'opacity-60'}>&#8377;</span>
    </button>
  );
}
