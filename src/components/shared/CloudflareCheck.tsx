'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
    };
  }
}

interface CloudflareCheckProps {
  onVerified: (token: string) => void;
}

const TURNSTILE_SITEKEY = '0x4AAAAAACEZjDMrdgi2yrki';
const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

export default function CloudflareCheck({ onVerified }: CloudflareCheckProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onVerified);
  const widgetIdRef = useRef<string | null>(null);
  callbackRef.current = onVerified;

  useEffect(() => {
    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      // Remove previous widget if it exists
      if (widgetIdRef.current !== null) {
        try { window.turnstile.remove(widgetIdRef.current); } catch { /* widget already removed */ }
        widgetIdRef.current = null;
      }
      containerRef.current.innerHTML = '';
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITEKEY,
        callback: (token: string) => callbackRef.current(token),
        theme: 'dark',
      });
    };

    // If script is already loaded, render immediately
    if (window.turnstile) {
      renderWidget();
      return () => {
        cancelled = true;
        if (widgetIdRef.current !== null && window.turnstile) {
          try { window.turnstile.remove(widgetIdRef.current); } catch { /* cleanup */ }
        }
      };
    }

    // Check if script tag already exists (from another instance)
    const existingScript = document.querySelector(
      'script[src^="https://challenges.cloudflare.com/turnstile"]'
    );
    if (existingScript) {
      // Script is loading but not ready yet, poll for it
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          renderWidget();
        }
      }, 100);
      return () => {
        cancelled = true;
        clearInterval(interval);
        if (widgetIdRef.current !== null && window.turnstile) {
          try { window.turnstile.remove(widgetIdRef.current); } catch { /* cleanup */ }
        }
      };
    }

    // Load the script with explicit rendering mode
    const script = document.createElement('script');
    script.src = TURNSTILE_SCRIPT_URL;
    script.async = true;
    script.onload = renderWidget;
    document.head.appendChild(script);

    return () => {
      cancelled = true;
      if (widgetIdRef.current !== null && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch { /* cleanup */ }
      }
    };
  }, []);

  return (
    <div className="mb-4">
      <div ref={containerRef}></div>
    </div>
  );
}
