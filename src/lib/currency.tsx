'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type Currency = 'USD' | 'INR';

const CURRENCY_STORAGE_KEY = 'one9founders_currency';
const DEFAULT_EXCHANGE_RATE = 83.5;

function detectIndianLocale(): boolean {
  if (typeof navigator === 'undefined') return false;
  const lang = navigator.language || '';
  return lang.includes('en-IN') || lang.includes('hi') || lang.includes('ta') || lang.includes('te');
}

interface CurrencyContextType {
  currency: Currency;
  toggleCurrency: () => void;
  setCurrency: (c: Currency) => void;
  formatPrice: (usd: number | undefined | null, inr?: number | null) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  toggleCurrency: () => {},
  setCurrency: () => {},
  formatPrice: () => '',
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('USD');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (stored === 'USD' || stored === 'INR') {
      setCurrencyState(stored);
    } else if (detectIndianLocale()) {
      setCurrencyState('INR');
    }
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENCY_STORAGE_KEY, c);
    }
  }, []);

  const toggleCurrency = useCallback(() => {
    setCurrency(currency === 'USD' ? 'INR' : 'USD');
  }, [currency, setCurrency]);

  const formatPrice = useCallback((usd: number | undefined | null, inr?: number | null): string => {
    if (currency === 'INR') {
      if (inr != null && inr > 0) {
        return `₹${Math.round(inr).toLocaleString('en-IN')}`;
      }
      if (usd != null && usd > 0) {
        return `₹${Math.round(usd * DEFAULT_EXCHANGE_RATE).toLocaleString('en-IN')}`;
      }
      return '';
    }
    if (usd != null && usd > 0) return `$${usd}`;
    return '';
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
