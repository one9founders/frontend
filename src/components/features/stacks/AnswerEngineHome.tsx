'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HugeiconsIcon, Search01Icon, Time01Icon } from '@/components/ui/icons';
import {
  assembleJobStack,
  readRecentStacks,
  rememberRecentStack,
  type RecentStack,
} from '@/lib/api/jobStack';

const EXAMPLE_JOBS = [
  'I want to start SEO marketing for my SaaS',
  'I need to launch a landing page this week',
  'I want to run customer support without hiring',
];

export default function AnswerEngineHome() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recent, setRecent] = useState<RecentStack[]>([]);

  useEffect(() => {
    setRecent(readRecentStacks());
  }, []);

  const run = async (job: string) => {
    const next = job.trim();
    if (!next || loading) return;
    setQuery(next);
    setError('');
    setLoading(true);
    try {
      const stack = await assembleJobStack(next);
      rememberRecentStack(stack);
      router.push(`/stack/${stack.public_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not assemble a stack.');
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void run(query);
  };

  return (
    <>
      <section className="px-4 pb-10 pt-14 md:px-6 md:pb-14 md:pt-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-copper">
            Tell us the job. We assemble the stack.
          </p>
          <form onSubmit={onSubmit}>
            <label htmlFor="job-ask" className="sr-only">
              What do you need to get done?
            </label>
            <div className="flex items-center rounded-2xl border border-[var(--gray-700)] bg-[var(--gray-900)] px-4 py-3.5 focus-within:border-copper md:px-5 md:py-4">
              <HugeiconsIcon icon={Search01Icon} className="mr-3 h-5 w-5 shrink-0 text-[var(--gray-500)]" />
              <input
                id="job-ask"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="I want to start SEO marketing for my SaaS"
                disabled={loading}
                className="min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-[var(--gray-500)] focus:outline-none disabled:opacity-60 md:text-lg"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="ml-3 hidden shrink-0 rounded-lg bg-[var(--brand-primary)] px-3 py-1.5 text-sm font-medium text-[var(--ink)] hover:bg-[var(--brand-secondary)] disabled:opacity-50 md:inline-flex"
              >
                {loading ? 'Assembling…' : 'Assemble'}
              </button>
            </div>
          </form>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {EXAMPLE_JOBS.map((job) => (
              <button
                key={job}
                type="button"
                disabled={loading}
                onClick={() => void run(job)}
                className="rounded-full border border-[var(--gray-700)] px-3 py-1.5 text-xs text-[var(--gray-400)] hover:border-[var(--gray-500)] hover:text-[var(--gray-300)] disabled:opacity-50 md:text-sm"
              >
                {job.replace(/^I (want to |need to )/, '')}
              </button>
            ))}
          </div>
          {error && (
            <p className="mt-4 text-center text-sm text-amber-400">{error}</p>
          )}
          {loading && (
            <p className="mt-4 text-center text-sm text-[var(--gray-400)]">
              Searching the catalog, then saving a stack you can come back to.
            </p>
          )}
          <p className="mt-5 text-center text-xs text-[var(--gray-500)]">
            Built from live tools, not a canned list. Every stack gets a URL.
          </p>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="border-t border-[var(--gray-800)] px-4 py-10 md:px-6">
          <div className="mx-auto max-w-3xl">
            <p className="mb-1 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-copper">
              <HugeiconsIcon icon={Time01Icon} className="h-3.5 w-3.5" />
              Return to a stack
            </p>
            <h2 className="mb-4 text-lg font-bold text-white">Recent on this device</h2>
            <ul className="divide-y divide-[var(--gray-800)] overflow-hidden rounded-xl border border-[var(--gray-800)] bg-[var(--gray-900)]">
              {recent.map((stack) => (
                <li key={stack.public_id}>
                  <Link
                    href={`/stack/${stack.public_id}`}
                    className="block px-4 py-3 hover:bg-[var(--gray-950)]"
                  >
                    <p className="text-sm font-semibold text-white">{stack.title}</p>
                    <p className="mt-0.5 truncate text-xs text-[var(--gray-500)]">{stack.query}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="border-t border-[var(--gray-800)] px-4 py-10 md:px-6">
        <div className="mx-auto max-w-3xl text-xs text-[var(--gray-600)]">
          The agent picks only from the One9 catalog. People can save an edited copy from any stack page.
          Curated profiles still live at{' '}
          <Link href="/stacks" className="text-[var(--gray-500)] underline-offset-2 hover:underline">
            /stacks
          </Link>
          .
        </div>
      </section>
    </>
  );
}
