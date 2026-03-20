export default function AgentCardSkeleton() {
  return (
    <div className="rounded-xl border border-[var(--gray-800)] bg-[var(--gray-900)] p-4 animate-pulse flex flex-col h-full">
      {/* Header skeleton */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-lg bg-[var(--gray-700)]" />
        <div className="flex-1">
          <div className="h-5 w-32 bg-[var(--gray-700)] rounded mb-2" />
          <div className="h-4 w-24 bg-[var(--gray-700)] rounded-full" />
        </div>
      </div>
      {/* Description skeleton */}
      <div className="space-y-2 mb-3 flex-1">
        <div className="h-3 w-full bg-[var(--gray-700)] rounded" />
        <div className="h-3 w-3/4 bg-[var(--gray-700)] rounded" />
      </div>
      {/* Bottom skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-5 w-14 bg-[var(--gray-700)] rounded-full" />
        <div className="h-5 w-20 bg-[var(--gray-700)] rounded-full" />
        <div className="ml-auto h-1.5 w-16 bg-[var(--gray-700)] rounded-full" />
      </div>
    </div>
  );
}
