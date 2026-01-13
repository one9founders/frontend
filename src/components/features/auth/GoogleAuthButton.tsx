'use client';

import { useEffect } from 'react';

interface GoogleAuthButtonProps {
  onSuccess: (credential: string) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleAuthButton({ onSuccess }: GoogleAuthButtonProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: (response: any) => onSuccess(response.credential),
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [onSuccess]);

  return <div id="google-signin-button"></div>;
  
}
