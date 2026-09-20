'use client';

import {
  createContext,
  useContext,
  useCallback,
  useRef,
  useState,
  ReactNode,
} from 'react';

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

function loadRecaptchaScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.grecaptcha) {
    return new Promise((resolve) => {
      window.grecaptcha.ready(() => resolve());
    });
  }

  const existing = document.getElementById('recaptcha-script');
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => {
        window.grecaptcha.ready(() => resolve());
      });
      existing.addEventListener('error', () => reject(new Error('reCAPTCHA failed to load')));
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = 'recaptcha-script';
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.grecaptcha.ready(() => resolve());
    };
    script.onerror = () => reject(new Error('reCAPTCHA failed to load'));
    document.head.appendChild(script);
  });
}

/**
 * Loads reCAPTCHA only when a form actually needs a token — not on every page
 * mount — so the script does not compete with first interactions (mobile INP).
 */
export function ReCaptchaProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const loadPromiseRef = useRef<Promise<void> | null>(null);

  const ensureLoaded = useCallback(async () => {
    if (!RECAPTCHA_SITE_KEY) {
      console.warn('reCAPTCHA site key not configured');
      return false;
    }
    if (isLoaded && typeof window !== 'undefined' && window.grecaptcha) {
      return true;
    }
    if (!loadPromiseRef.current) {
      loadPromiseRef.current = loadRecaptchaScript()
        .then(() => {
          setIsLoaded(true);
        })
        .catch((error) => {
          loadPromiseRef.current = null;
          console.error(error);
          throw error;
        });
    }
    try {
      await loadPromiseRef.current;
      return true;
    } catch {
      return false;
    }
  }, [isLoaded]);

  const executeRecaptcha = useCallback(async (action: string): Promise<string | null> => {
    if (!RECAPTCHA_SITE_KEY) {
      console.warn('reCAPTCHA site key not configured');
      return null;
    }

    const ready = await ensureLoaded();
    if (!ready || typeof window === 'undefined' || !window.grecaptcha) {
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
  }, [ensureLoaded]);

  return (
    <ReCaptchaContext.Provider value={{ executeRecaptcha, isLoaded }}>
      {children}
    </ReCaptchaContext.Provider>
  );
}

export function useReCaptcha() {
  return useContext(ReCaptchaContext);
}
