import Link from 'next/link';
import { Tool } from '@/types';
import ToolLogo from '@/components/shared/ToolLogo';
import { allStacks } from '@/components/features/stacks/stackData';

const RELATED_LIMIT = 8;

function stacksForSlug(slug: string) {
  return Object.values(allStacks).filter((stack) =>
    stack.categories.some((category) => category.tools.some((tool) => tool.slug === slug)),
  );
}

export function mergeRelatedTools(tool: Tool, categoryTools: Tool[] = []): Tool[] {
  const seen = new Set<string>([tool.slug]);
  const merged: Tool[] = [];

  for (const candidate of [...(tool.alternatives || []), ...categoryTools]) {
    if (!candidate?.slug || seen.has(candidate.slug)) continue;
    seen.add(candidate.slug);
    merged.push(candidate);
    if (merged.length >= RELATED_LIMIT) break;
  }

  return merged;
}

export default function RelatedTools({
  tool,
  related,
}: {
  tool: Tool;
  related: Tool[];
}) {
  const primaryCategory = tool.categories?.[0];
  const stacks = stacksForSlug(tool.slug);
  const compareHref = related[0]?.slug
    ? `/compare/${tool.slug}-vs-${related[0].slug}`
    : '/compare';

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-white mb-4">
        Alternatives to {tool.name}
      </h2>
      {related.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {related.map((item) => (
            <Link
              key={item.slug}
              href={`/tool/${item.slug}`}
              className="bg-[var(--gray-800)] border border-[var(--gray-700)] rounded-lg p-4 hover:border-copper/50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <ToolLogo logoUrl={item.logo_url} name={item.name} size="sm" />
                <span className="text-white font-medium leading-tight">{item.name}</span>
              </div>
              {item.short_description && (
                <p className="text-[var(--gray-400)] text-sm line-clamp-2">
                  {item.short_description}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-[var(--gray-300)] mb-4">
          Browse other tools in this category while we add more direct alternatives.
        </p>
      )}

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {primaryCategory?.slug && (
          <Link
            href={`/tools/${primaryCategory.slug}`}
            className="text-copper hover:text-copper-bright underline"
          >
            All {primaryCategory.name} tools
          </Link>
        )}
        <Link href={compareHref} className="text-copper hover:text-copper-bright underline">
          Compare {tool.name}
        </Link>
        {stacks.map((stack) => (
          <Link
            key={stack.slug}
            href={`/stacks/${stack.slug}`}
            className="text-copper hover:text-copper-bright underline"
          >
            {stack.title}
          </Link>
        ))}
        <Link href="/methodology" className="text-copper hover:text-copper-bright underline">
          How we rate tools
        </Link>
      </div>
    </div>
  );
}
