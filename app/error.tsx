"use client";
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto max-w-2xl px-5 py-28 text-center">
      <p className="text-cyan">Something went wrong</p>
      <h1 className="display mt-4 text-5xl">The research could not load.</h1>
      <p className="mt-5 text-zinc-400">
        Please try again. If the problem persists, the underlying data source may be temporarily
        unavailable.
      </p>
      {error.digest && <p className="mt-3 text-xs text-zinc-600">Reference: {error.digest}</p>}
      <button onClick={reset} className="focus-ring mt-8 rounded-lg bg-accent px-5 py-3">
        Try again
      </button>
    </section>
  );
}
