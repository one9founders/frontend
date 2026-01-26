'use client';

import { createContext, useContext, useCallback, useEffect, useState, ReactNode } from 'react';

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

interface ReCaptchaContextType {
  executeRecaptcha: (action: string) => Promise<string | null>;
  isLoaded: boolean;
}

const ReCaptchaContext = createContext<ReCaptchaContextType>({
  executeRecaptcha: async () => null,
  isLoaded: false,
});

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export function ReCaptchaProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) {
      console.warn('reCAPTCHA site key not configured');
      return;
    }

    if (typeof window !== 'undefined' && !document.getElementById('recaptcha-script')) {
      const script = document.createElement('script');
      script.id = 'recaptcha-script';
      script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.grecaptcha.ready(() => {
          setIsLoaded(true);
        });
      };
      document.head.appendChild(script);
    } else if (typeof window !== 'undefined' && window.grecaptcha) {
      window.grecaptcha.ready(() => {
        setIsLoaded(true);
      });
    }
  }, []);

  const executeRecaptcha = useCallback(async (action: string): Promise<string | null> => {
    if (!RECAPTCHA_SITE_KEY) {
      console.warn('reCAPTCHA site key not configured');
      return null;
    }

    if (!isLoaded || typeof window === 'undefined' || !window.grecaptcha) {
      console.warn('reCAPTCHA not loaded yet');
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
      return token;
    } catch (error) {
      console.error('reCAPTCHA execution failed:', error);
      return null;
    }
  }, [isLoaded]);

  return (
    <ReCaptchaContext.Provider value={{ executeRecaptcha, isLoaded }}>
      {children}
    </ReCaptchaContext.Provider>
  );
}

export function useReCaptcha() {
  return useContext(ReCaptchaContext);
}
