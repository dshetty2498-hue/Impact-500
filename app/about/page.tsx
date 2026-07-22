import { SectionTitle } from "@/components/ui/primitives";
import { team } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "About",
  "Meet the independent research institute behind Impact500.",
  "/about",
);
export default function About() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <SectionTitle
        eyebrow="About Impact500"
        title={
          <>
            Clarity is a public
            <br />
            <em className="text-cyan">good.</em>
          </>
        }
        text="We are an independent research institute making corporate responsibility more legible to everyone affected by it."
      />
      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border bg-panel p-8">
          <p className="text-xs uppercase tracking-wider text-cyan">Our mission</p>
          <h2 className="mt-6 text-3xl font-semibold">Evidence that changes the conversation.</h2>
          <p className="mt-5 leading-7 text-zinc-400">
            Impact500 translates thousands of public signals into research that is clear enough to
            use and rigorous enough to trust.
          </p>
        </article>
        <article className="rounded-2xl border bg-panel p-8">
          <p className="text-xs uppercase tracking-wider text-cyan">Research timeline</p>
          <ol className="mt-6 space-y-5">
            {[
              ["2013", "Institute founded"],
              ["2018", "First cross-industry index"],
              ["2022", "Evidence framework expanded"],
              ["2025", "Impact500 index released"],
            ].map(([year, event]) => (
              <li className="flex gap-5" key={year}>
                <span className="text-cyan">{year}</span>
                <span className="text-zinc-300">{event}</span>
              </li>
            ))}
          </ol>
        </article>
      </div>
      <h2 className="mt-16 text-2xl font-semibold">Meet the team</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <article id={member.slug} className="rounded-2xl border p-6" key={member.slug}>
            <div className="grid size-12 place-items-center rounded-full bg-accent/20 text-lg text-cyan">
              {member.name[0]}
            </div>
            <h3 className="mt-5 font-semibold">{member.name}</h3>
            <p className="mt-1 text-sm text-zinc-400">{member.role}</p>
            <p className="mt-4 text-sm leading-6 text-zinc-500">{member.bio}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
