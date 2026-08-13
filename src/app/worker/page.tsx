import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { generateSEO } from '@/lib/utils/seo';

export const metadata: Metadata = generateSEO({
  title: 'One9 Worker — Local AI Coworker for Founders',
  description:
    'Download One9 Worker, sign in with One9Founders Cloud, and run a local AI coworker. Chats, files, and model keys stay on your machine; One9 only brokers identity and optional connector OAuth.',
  path: '/worker',
  keywords: [
    'One9 Worker',
    'AI coworker',
    'local AI agent',
    'One9Founders Cloud',
    'Gmail AI assistant',
    'privacy-first AI',
    'desktop AI agent',
  ],
});

const STEPS = [
  {
    n: '1',
    title: 'Install One9 Worker',
    body: 'Download for your platform (or build from source), then open the desktop app.',
  },
  {
    n: '2',
    title: 'Sign in with One9Founders',
    body: 'In the app, choose Sign in. Your browser opens One9Founders Cloud (Google). Website login alone is not enough — the desktop completes a secure loopback sign-in.',
  },
  {
    n: '3',
    title: 'Add a model key',
    body: 'Use your own OpenAI (or other) API key, or a local model via Ollama. Keys never leave your machine.',
  },
  {
    n: '4',
    title: 'Connect tools & run a task',
    body: 'One-click Gmail / Calendar / Drive via One9, or paste tokens manually (works signed out). Then ask your coworker to do something real.',
  },
];

const DMG_URL =
  'https://one9founders-openworker-downloads.s3.ap-south-1.amazonaws.com/mac/One9_Worker_0.1.7_aarch64.dmg';

export default function One9WorkerPage() {
  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <Navbar />

      <section className="relative overflow-hidden px-6 pt-20 pb-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(234, 179, 8, 0.18), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(16, 185, 129, 0.12), transparent 50%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium tracking-wide text-amber-400/90 mb-4">
            One9Founders Worker
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
            Your AI coworker.
            <br />
            <span className="text-[var(--gray-300)]">On your machine.</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--gray-300)] max-w-2xl mx-auto mb-10 leading-relaxed">
            One9 Worker is a local-first desktop agent. Sign in with your One9Founders
            account for identity and optional connector OAuth — chats, files, and model
            keys stay on device.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a
              href={DMG_URL}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
            >
              Download for macOS
            </a>
            <a
              href="#setup"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-[var(--gray-600)] text-white hover:bg-[var(--gray-900)] transition-colors"
            >
              Setup guide
            </a>
          </div>
          <p className="mt-4 text-sm text-[var(--gray-500)]">
            macOS (Apple Silicon) · Windows coming soon · Requires a model API key or Ollama
          </p>
        </div>
      </section>

      <section className="px-6 py-16 border-t border-[var(--gray-800)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Privacy by design</h2>
          <p className="text-[var(--gray-300)] mb-8 max-w-2xl">
            This is not “One9 Worker in the browser.” The agent runs locally. One9Founders
            Cloud is only an identity and OAuth broker.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-3">Stays on your device</h3>
              <ul className="space-y-2 text-[var(--gray-400)] text-[15px]">
                <li>Chat transcripts and agent memory</li>
                <li>Files and tool arguments</li>
                <li>Model API keys (OpenAI, etc.)</li>
                <li>Connector tokens after connect</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">One9Founders Cloud may hold</h3>
              <ul className="space-y-2 text-[var(--gray-400)] text-[15px]">
                <li>Your One9 account identity (email / user id)</li>
                <li>Optional managed OAuth metadata for connectors</li>
                <li>Content-free telemetry if you leave it on (opt-out in app)</li>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-sm text-[var(--gray-500)]">
            See also our sitewide{' '}
            <Link href="/privacy" className="text-amber-400/90 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>

      <section id="setup" className="px-6 py-16 border-t border-[var(--gray-800)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            From download to first task
          </h2>
          <ol className="space-y-6">
            {STEPS.map((s) => (
              <li key={s.n} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-500/40 text-amber-400 font-semibold text-sm">
                  {s.n}
                </span>
                <div>
                  <h3 className="text-white font-semibold mb-1">{s.title}</h3>
                  <p className="text-[var(--gray-400)] text-[15px] leading-relaxed">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-6 py-16 border-t border-[var(--gray-800)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Download</h2>
          <p className="text-[var(--gray-300)] mb-6">
            This build is One9-configured — One9Founders Cloud sign-in works out of the box,
            no config editing needed. It&apos;s currently unsigned, so macOS Gatekeeper will
            warn on first launch: right-click the app → <strong className="text-white">Open</strong>{' '}
            to proceed once.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={DMG_URL}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[var(--gray-900)] border border-[var(--gray-700)] text-white hover:border-amber-500/50 transition-colors"
            >
              macOS (Apple Silicon) .dmg
            </a>
            <a
              href="https://github.com/andrewyng/openworker"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-[var(--gray-700)] text-[var(--gray-300)] hover:text-white transition-colors"
            >
              View source on GitHub
            </a>
          </div>
          <p className="mt-3 text-sm text-[var(--gray-500)]">
            One9 Worker is built on{' '}
            <a
              href="https://github.com/andrewyng/openworker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400/90 hover:underline"
            >
              OpenWorker
            </a>
            , an open-source project by Andrew Ng — full credit to the original authors.
          </p>
          <div className="mt-10 p-5 rounded-xl border border-[var(--gray-700)] bg-[var(--gray-900)]/60">
            <h3 className="text-white font-semibold mb-2">Already installed?</h3>
            <p className="text-[var(--gray-400)] text-[15px] mb-3">
              Open One9 Worker → Account → Sign in. You should see{' '}
              <strong className="text-white font-medium">One9Founders Cloud</strong>, not
              OpenWorker Cloud.
            </p>
            <p className="text-sm text-[var(--gray-500)]">
              Dev tip: set <code className="text-[var(--gray-400)]">cloud_base_url</code> to{' '}
              <code className="text-[var(--gray-400)]">https://api.one9founders.com</code> (or{' '}
              <code className="text-[var(--gray-400)]">http://127.0.0.1:8000</code> locally).
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
