'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth';

export default function EditListingLoginPrompt({ slug }: { slug: string }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let cancelled = false;
    const check = async () => {
      const user = await getCurrentUser();
      if (!cancelled && user) router.refresh();
    };
    const interval = window.setInterval(check, 1500);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [router]);

  return (
    <section className="py-24 px-6">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Edit your listing</h1>
        <p className="text-[var(--gray-400)] mb-8">
          Log in with the same email you used to submit this tool. We will open the editor
          for that listing.
        </p>
        {mounted && (
          <button
            type="button"
            className="btn-primary px-6 py-3"
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent('open-auth-modal', { detail: { mode: 'login' } })
              );
            }}
          >
            Log in to edit
          </button>
        )}
        <p className="text-sm text-[var(--gray-500)] mt-6">
          After you log in, stay on this page or open{' '}
          <a href={`/tool/${slug}`} className="text-copper hover:underline">
            the public listing
          </a>{' '}
          and choose Edit listing.
        </p>
      </div>
    </section>
  );
}
