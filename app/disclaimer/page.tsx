import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Disclaimer",
  "Important limitations of Impact500 research.",
  "/disclaimer",
);
export default function Disclaimer() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-wider text-cyan">Legal</p>
      <h1 className="display mt-4 text-5xl">Disclaimer</h1>
      <div className="mt-10 space-y-6 leading-7 text-zinc-400">
        <p>
          Impact500 scores synthesize publicly available evidence and informed research judgment.
          They are directional research tools, not guarantees of company conduct or future
          performance.
        </p>
        <h2 className="text-xl font-semibold text-white">Not professional advice</h2>
        <p>
          Nothing on this site is investment, legal, tax, or compliance advice. Readers should
          verify material facts and consult qualified advisers before making decisions.
        </p>
        <h2 className="text-xl font-semibold text-white">Corrections</h2>
        <p>
          We welcome substantive corrections at research@impact500.org and review new evidence under
          our published methodology.
        </p>
      </div>
    </article>
  );
}
