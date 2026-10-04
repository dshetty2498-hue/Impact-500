export default function IndustryLoading() {
  return (
    <main className="page-shell" aria-busy="true" aria-live="polite">
      <p className="text-sm text-cyan">Loading industry data...</p>
      <div className="mt-8 h-16 max-w-xl animate-pulse rounded-xl bg-white/[.06]" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-xl border bg-white/[.03]" />
        ))}
      </div>
    </main>
  );
}
