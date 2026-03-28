'use client';

import { useEffect, useRef } from 'react';

interface CloudflareCheckProps {
  onVerified: (token: string) => void;
}

export default function CloudflareCheck({ onVerified }: CloudflareCheckProps) {
  const callbackRef = useRef(onVerified);
  callbackRef.current = onVerified;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    document.head.appendChild(script);

    // @ts-ignore
    window.onTurnstileCallback = (token: string) => {
      callbackRef.current(token);
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="mb-4">
      <div
        className="cf-turnstile"
        data-sitekey="0x4AAAAAACEZjDMrdgi2yrki"
        data-callback="onTurnstileCallback"
        data-theme="dark"
      ></div>
    </div>
  );
}
