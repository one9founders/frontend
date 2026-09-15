import type { AssessmentDetail, CriterionAssessment } from '@/types';

const CRITERION_ORDER = [
  'security_privacy',
  'functionality',
  'ease_of_use',
  'pricing_value',
  'reliability',
  'integrations',
  'support',
  'company_stability',
  'update_frequency',
  'startup_friendliness',
] as const;

const FALLBACK_NAMES: Record<string, string> = {
  security_privacy: 'Security & Data Privacy',
  functionality: 'Functionality & Features',
  ease_of_use: 'Ease of Use',
  pricing_value: 'Pricing & Value',
  reliability: 'Reliability & Performance',
  integrations: 'Integration Capabilities',
  support: 'Customer Support',
  company_stability: 'Company Stability',
  update_frequency: 'Update Frequency',
  startup_friendliness: 'Startup-Friendliness',
};

interface ToolCriteriaListProps {
  detail?: AssessmentDetail | null;
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export default function ToolCriteriaList({ detail }: ToolCriteriaListProps) {
  const criteria = detail?.criteria;
  if (!criteria || Object.keys(criteria).length === 0) {
    return null;
  }

  const ids = CRITERION_ORDER.filter((id) => id in criteria);
  const extra = Object.keys(criteria).filter(
    (id) => !CRITERION_ORDER.includes(id as (typeof CRITERION_ORDER)[number])
  );

  return (
    <section className="tool-section">
      <p className="tool-section-label">Methodology</p>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--paper)] mb-3 leading-tight">
        How this score was built
      </h2>
      <p className="text-[var(--gray-500)] text-sm mb-6 max-w-2xl leading-relaxed">
        Each scored criterion links to the published page it was derived from.
        Unscored criteria are marked, not guessed.
        {detail?.hands_on
          ? ' This listing includes hands-on testing.'
          : ' This listing has not been hands-on tested.'}
      </p>
      <ul className="space-y-3">
        {[...ids, ...extra].map((id) => {
          const entry = criteria[id] as CriterionAssessment;
          const name = entry?.name || FALLBACK_NAMES[id] || id;
          const score = entry?.score;
          const url = entry?.evidence_url;
          return (
            <li
              key={id}
              className="rounded-xl border border-[var(--line)] bg-[var(--ink-2)]/80 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[var(--paper)] font-medium">{name}</p>
                  {entry?.reasoning && (
                    <p className="text-[var(--gray-400)] text-sm mt-1 leading-relaxed">
                      {entry.reasoning}
                    </p>
                  )}
                  {url && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-copper hover:text-copper-bright text-sm underline mt-1 inline-block"
                    >
                      Source: {hostname(url)}
                    </a>
                  )}
                </div>
                <span
                  className={`flex-shrink-0 text-sm font-medium tabular-nums ${
                    score == null ? 'text-[var(--gray-500)]' : 'text-copper-bright'
                  }`}
                >
                  {score == null ? 'Not assessed' : `${score}/10`}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
