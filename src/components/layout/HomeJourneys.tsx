import Link from 'next/link';
import { SERVICE_OFFERS, SOLUTION_GUIDES } from '@/content/growthPages';
import CategoryFollowForm from '@/components/features/follow/CategoryFollowForm';

export default function HomeJourneys({ part = 'all' }: { part?: 'paths' | 'guides' | 'all' }) {
  const showPaths = part === 'all' || part === 'paths';
  const showGuides = part === 'all' || part === 'guides';
  return (
    <>
      {showPaths && (
        <section className="py-12 md:py-16 px-4 md:px-6 border-t border-[var(--line)] bg-[var(--ink)]">
          <div className="max-w-7xl mx-auto">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--copper)] mb-3">Two paths</p>
            <h2 className="font-display text-3xl md:text-4xl text-[var(--paper)] mb-8">Find a tool, or get help putting one to work.</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/#tools-section" className="border border-[var(--line)] p-6 hover:border-[var(--copper-dim)]">
                <h3 className="text-xl text-[var(--paper)] mb-2">Discover</h3>
                <p className="text-sm text-[var(--gray-400)]">Search the directory by job, pricing, and sort. Open the official site when a listing fits.</p>
              </Link>
              <Link href="/services" className="border border-[var(--line)] p-6 hover:border-[var(--copper-dim)]">
                <h3 className="text-xl text-[var(--paper)] mb-2">AI services</h3>
                <p className="text-sm text-[var(--gray-400)]">Workflow audit, a scoped implementation, or maintenance of something already running.</p>
              </Link>
            </div>
          </div>
        </section>
      )}

      {showGuides && (
        <>
          <section className="py-12 md:py-16 px-4 md:px-6 border-t border-[var(--line)]">
            <div className="max-w-7xl mx-auto">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--copper)] mb-3">Task guides</p>
              <h2 className="font-display text-3xl text-[var(--paper)] mb-3">Start from the job, not the catalog size.</h2>
              <p className="text-sm text-[var(--gray-400)] max-w-2xl mb-8">
                These guides are selection checklists. They are not evidence that search demand has been measured for each theme.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {SOLUTION_GUIDES.map((guide) => (
                  <Link key={guide.slug} href={`/solutions/${guide.slug}`} className="border border-[var(--line)] p-5 hover:border-[var(--copper-dim)]">
                    <h3 className="text-lg text-[var(--paper)] mb-2">{guide.title}</h3>
                    <p className="text-sm text-[var(--gray-400)]">{guide.task}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="py-12 md:py-16 px-4 md:px-6 border-t border-[var(--line)] bg-[var(--ink)]">
            <div className="max-w-7xl mx-auto">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--copper)] mb-3">Services</p>
              <h2 className="font-display text-3xl text-[var(--paper)] mb-8">Work we can scope from an intake.</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {SERVICE_OFFERS.map((offer) => (
                  <Link key={offer.slug} href={`/services/${offer.slug}`} className="border border-[var(--line)] p-5 hover:border-[var(--copper-dim)]">
                    <h3 className="text-lg text-[var(--paper)] mb-2">{offer.title}</h3>
                    <p className="text-sm text-[var(--gray-400)]">{offer.problem}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="py-12 md:py-16 px-4 md:px-6 border-t border-[var(--line)]">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--copper)] mb-3">Our product</p>
                <h2 className="font-display text-3xl text-[var(--paper)] mb-3">One9 Worker</h2>
                <p className="text-sm text-[var(--gray-400)] mb-4">
                  One9Founders builds One9 Worker, a desktop coworker. Chats and model keys stay on the machine. Ownership is disclosed anywhere it appears next to directory listings.
                </p>
                <Link href="/worker" className="text-sm text-[var(--copper)]">Open the product page</Link>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--copper)] mb-3">Founders</p>
                <h2 className="font-display text-3xl text-[var(--paper)] mb-3">Submit a tool, or follow a topic.</h2>
                <p className="text-sm text-[var(--gray-400)] mb-4">
                  <Link href="/submit" className="text-[var(--copper)]">Submit a tool</Link>
                  {' '}saves the listing before enrichment. Following a topic stores an email. It does not send a digest.
                </p>
                <CategoryFollowForm source="follow-homepage" label="Directory updates" />
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
