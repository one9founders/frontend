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
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-white mb-2">How this score was built</h2>
      <p className="text-[var(--gray-500)] text-sm mb-4">
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
              className="bg-[var(--gray-800)] rounded-lg p-4 border border-[var(--gray-700)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-white font-medium">{name}</p>
                  {entry?.reasoning && (
                    <p className="text-[var(--gray-400)] text-sm mt-1">{entry.reasoning}</p>
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
                  className={`flex-shrink-0 text-sm font-medium ${
                    score == null ? 'text-[var(--gray-500)]' : 'text-white'
                  }`}
                >
                  {score == null ? 'Not assessed' : `${score}/10`}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
