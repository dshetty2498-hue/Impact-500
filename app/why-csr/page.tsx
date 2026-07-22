import { SectionTitle } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Why CSR & ESG",
  "Why responsible corporate performance matters to people, markets, and communities.",
  "/why-csr",
);
export default function WhyCsr() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <SectionTitle
        eyebrow="The case for accountability"
        title={
          <>
            The choices companies make
            <br />
            shape our <em className="text-cyan">shared future.</em>
          </>
        }
        text="CSR and ESG are not a parallel agenda. They are a way to see operational decisions in their full human and environmental context."
      />
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {[
          [
            "People",
            "Workplace practices, product safety, and community investment are core to durable value.",
          ],
          [
            "Planet",
            "Credible climate action means measured progress across operations and supply chains.",
          ],
          [
            "Trust",
            "Transparent governance helps stakeholders understand who is accountable—and how.",
          ],
        ].map(([title, text], i) => (
          <article key={title} className="rounded-2xl border bg-panel p-7">
            <span className="text-xs text-cyan">0{i + 1}</span>
            <h2 className="mt-10 text-2xl font-semibold">{title}</h2>
            <p className="mt-3 leading-7 text-zinc-400">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
