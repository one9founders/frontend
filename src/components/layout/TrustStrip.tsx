import { formatToolCount } from '@/lib/constants/stats';

interface TrustStripProps {
  toolCount?: number | null;
  fullyAssessedCount?: number | null;
}

export default function TrustStrip({ toolCount, fullyAssessedCount }: TrustStripProps) {
  const countLabel = formatToolCount(toolCount);
  const assessedLabel =
    fullyAssessedCount != null && fullyAssessedCount > 0 && countLabel
      ? `${fullyAssessedCount.toLocaleString('en-US')} of ${countLabel}`
      : 'A growing subset';

  const cells = [
    {
      title: 'IIT Bombay',
      body: 'Supported with academic mentorship from DSSE.',
      logo: true,
    },
    {
      title: 'Zero affiliate bias',
      body: 'Rankings are never sold. We do not take commissions.',
    },
    {
      title: 'One 10-point scale',
      body: 'Same framework on every fully assessed listing.',
    },
    {
      title: `${assessedLabel} assessed`,
      body: 'Published scores only. Unassessed tools are labeled.',
    },
  ];

  return (
    <section className="border-y border-[var(--line)] bg-[var(--ink)]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x divide-[var(--line)]">
          {cells.map((cell) => (
            <div key={cell.title} className="py-8 lg:px-8 first:lg:pl-0 last:lg:pr-0">
              {'logo' in cell && cell.logo && (
                <img
                  src="/iitb-logo.png"
                  alt=""
                  className="h-7 mb-3"
                  draggable={false}
                />
              )}
              <p className="text-sm font-medium text-[var(--paper)]">{cell.title}</p>
              <p className="text-xs text-[var(--gray-500)] mt-1.5 leading-relaxed">{cell.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
