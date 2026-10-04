import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  HandCoins,
  Leaf,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { SectionTitle } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Sustainable Investing",
  "A practical introduction to sustainable investing, ESG approaches, metrics, benefits, and limitations.",
  "/sustainable-investing",
);

const approaches = [
  [
    "ESG Investing",
    "Integrates environmental, social, and governance information into financial analysis and security selection.",
  ],
  [
    "Socially Responsible Investing",
    "Uses values-based screens to include or exclude companies, industries, or activities.",
  ],
  [
    "Impact Investing",
    "Seeks measurable positive environmental or social outcomes alongside a financial return.",
  ],
  [
    "Thematic Investing",
    "Targets long-term themes such as clean energy, water, circular production, or inclusive finance.",
  ],
  [
    "Shareholder Engagement",
    "Uses voting, dialogue, and proposals to encourage stronger governance and operating practices.",
  ],
];
const metrics = [
  "Carbon emissions",
  "Board independence",
  "Employee safety",
  "Workforce diversity",
  "Governance controls",
  "Business ethics",
  "Supply-chain standards",
  "Community investment",
];
const faqs = [
  [
    "Is sustainable investing the same as ESG investing?",
    "ESG investing is one approach within sustainable investing. The broader field also includes screening, impact investing, thematic strategies, and shareholder engagement.",
  ],
  [
    "Does a strong ESG score guarantee strong investment returns?",
    "No. Responsibility indicators can inform risk analysis, but they do not guarantee performance and should be considered with valuation, strategy, competition, and financial fundamentals.",
  ],
  [
    "What is greenwashing?",
    "Greenwashing occurs when environmental or social claims create a stronger impression than the underlying evidence supports. Investors should examine definitions, baselines, targets, progress, and independent assurance.",
  ],
  [
    "Why do ESG ratings disagree?",
    "Providers may use different scopes, sources, weights, materiality judgments, and methods. Comparing the methodology is as important as comparing the final score.",
  ],
  [
    "How can a beginner evaluate a company?",
    "Start with annual reports, regulatory filings, sustainability disclosures, governance documents, and credible third-party evidence. Look for consistent metrics and transparent discussion of limitations.",
  ],
];

export default function SustainableInvestingPage() {
  return (
    <main className="page-shell">
      <SectionTitle
        eyebrow="Educational resource"
        title="Sustainable Investing"
        text="A practical framework for understanding how environmental, social, governance, and financial-responsibility evidence can inform long-term investment research."
      />
      <section className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <article className="surface-card">
          <Leaf className="size-7 text-emerald-400" />
          <h2 className="display mt-6 text-4xl">What is sustainable investing?</h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Sustainable investing considers how a company creates financial value while managing its
            effects on people, institutions, and the environment. It supplements traditional
            analysis with evidence about governance, resilience, workforce practices, environmental
            exposure, ethics, and stakeholder relationships.
          </p>
          <p className="mt-4 leading-7 text-slate-400">
            The objective is not to replace financial analysis or label every company as good or
            bad. It is to identify material risks, opportunities, incentives, and operating
            practices that may affect durable value creation.
          </p>
        </article>
        <article className="premium-card">
          <ShieldCheck className="size-7 text-cyan" />
          <h2 className="mt-6 text-2xl font-semibold">Why it matters</h2>
          <ul className="mt-5 space-y-3 text-slate-300">
            {[
              "Long-term investing and resilience",
              "Risk management and governance",
              "Environmental and social impact",
              "Corporate responsibility and accountability",
              "More complete investment research",
            ].map((item) => (
              <li className="flex gap-3" key={item}>
                <CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-400" />
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>
      <section className="mt-16">
        <p className="text-xs uppercase tracking-[.2em] text-cyan">Approaches</p>
        <h2 className="display mt-4 text-4xl">Types of sustainable investing</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {approaches.map(([title, text]) => (
            <article className="premium-card" key={title}>
              <HandCoins className="size-6 text-cyan" />
              <h3 className="mt-6 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mt-16 grid gap-6 lg:grid-cols-2">
        <article className="surface-card">
          <CheckCircle2 className="size-6 text-emerald-400" />
          <h2 className="display mt-5 text-3xl">Potential benefits</h2>
          <ul className="mt-6 grid gap-3 text-slate-300">
            {[
              "Long-term value creation",
              "Earlier identification of operational risk",
              "Greater corporate accountability",
              "Improved disclosure and transparency",
              "Innovation around products and processes",
            ].map((item) => (
              <li className="rounded-xl border bg-white/[.025] p-4" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </article>
        <article className="surface-card">
          <CircleAlert className="size-6 text-amber-400" />
          <h2 className="display mt-5 text-3xl">Challenges and limitations</h2>
          <ul className="mt-6 grid gap-3 text-slate-300">
            {[
              "Greenwashing and unsupported claims",
              "Different ESG standards and rating methods",
              "Incomplete or inconsistent data",
              "Measurement and attribution difficulties",
              "Material differences between industries",
            ].map((item) => (
              <li className="rounded-xl border bg-white/[.025] p-4" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>
      <section className="mt-16">
        <p className="text-xs uppercase tracking-[.2em] text-cyan">Evidence</p>
        <h2 className="display mt-4 text-4xl">Common ESG metrics</h2>
        <div className="mt-7 flex flex-wrap gap-3">
          {metrics.map((metric) => (
            <span
              className="rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-200"
              key={metric}
            >
              {metric}
            </span>
          ))}
        </div>
      </section>
      <section className="mt-16">
        <Scale className="size-7 text-cyan" />
        <h2 className="display mt-5 text-4xl">Frequently asked questions</h2>
        <div className="mt-8 grid gap-4">
          {faqs.map(([question, answer]) => (
            <details
              className="group rounded-2xl border bg-panel p-6 open:border-cyan/30"
              key={question}
            >
              <summary className="cursor-pointer font-semibold">{question}</summary>
              <p className="mt-4 max-w-4xl leading-7 text-slate-400">{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="grid-bg mt-16 rounded-[2rem] border bg-accent/10 p-8 md:p-12">
        <p className="text-xs uppercase tracking-[.2em] text-cyan">Related research</p>
        <h2 className="display mt-4 text-4xl">Continue exploring the evidence.</h2>
        <div className="mt-8 flex flex-wrap gap-3">
          {[
            ["Methodology", "/methodology"],
            ["Industry Intelligence", "/industry-intelligence"],
            ["Company Profiles", "/leaderboard"],
            ["Research Reports", "/publications"],
            ["Annual Report", "/research/impact-horizon-2026"],
          ].map(([label, href]) => (
            <Link className="button-secondary" href={href} key={href}>
              {label}
              <ArrowRight className="size-4" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
