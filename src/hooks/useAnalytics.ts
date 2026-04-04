'use client';

import posthog from 'posthog-js';

export function useAnalytics() {
  const trackEvent = (event: string, properties?: Record<string, unknown>) => {
    try {
      posthog.capture(event, properties);
    } catch {
    }
  };


  const identify = (userId: string, properties?: Record<string, unknown>) => {
    try {
      posthog.identify(userId, properties);
    } catch {
      // Silently fail
    }
  };


  const reset = () => {
    try {
      posthog.reset();
    } catch {
      // Silently fail
    }
  };

  const captureException = (error: unknown) => {
    try {
      posthog.captureException(error);
    } catch {
      // Silently fail
    }
  };

  return { trackEvent, identify, reset, captureException };
}
