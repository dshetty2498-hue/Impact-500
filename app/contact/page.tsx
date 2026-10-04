import { Mail, MessageSquare, Newspaper, Users } from "lucide-react";
import { ContactForm } from "@/components/impact/contact-form";
import { pageMetadata } from "@/lib/metadata";
import { SectionTitle } from "@/components/ui/primitives";

export const metadata = pageMetadata(
  "Contact",
  "Contact the Impact500 research institute.",
  "/contact",
);

export default function ContactPage() {
  return (
    <main className="page-shell">
      <SectionTitle
        eyebrow="Contact the institute"
        title={
          <>
            Start a serious <em className="text-cyan">conversation.</em>
          </>
        }
        text="Research questions, data corrections, media requests, educational use, and thoughtful partnerships are welcome."
      />
      <section className="mt-14 grid gap-6 lg:grid-cols-[.7fr_1.3fr]">
        <div className="space-y-5">
          {[
            [Mail, "Research desk", "dshetty2498@gmail.com"],
            [Newspaper, "Media inquiries", "Interviews, citations, and methodology context"],
            [Users, "Partnerships", "Education, research, and public-interest collaboration"],
            [MessageSquare, "Corrections", "Source updates and evidence-based review requests"],
          ].map(([Icon, title, text]) => (
            <article key={String(title)} className="surface-card">
              <Icon className="size-5 text-cyan" />
              <h2 className="mt-5 font-semibold">{String(title)}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{String(text)}</p>
            </article>
          ))}
        </div>
        <article className="surface-card">
          <p className="mb-7 text-xs uppercase tracking-[.2em] text-cyan">Send an inquiry</p>
          <ContactForm />
        </article>
      </section>
    </main>
  );
}
