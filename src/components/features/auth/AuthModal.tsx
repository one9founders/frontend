'use client';

import { useState, useTransition, useEffect } from 'react';
import { signUp, login, googleAuth } from '@/lib/actions/auth';
import CloudflareCheck from '@/components/shared/CloudflareCheck';
import Swal from 'sweetalert2';
import posthog from 'posthog-js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

declare global {
  interface Window {
    google: any;
  }
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'filled_black', size: 'large', width: '100%', text: 'continue_with' }
      );
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [isOpen, turnstileToken]);

  const handleGoogleResponse = (response: any) => {
    if (!turnstileToken) {
      Swal.fire('Error', 'Please complete the verification first', 'error');
      return;
    }

    startTransition(async () => {
      try {
        const result = await googleAuth(response.credential, turnstileToken);

        if ('error' in result) {
          Swal.fire('Error', result.error, 'error');
          return;
        }

        const user = result.user;

        // Identify user in PostHog
        posthog.identify(user.email, {
          email: user.email,
          name: user.name,
        });

        // Capture Google auth event
        posthog.capture('user_logged_in_google', {
          email: user.email,
          name: user.name,
        });

        await Swal.fire('Success', `Welcome ${user.name}!`, 'success');
        onClose();
      } catch (error: any) {
        posthog.captureException(error);
        Swal.fire('Error', error.message, 'error');
      }
    });
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!turnstileToken) {
      Swal.fire('Error', 'Please complete the verification', 'error');
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append('turnstileToken', turnstileToken);

    startTransition(async () => {
      try {
        const email = formData.get('email') as string;
        const result = mode === 'signup' ? await signUp(formData) : await login(formData);

        if ('error' in result) {
          if ('userExists' in result && result.userExists) {
            await Swal.fire('Account Already Exists', 'An account with this email already exists. Please login instead.', 'info');
            setMode('login');
          } else {
            Swal.fire('Error', result.error, 'error');
          }
          return;
        }

        const user = result.user;

        // Identify user in PostHog
        posthog.identify(user.email || email, {
          email: user.email || email,
          name: user.name,
        });

        // Capture appropriate event based on mode
        if (mode === 'signup') {
          posthog.capture('user_signed_up', {
            email: user.email || email,
            name: user.name,
            method: 'email',
          });
        } else {
          posthog.capture('user_logged_in', {
            email: user.email || email,
            name: user.name,
            method: 'email',
          });
        }

        await Swal.fire('Success', `Welcome ${user.name}!`, 'success');
        onClose();
      } catch (error: any) {
        posthog.captureException(error);
        Swal.fire('Error', error.message, 'error');
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" style={{overscrollBehavior: 'contain'}} onClick={onClose}>
      <div className="rounded-lg p-8 max-w-md w-full bg-[var(--gray-900)] border border-[var(--gray-800)]" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-white">{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                aria-label="Full Name"
                required
                className="w-full px-4 py-2 rounded-lg text-white bg-[var(--gray-800)] border border-[var(--gray-700)]"
              />
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_startup"
                  className="w-4 h-4 accent-[var(--brand-primary)]"
                />
                <span className="text-sm text-white">Are you a startup?</span>
              </label>
            </>
          )}
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            aria-label="Email"
            autoComplete="email"
            required
            className="w-full px-4 py-2 rounded-lg text-white bg-[var(--gray-800)] border border-[var(--gray-700)]"
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            aria-label="Password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            required
            className="w-full px-4 py-2 rounded-lg text-white bg-[var(--gray-800)] border border-[var(--gray-700)]"
          />

          <CloudflareCheck onVerified={(token) => setTurnstileToken(token)} />

          <button
            type="submit"
            disabled={isPending || !turnstileToken}
            className="w-full py-2 rounded-lg text-white disabled:opacity-50 bg-[var(--brand-primary)]"
          >
            {isPending ? 'Processing…' : mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--gray-700)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-[var(--gray-900)]">Or continue with</span>
            </div>
          </div>

          <div id="google-signin-button" className={`mt-4 ${turnstileToken ? 'opacity-100 pointer-events-auto' : 'opacity-50 pointer-events-none'}`}></div>
        </div>

        <p className="mt-4 text-center text-sm text-[var(--gray-500)]">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="hover:underline text-[var(--brand-primary)]"
          >
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
