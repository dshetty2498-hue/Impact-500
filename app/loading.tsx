export default function Loading() {
  return (
    <section className="page-shell animate-pulse">
      <span className="sr-only">Loading Impact500 content</span>
      <div className="h-4 w-36 rounded-full bg-white/10" />
      <div className="mt-6 h-16 max-w-2xl rounded-xl bg-white/10" />
      <div className="mt-5 h-6 max-w-xl rounded-lg bg-white/[.07]" />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-panel" key={i}>
            <div className="h-36 bg-white/[.06]" />
            <div className="space-y-3 p-6"><div className="h-4 w-24 rounded bg-white/10" /><div className="h-6 w-4/5 rounded bg-white/10" /><div className="h-4 w-full rounded bg-white/[.06]" /></div>
          </div>
        ))}
      </div>
    </section>
  );
}
