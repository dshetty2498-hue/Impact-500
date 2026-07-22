export default function Loading() {
  return (
    <section className="mx-auto max-w-7xl animate-pulse px-5 py-16">
      <div className="h-4 w-36 rounded bg-white/10" />
      <div className="mt-6 h-16 max-w-2xl rounded bg-white/10" />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div className="h-64 rounded-2xl border border-white/10 bg-panel" key={i} />
        ))}
      </div>
    </section>
  );
}
