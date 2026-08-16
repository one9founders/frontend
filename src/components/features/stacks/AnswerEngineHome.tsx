'use client';

import { useMemo, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import {
  HugeiconsIcon,
  Search01Icon,
  ArrowUpRight01Icon,
  GithubIcon,
  ChartUpIcon,
  Time01Icon,
  ArrowRight01Icon,
} from '@/components/ui/icons';

type TrackId = 'tools' | 'agents' | 'open_source' | 'skills' | 'mcp';
type JobId = 'seo' | 'landing' | 'support';
type CostKind = 'free' | 'skill' | 'yc' | 'paid';

type StackItem = {
  name: string;
  note: string;
  cost: CostKind;
  costLabel: string;
};

type Job = {
  id: JobId;
  chip: string;
  query: string;
  blurb: string;
  cashOut: string;
  lanes: { id: string; label: string; items: StackItem[] }[];
};

const TRACKS: { id: TrackId; label: string; count: string; hint: string }[] = [
  { id: 'tools', label: 'AI Tools', count: '8,420', hint: 'Hosted products' },
  { id: 'open_source', label: 'Open Source', count: '890', hint: 'Self-host, pay nothing' },
  { id: 'agents', label: 'AI Agents', count: '410', hint: 'Act unattended' },
  { id: 'mcp', label: 'MCP Servers', count: '148', hint: 'Tooling for agents' },
  { id: 'skills', label: 'Agent Skills', count: '91', hint: 'SKILL.md packs' },
];

const NEW_THIS_WEEK: {
  name: string;
  note: string;
  date: string;
  source: 'Show HN' | 'GitHub';
  track: TrackId;
  meta: string;
}[] = [
  {
    name: 'marketingskills',
    note: 'Marketing skills for Claude Code and AI agents',
    date: 'Aug 15',
    source: 'Show HN',
    track: 'skills',
    meta: '142 points',
  },
  {
    name: 'playwright-mcp',
    note: 'Browser automation as an MCP server',
    date: 'Aug 14',
    source: 'GitHub',
    track: 'mcp',
    meta: '+1,240 stars',
  },
  {
    name: 'LibreCrawl',
    note: 'Desktop crawler, no seat cost',
    date: 'Aug 13',
    source: 'Show HN',
    track: 'open_source',
    meta: '89 points',
  },
  {
    name: 'Graphify',
    note: 'Knowledge graphs from your own docs',
    date: 'Aug 12',
    source: 'Show HN',
    track: 'open_source',
    meta: '76 points',
  },
  {
    name: 'awesome-claude-skills',
    note: 'Curated SKILL.md index — not an MCP server',
    date: 'Aug 11',
    source: 'GitHub',
    track: 'skills',
    meta: '+890 stars',
  },
  {
    name: 'crewAI 0.80',
    note: 'Multi-agent harness, self-hostable',
    date: 'Aug 11',
    source: 'GitHub',
    track: 'agents',
    meta: '+410 stars',
  },
  {
    name: 'SEOmatic AI',
    note: 'Hosted technical SEO, free tier first',
    date: 'Aug 10',
    source: 'Show HN',
    track: 'tools',
    meta: '54 points',
  },
];

const RANKED: {
  rank: number;
  name: string;
  score: string;
  why: { label: string; value: number }[];
}[] = [
  {
    rank: 1,
    name: 'GitHub Copilot',
    score: '0.77',
    why: [
      { label: 'Domain rank', value: 0.92 },
      { label: 'HN presence', value: 0.81 },
      { label: 'Completeness', value: 0.70 },
    ],
  },
  {
    rank: 2,
    name: 'Claude',
    score: '0.68',
    why: [
      { label: 'Domain rank', value: 0.88 },
      { label: 'HN presence', value: 0.74 },
      { label: 'Completeness', value: 0.62 },
    ],
  },
  {
    rank: 3,
    name: 'Grammarly',
    score: '0.66',
    why: [
      { label: 'Domain rank', value: 0.90 },
      { label: 'HN presence', value: 0.41 },
      { label: 'Completeness', value: 0.78 },
    ],
  },
  {
    rank: 4,
    name: 'Notion AI',
    score: '0.61',
    why: [
      { label: 'Domain rank', value: 0.84 },
      { label: 'HN presence', value: 0.38 },
      { label: 'Completeness', value: 0.71 },
    ],
  },
  {
    rank: 5,
    name: 'Perplexity',
    score: '0.58',
    why: [
      { label: 'Domain rank', value: 0.71 },
      { label: 'HN presence', value: 0.66 },
      { label: 'Completeness', value: 0.49 },
    ],
  },
  {
    rank: 6,
    name: 'Cursor',
    score: '0.57',
    why: [
      { label: 'Domain rank', value: 0.55 },
      { label: 'HN presence', value: 0.79 },
      { label: 'Completeness', value: 0.44 },
    ],
  },
];

const JOBS: Job[] = [
  {
    id: 'seo',
    chip: 'Start SEO for my SaaS',
    query: 'I want to start SEO marketing for my SaaS',
    blurb: 'A working setup for Monday morning. Free first, paid last, Worker only after the job is real.',
    cashOut: '₹0 this week if you self-host. Semrush is covered if you have the YC credit.',
    lanes: [
      {
        id: 'selfhost',
        label: 'Self-host and pay nothing',
        items: [
          { name: 'python-seo-analyzer', note: 'Crawls and audits site structure', cost: 'free', costLabel: 'MIT' },
          { name: 'advertools', note: 'Keyword and SERP analysis in Python', cost: 'free', costLabel: 'MIT' },
          { name: 'LibreCrawl', note: 'Desktop crawler, no seat cost', cost: 'free', costLabel: 'MIT' },
        ],
      },
      {
        id: 'skills',
        label: 'Drop into Claude today',
        items: [
          { name: 'marketingskills', note: 'SEO briefs and content plans', cost: 'skill', costLabel: 'SKILL.md' },
          { name: 'seo-audit', note: 'Structured technical audit pass', cost: 'skill', costLabel: 'SKILL.md' },
        ],
      },
      {
        id: 'hosted',
        label: 'Hosted tools',
        items: [
          { name: 'Google Search Console', note: 'The baseline, always', cost: 'free', costLabel: 'Free' },
          { name: 'Semrush', note: 'Covered by your Startup School stack', cost: 'yc', costLabel: 'YC credit' },
          { name: 'SEOmatic AI', note: 'Only if the above run out', cost: 'paid', costLabel: '₹2,400/mo' },
        ],
      },
      {
        id: 'worker',
        label: 'Run it on autopilot',
        items: [
          { name: 'One9 Worker', note: 'Schedule the audit weekly, get a diff', cost: 'free', costLabel: 'One9' },
        ],
      },
    ],
  },
  {
    id: 'landing',
    chip: 'Ship a landing page this week',
    query: 'I need to launch a landing page this week',
    blurb: 'One page, live, indexable. No agency, no Framer bill unless you choose it.',
    cashOut: '₹0 to ship. Paid builders sit last, after a free stack that already works.',
    lanes: [
      {
        id: 'selfhost',
        label: 'Self-host and pay nothing',
        items: [
          { name: 'Astro', note: 'Static page, ships as HTML', cost: 'free', costLabel: 'MIT' },
          { name: 'Caddy', note: 'HTTPS on a ₹400 VPS', cost: 'free', costLabel: 'Apache-2.0' },
          { name: 'Coolify', note: 'Self-hosted Vercel, one box', cost: 'free', costLabel: 'AGPL' },
        ],
      },
      {
        id: 'skills',
        label: 'Drop into Claude today',
        items: [
          { name: 'frontend-design', note: 'Layout, type, and section structure', cost: 'skill', costLabel: 'SKILL.md' },
          { name: 'copywriting', note: 'Hero, proof, and CTA in one pass', cost: 'skill', costLabel: 'SKILL.md' },
        ],
      },
      {
        id: 'hosted',
        label: 'Hosted tools',
        items: [
          { name: 'Vercel', note: 'Hobby tier covers this page', cost: 'free', costLabel: 'Free tier' },
          { name: 'Cloudflare Pages', note: 'Same job, no card required', cost: 'free', costLabel: 'Free' },
          { name: 'Framer', note: 'Only if you want a visual editor', cost: 'paid', costLabel: '₹1,650/mo' },
        ],
      },
      {
        id: 'worker',
        label: 'Run it on autopilot',
        items: [
          { name: 'One9 Worker', note: 'Weekly Lighthouse + uptime diff', cost: 'free', costLabel: 'One9' },
        ],
      },
    ],
  },
  {
    id: 'support',
    chip: 'Run support without hiring',
    query: 'I want to run customer support without hiring',
    blurb: 'Inbox, triage, and a weekly digest. Human only when the model is stuck.',
    cashOut: 'Chatwoot + a skill is free. Intercom waits until volume forces it.',
    lanes: [
      {
        id: 'selfhost',
        label: 'Self-host and pay nothing',
        items: [
          { name: 'Chatwoot', note: 'Shared inbox you own', cost: 'free', costLabel: 'MIT' },
          { name: 'n8n', note: 'Route tickets, no Zapier seat', cost: 'free', costLabel: 'Fair-code' },
        ],
      },
      {
        id: 'skills',
        label: 'Drop into Claude today',
        items: [
          { name: 'support-triage', note: 'Tag, draft, escalate', cost: 'skill', costLabel: 'SKILL.md' },
          { name: 'help-center', note: 'Turn tickets into docs', cost: 'skill', costLabel: 'SKILL.md' },
        ],
      },
      {
        id: 'hosted',
        label: 'Hosted tools',
        items: [
          { name: 'Crisp', note: 'Free tier for early volume', cost: 'free', costLabel: 'Free tier' },
          { name: 'Plain', note: 'Covered if it is on your YC stack', cost: 'yc', costLabel: 'YC credit' },
          { name: 'Intercom', note: 'Last, and only at scale', cost: 'paid', costLabel: '₹6,200/mo' },
        ],
      },
      {
        id: 'worker',
        label: 'Run it on autopilot',
        items: [
          { name: 'One9 Worker', note: 'Nightly unanswered-ticket digest', cost: 'free', costLabel: 'One9' },
        ],
      },
    ],
  },
];

function costClass(kind: CostKind) {
  if (kind === 'free') return 'bg-emerald-950/80 text-emerald-400';
  if (kind === 'skill') return 'bg-purple-950/80 text-purple-300';
  if (kind === 'yc') return 'bg-amber-950/80 text-amber-400';
  return 'bg-[var(--gray-800)] text-[var(--gray-400)]';
}

function matchJob(raw: string): JobId {
  const q = raw.toLowerCase();
  if (/(land|page|website|site|launch)/.test(q)) return 'landing';
  if (/(support|ticket|inbox|customer)/.test(q)) return 'support';
  return 'seo';
}

export default function AnswerEngineHome() {
  const [query, setQuery] = useState(JOBS[0].query);
  const [jobId, setJobId] = useState<JobId>('seo');
  const [track, setTrack] = useState<TrackId | 'all'>('all');
  const [openRank, setOpenRank] = useState<number>(1);
  const [unmatched, setUnmatched] = useState(false);
  const stackRef = useRef<HTMLElement>(null);
  const job = JOBS.find((j) => j.id === jobId) ?? JOBS[0];

  const news = useMemo(
    () => (track === 'all' ? NEW_THIS_WEEK : NEW_THIS_WEEK.filter((n) => n.track === track)),
    [track],
  );

  const applyJob = (next: Job, typed?: string) => {
    setJobId(next.id);
    setQuery(typed ?? next.query);
    setUnmatched(Boolean(typed && matchJob(typed) === next.id && typed.trim() !== next.query));
    requestAnimationFrame(() => {
      stackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next = JOBS.find((j) => j.id === matchJob(query)) ?? JOBS[0];
    const known = JOBS.some((j) => j.query.toLowerCase() === query.trim().toLowerCase());
    setUnmatched(!known);
    setJobId(next.id);
    requestAnimationFrame(() => {
      stackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <>
      {/* 01 Ask bar */}
      <section className="px-4 pb-10 pt-14 md:px-6 md:pb-14 md:pt-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-purple-400">
            Tell us the job. We assemble the stack.
          </p>
          <form onSubmit={onSubmit}>
            <label htmlFor="job-ask" className="sr-only">
              What do you need to get done?
            </label>
            <div className="flex items-center rounded-2xl border border-[var(--gray-700)] bg-[var(--gray-900)] px-4 py-3.5 focus-within:border-purple-500 md:px-5 md:py-4">
              <HugeiconsIcon icon={Search01Icon} className="mr-3 h-5 w-5 shrink-0 text-[var(--gray-500)]" />
              <input
                id="job-ask"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="I want to start SEO marketing for my SaaS"
                className="min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-[var(--gray-500)] focus:outline-none md:text-lg"
              />
              <button
                type="submit"
                className="ml-3 hidden shrink-0 rounded-lg bg-[var(--brand-primary)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--brand-secondary)] md:inline-flex"
              >
                Assemble
              </button>
            </div>
          </form>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {JOBS.map((j) => (
              <button
                key={j.id}
                type="button"
                onClick={() => applyJob(j)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors md:text-sm ${
                  jobId === j.id
                    ? 'border-purple-500/40 bg-purple-600/20 font-medium text-purple-200'
                    : 'border-[var(--gray-700)] text-[var(--gray-400)] hover:border-[var(--gray-500)] hover:text-[var(--gray-300)]'
                }`}
              >
                {j.chip}
              </button>
            ))}
          </div>
          <p className="mt-5 text-center text-xs text-[var(--gray-500)]">
            9,959 real tools · free-first · dates on everything new
          </p>
        </div>
      </section>

      {/* 05 + 06 Worked stack sits under the ask — the input is the pitch */}
      <section ref={stackRef} className="px-4 pb-12 md:px-6 md:pb-16">
        <div className="mx-auto max-w-3xl md:max-w-5xl">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-purple-400">The answer</p>
          <h2 className="mb-2 text-xl font-bold text-white md:text-2xl">A worked free-first stack</h2>
          <p className="mb-1 max-w-2xl text-sm text-[var(--gray-400)]">{job.blurb}</p>
          {unmatched && (
            <p className="mb-4 max-w-2xl text-xs text-amber-400/90">
              This page currently has three seeded jobs. Typed input maps to the closest one until search fans out
              across tools, repos, skills, and credits.
            </p>
          )}
          <div className="mt-6 overflow-hidden rounded-xl border border-[var(--gray-700)] bg-[var(--gray-900)]">
            <div className="flex items-start gap-2 border-b border-[var(--gray-800)] bg-[var(--gray-950)] px-4 py-3 font-mono text-sm text-[var(--gray-300)]">
              <span className="text-purple-400">▸</span>
              <span>{job.query}</span>
            </div>
            {job.lanes.map((lane) => {
              const isWorker = lane.id === 'worker';
              return (
                <div
                  key={lane.id}
                  className={`border-b border-[var(--gray-800)] px-4 py-5 last:border-b-0 ${
                    isWorker ? 'bg-amber-950/20' : ''
                  }`}
                >
                  <p
                    className={`mb-3 font-mono text-[11px] uppercase tracking-[0.14em] ${
                      isWorker ? 'text-amber-400' : 'text-[var(--gray-500)]'
                    }`}
                  >
                    {isWorker ? 'Then run it · ' : ''}
                    {lane.label}
                  </p>
                  <ul className="space-y-2.5">
                    {lane.items.map((item) => (
                      <li key={item.name} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] tracking-wide ${costClass(item.cost)}`}>
                          {item.costLabel}
                        </span>
                        {isWorker ? (
                          <Link href="/worker" className="text-sm font-semibold text-white hover:text-amber-200">
                            {item.name}
                          </Link>
                        ) : (
                          <span className="text-sm font-semibold text-white">{item.name}</span>
                        )}
                        <span className="text-sm text-[var(--gray-400)]">— {item.note}</span>
                      </li>
                    ))}
                  </ul>
                  {isWorker && (
                    <Link
                      href="/worker"
                      className="mt-4 inline-flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300"
                    >
                      Install Worker, then schedule the job
                      <HugeiconsIcon icon={ArrowUpRight01Icon} className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-start gap-2 text-sm text-[var(--gray-400)]">
            <HugeiconsIcon icon={ChartUpIcon} className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <p>{job.cashOut}</p>
          </div>
        </div>
      </section>

      {/* 02 Track strip */}
      <section className="border-t border-[var(--gray-800)] px-4 py-8 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-3 flex items-end justify-between gap-4">
            <h2 className="text-lg font-bold text-white md:text-xl">Five tracks, not one list</h2>
            <p className="hidden text-xs text-[var(--gray-500)] sm:block">Counts are illustrative, post-backfill</p>
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--gray-800)] bg-[var(--gray-800)] sm:grid-cols-3 lg:grid-cols-5">
            {TRACKS.map((t) => {
              const active = track === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTrack(active ? 'all' : t.id)}
                  className={`px-4 py-4 text-left transition-colors ${
                    active ? 'bg-purple-950/40' : 'bg-[var(--gray-900)] hover:bg-[var(--gray-950)]'
                  }`}
                >
                  <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--gray-500)]">{t.hint}</p>
                  <p className="mt-1 text-sm font-semibold text-white">{t.label}</p>
                  <p className="mt-0.5 font-mono text-lg tabular-nums text-purple-300">{t.count}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 03 New this week */}
      <section className="px-4 py-10 md:px-6 md:py-14">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-purple-400">03 · Discovery</p>
              <h2 className="text-xl font-bold text-white md:text-2xl">New this week</h2>
            </div>
            <p className="text-xs text-[var(--gray-500)]">
              {track === 'all' ? 'Show HN launches and GitHub spikes' : `Filtered to ${TRACKS.find((t) => t.id === track)?.label}`}
            </p>
          </div>
          <ul className="divide-y divide-[var(--gray-800)] rounded-xl border border-[var(--gray-800)] bg-[var(--gray-900)]">
            {news.map((item) => (
              <li key={item.name} className="flex flex-col gap-1 px-4 py-3.5 sm:flex-row sm:items-baseline sm:gap-4">
                <span className="w-16 shrink-0 font-mono text-xs text-[var(--gray-500)]">{item.date}</span>
                <span
                  className={`w-[5.5rem] shrink-0 font-mono text-[10px] uppercase tracking-wide ${
                    item.source === 'Show HN' ? 'text-orange-400' : 'text-[var(--gray-400)]'
                  }`}
                >
                  {item.source === 'GitHub' ? (
                    <span className="inline-flex items-center gap-1">
                      <HugeiconsIcon icon={GithubIcon} className="h-3 w-3" /> GitHub
                    </span>
                  ) : (
                    item.source
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white">
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-[var(--gray-400)]"> — {item.note}</span>
                  </p>
                </div>
                <span className="shrink-0 font-mono text-xs text-[var(--gray-500)]">{item.meta}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-[var(--gray-600)]">
            Dates are the point. If this section is honest, the site is provably alive.
          </p>
        </div>
      </section>

      {/* 04 Top tools, and why */}
      <section className="border-t border-[var(--gray-800)] px-4 py-10 md:px-6 md:py-14">
        <div className="mx-auto max-w-5xl">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-purple-400">04 · Ranking</p>
          <h2 className="mb-2 text-xl font-bold text-white md:text-2xl">Top tools, and why</h2>
          <p className="mb-6 max-w-xl text-sm text-[var(--gray-400)]">
            Copilot 0.77 is a computed score, not a star. Open a row to see domain rank, HN presence, and completeness.
          </p>
          <ol className="overflow-hidden rounded-xl border border-[var(--gray-800)]">
            {RANKED.map((row) => {
              const open = openRank === row.rank;
              return (
                <li key={row.name} className="border-b border-[var(--gray-800)] last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setOpenRank(open ? 0 : row.rank)}
                    className="flex w-full items-center gap-4 bg-[var(--gray-900)] px-4 py-3.5 text-left hover:bg-[var(--gray-950)]"
                  >
                    <span className="w-6 font-mono text-sm text-[var(--gray-500)]">{row.rank}</span>
                    <span className="flex-1 text-sm font-semibold text-white">{row.name}</span>
                    <span className="font-mono text-sm tabular-nums text-purple-300">{row.score}</span>
                  </button>
                  {open && (
                    <div className="grid gap-3 bg-[var(--gray-black)] px-4 py-4 sm:grid-cols-3 sm:px-14">
                      {row.why.map((part) => (
                        <div key={part.label}>
                          <div className="mb-1 flex justify-between font-mono text-[11px] text-[var(--gray-500)]">
                            <span>{part.label}</span>
                            <span className="text-[var(--gray-300)]">{part.value.toFixed(2)}</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--gray-800)]">
                            <div
                              className="h-full rounded-full bg-purple-500"
                              style={{ width: `${Math.round(part.value * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
          <Link
            href="/methodology"
            className="mt-4 inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300"
          >
            How the score is built
            <HugeiconsIcon icon={ArrowRight01Icon} className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      <section className="border-t border-[var(--gray-800)] px-4 py-10 md:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 text-xs text-[var(--gray-600)] sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-1.5">
            <HugeiconsIcon icon={Time01Icon} className="h-3.5 w-3.5" />
            Curated founder stacks still live at{' '}
            <Link href="/stacks" className="text-[var(--gray-500)] underline-offset-2 hover:underline">
              /stacks
            </Link>
            .
          </p>
          <p>Seeded examples until discovery is wired</p>
        </div>
      </section>
    </>
  );
}
