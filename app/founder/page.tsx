import Image from "next/image";
import { ArrowRight, BookOpen, Compass, GraduationCap, Target } from "lucide-react";
import { InstituteNav } from "@/components/institute/institute-nav";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Founder & Executive Director",
  "Meet Daksh Shetty, founder of Impact500.",
  "/founder",
);

const timeline = [
  [
    "2023",
    "The question",
    "Began exploring why corporate responsibility disclosures remained difficult for students and the public to compare.",
  ],
  [
    "2024",
    "The framework",
    "Developed a four-pillar model connecting environmental, financial, philanthropic, and ethical performance.",
  ],
  [
    "2025",
    "Impact500 launches",
    "Published the first company research, methodology, and annual assessment.",
  ],
  [
    "2026",
    "A national platform",
    "Expanded coverage to the complete Fortune 500 research universe and introduced interactive intelligence tools.",
  ],
];

export default function FounderPage() {
  return (
    <main>
      <section className="lovable-hero border-b">
        <div className="page-shell pb-20 pt-10">
          <InstituteNav />
          <div className="mt-12 grid items-center gap-12 lg:grid-cols-[.72fr_1.28fr]">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-sky-400/20 bg-panel shadow-2xl shadow-sky-950/40">
              <Image
                src="/images/team/daksh-shetty.jpeg"
                alt="Daksh Shetty, Founder and Executive Director of Impact500"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 420px"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent p-7 pt-24">
                <p className="text-xs uppercase tracking-[.22em] text-cyan">
                  Founder & Executive Director
                </p>
                <h1 className="display mt-2 text-3xl">Daksh Shetty</h1>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.28em] text-emerald-400">
                Leadership
              </p>
              <h2 className="display mt-6 text-5xl leading-[.98] sm:text-7xl">
                Research should make accountability accessible.
              </h2>
              <p className="mt-8 max-w-3xl text-xl leading-9 text-slate-300">
                Impact500 exists to turn fragmented corporate disclosure into evidence people can
                understand, compare, and use.
              </p>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
                Daksh Shetty founded Impact500 at the intersection of business, public policy,
                sustainability, and financial literacy. He directs the institute’s research
                strategy, evaluation framework, publication program, and long-term platform
                development.
              </p>
              <a href="mailto:dshetty2498@gmail.com" className="button-primary mt-8">
                Contact the institute <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
      <div className="page-shell space-y-20">
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            [
              Compass,
              "Mission",
              "Make responsible-business evidence understandable and useful to the public.",
            ],
            [
              BookOpen,
              "Research interests",
              "Corporate responsibility, public policy, governance, sustainability, and economic development.",
            ],
            [
              GraduationCap,
              "Education",
              "An interdisciplinary student researcher pursuing business and public-policy leadership.",
            ],
            [
              Target,
              "Long-term goal",
              "Build a trusted, publicly accessible institution for comparative corporate research.",
            ],
          ].map(([Icon, title, text]) => (
            <article className="premium-card" key={title as string}>
              <Icon className="size-6 text-cyan" />
              <h2 className="mt-7 text-xl font-semibold">{title as string}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">{text as string}</p>
            </article>
          ))}
        </section>
        <section className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="text-xs uppercase tracking-[.2em] text-cyan">Research philosophy</p>
            <h2 className="display mt-5 text-4xl md:text-6xl">Evidence before claims.</h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-slate-300">
            <p>
              Responsible business research should be rigorous without becoming inaccessible.
              Impact500 evaluates every company through the same framework, preserves the source
              trail, and distinguishes verified findings from modeled or pending research.
            </p>
            <p>
              The institute’s vision is not simply to publish rankings. It is to create a durable
              public research infrastructure that helps students, journalists, researchers,
              executives, and policymakers ask better questions.
            </p>
          </div>
        </section>
        <section>
          <p className="text-xs uppercase tracking-[.2em] text-cyan">Development timeline</p>
          <h2 className="display mt-4 text-4xl">Building the institution.</h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-2">
            {timeline.map(([year, title, text]) => (
              <li key={year} className="surface-card">
                <span className="text-sm font-semibold text-cyan">{year}</span>
                <h3 className="mt-4 text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-slate-400">{text}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
