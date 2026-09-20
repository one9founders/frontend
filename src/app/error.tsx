'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--gray-black)] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
        Something went wrong
      </h1>
      <p className="text-[var(--gray-400)] max-w-md mb-8">
        We hit a temporary server issue. Try again, or go back to the homepage.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-[var(--brand-primary,#C47A3A)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-[var(--gray-700)] px-5 py-2.5 text-sm font-semibold text-white hover:border-[var(--gray-500)]"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
