/**
 * Shown while a route's chunk is in flight. It mirrors the shape of a typical
 * page (hero band, then a card grid) so the layout doesn't lurch when the real
 * content lands, and it carries the fixed-header offset the pages themselves use.
 */
export default function RouteFallback() {
  return (
    <div className="min-h-screen pt-[100px]" role="status" aria-busy="true">
      <span className="sr-only">Loading page…</span>

      {/* Hero band */}
      <div className="bg-[var(--teal-dark)] px-[var(--container-px)] pb-12 pt-10">
        <div className="mx-auto max-w-[var(--container)]">
          <div className="h-5 w-28 rounded-full bg-white/10" />
          <div className="mt-4 h-9 w-[min(420px,80%)] rounded-[10px] bg-white/15" />
          <div className="mt-3 h-4 w-[min(560px,92%)] rounded-[8px] bg-white/10" />
        </div>
      </div>

      {/* Content grid */}
      <div className="mx-auto max-w-[var(--container)] px-[var(--container-px)] py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-[12px] border border-[var(--border-color)] bg-white"
            >
              <div className="shimmer h-[150px] w-full" />
              <div className="space-y-2.5 p-5">
                <div className="shimmer h-4 w-3/4 rounded-[6px]" />
                <div className="shimmer h-3 w-full rounded-[6px]" />
                <div className="shimmer h-3 w-5/6 rounded-[6px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
