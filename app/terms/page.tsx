import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Terms of Use",
  "Terms governing use of Impact500 research and services.",
  "/terms",
);
export default function Terms() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-wider text-cyan">Legal</p>
      <h1 className="display mt-4 text-5xl">Terms of Use</h1>
      <div className="mt-10 space-y-6 leading-7 text-zinc-400">
        <p>
          By using Impact500, you agree to use its research lawfully and to preserve attribution
          when referencing published analysis.
        </p>
        <h2 className="text-xl font-semibold text-white">Research license</h2>
        <p>
          Content is provided for personal, educational, and internal business use. Republishing
          substantial portions requires written permission.
        </p>
        <h2 className="text-xl font-semibold text-white">Availability</h2>
        <p>
          We may revise scores, correct findings, or change service availability as evidence and
          research standards evolve.
        </p>
      </div>
    </article>
  );
}
