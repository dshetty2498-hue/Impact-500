"use client";

export default function IndustryError({ reset }: { reset: () => void }) {
  return (
    <main className="page-shell">
      <div className="surface-card max-w-2xl" role="alert">
        <h1 className="display text-4xl">Industry data unavailable</h1>
        <p className="mt-4 text-slate-300">
          Industry data is temporarily unavailable. Please try again.
        </p>
        <button type="button" className="button-primary mt-6" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
