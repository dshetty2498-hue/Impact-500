import {
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  Eye,
  FileSearch,
  Globe2,
  Leaf,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { InstituteNav } from "@/components/institute/institute-nav";
import { Newsletter } from "@/components/site/newsletter";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "About Impact500",
  "Corporate responsibility research for the modern economy.",
  "/about",
);

const pillars = [
  [Leaf, "Environmental Responsibility", "Assessment of sustainability initiatives, climate strategy, renewable energy adoption, emissions reduction, resource management, and environmental innovation."],
  [BarChart3, "Financial Responsibility", "Evaluation of governance practices, financial transparency, accountability, long-term value creation, and responsible corporate management."],
  [Users, "Philanthropy & Community", "Analysis of charitable giving, employee engagement, educational partnerships, community investment, and broader social impact."],
  [Scale, "Ethics & Corporate Conduct", "Assessment of labor practices, corporate governance, supply chain responsibility, regulatory compliance, business ethics, diversity initiatives, and organizational integrity."],
] as const;

const principles = [
  [Eye, "Transparency", "Our methodology, evaluation framework, and research process are publicly documented to promote openness and accountability."],
  [BookOpenCheck, "Consistency", "Every company is evaluated using the same standardized framework to ensure fair comparisons across industries."],
  [ShieldCheck, "Evidence-Based Analysis", "All assessments are grounded in publicly available information and objective evaluation criteria."],
  [Sparkles, "Continuous Improvement", "Our methodology continues to evolve alongside changes in corporate reporting standards, sustainability practices, and responsible business frameworks."],
] as const;

const sources = ["Annual Reports", "Sustainability Reports", "Corporate Responsibility Reports", "SEC Filings", "Public Corporate Disclosures", "Regulatory Filings", "Independent Research", "Industry Publications"];
const outlook = ["Expanding evaluations to all Fortune 500 companies", "Publishing annual corporate responsibility reports", "Enhancing data visualization and benchmarking tools", "Developing additional educational resources", "Improving research transparency", "Building one of the most comprehensive publicly accessible corporate responsibility databases available"];

export default function About() {
  return (
    <main>
      <section className="lovable-hero border-b">
        <div className="page-shell pb-20 pt-10">
          <InstituteNav />
          <p className="mt-16 text-xs font-semibold uppercase tracking-[.3em] text-emerald-400">About Impact500</p>
          <h1 className="display mt-6 max-w-5xl text-5xl leading-[.98] sm:text-7xl lg:text-[5.4rem]">Corporate Responsibility Research for the Modern Economy.</h1>
          <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">Impact500 is an independent corporate responsibility research platform dedicated to evaluating the social, environmental, ethical, and governance performance of America&apos;s largest companies.</p>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-400">Through transparent research, standardized evaluation criteria, and data-driven analysis, Impact500 transforms complex corporate disclosures into accessible insights that help users better understand how businesses create value beyond financial performance.</p>
        </div>
      </section>

      <div className="page-shell space-y-24">
        <section className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <div><p className="text-xs font-semibold uppercase tracking-[.24em] text-cyan">Our story</p><h2 className="display mt-5 text-4xl md:text-6xl">Why Impact500 exists.</h2></div>
          <div className="space-y-6 text-lg leading-8 text-slate-300">
            <p>Corporate responsibility has become one of the defining issues facing modern business. Every year, companies publish thousands of pages of sustainability reports, annual reports, ESG disclosures, governance documents, and community impact initiatives. While this information is publicly available, it is often difficult to compare, inconsistent across organizations, and inaccessible to many students, researchers, and the general public.</p>
            <p>Impact500 was created to address this challenge.</p>
            <p>The platform brings together publicly available corporate responsibility information into one structured, research-driven experience. By evaluating companies through a consistent methodology, Impact500 allows users to explore corporate responsibility in a way that is transparent, educational, and easy to understand.</p>
            <p>More than a ranking platform, Impact500 serves as a research initiative dedicated to improving public understanding of responsible business practices and encouraging greater corporate transparency.</p>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <article className="premium-card"><p className="text-xs uppercase tracking-[.2em] text-cyan">Our mission</p><h2 className="display mt-5 text-4xl">Make responsibility legible.</h2><p className="mt-6 text-lg leading-8 text-slate-300">To improve transparency around corporate responsibility by developing an accessible research platform that transforms complex corporate disclosures into clear, consistent, and evidence-based insights.</p></article>
          <article className="premium-card"><p className="text-xs uppercase tracking-[.2em] text-cyan">Our vision</p><h2 className="display mt-5 text-4xl">Build a trusted public resource.</h2><p className="mt-6 text-lg leading-8 text-slate-300">To become one of the leading independent educational resources for corporate responsibility research, helping students, researchers, business leaders, policymakers, and the public better understand how companies create long-term value through responsible business practices.</p></article>
        </section>

        <section><SectionHeading eyebrow="What we evaluate" title="Four pillars of responsible performance." text="Every company is evaluated across four core pillars that represent the foundation of responsible corporate performance." /><div className="mt-12 grid gap-5 md:grid-cols-2">{pillars.map(([Icon, title, text]) => <article key={title} className="surface-card"><span className="grid size-12 place-items-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan"><Icon className="size-6" /></span><h3 className="mt-7 text-2xl font-semibold">{title}</h3><p className="mt-4 leading-7 text-slate-400">{text}</p></article>)}</div></section>

        <section className="grid gap-10 lg:grid-cols-[1fr_.85fr]"><div><SectionHeading eyebrow="Research methodology" title="Public evidence, structured consistently." text="Impact500 utilizes a structured evaluation framework based entirely on publicly available information. Every company is evaluated using a consistent methodology designed to maximize transparency, fairness, and comparability across industries." /></div><div className="surface-card"><p className="text-xs uppercase tracking-[.2em] text-cyan">Research incorporates</p><ul className="mt-6 grid gap-3 sm:grid-cols-2">{sources.map((source) => <li key={source} className="flex items-center gap-3 rounded-xl border bg-ink/45 p-4 text-sm text-slate-300"><FileSearch className="size-4 shrink-0 text-cyan" />{source}</li>)}</ul></div></section>

        <section><SectionHeading eyebrow="Research principles" title="The standards behind every assessment." /><div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{principles.map(([Icon, title, text]) => <article key={title} className="premium-card"><Icon className="size-6 text-cyan" /><h3 className="mt-8 text-xl font-semibold">{title}</h3><p className="mt-4 leading-7 text-slate-400">{text}</p></article>)}</div></section>

        <section className="grid-bg overflow-hidden rounded-[2rem] border bg-elevated/70 p-8 md:p-12"><SectionHeading eyebrow="Impact500 at a glance" title="Research built for public understanding." /><div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-white/10 lg:grid-cols-3">{[["200+", "Companies evaluated"], ["2,000+", "Responsibility data points"], ["15+", "Industries covered"], ["25 years", "Historical trend analysis"], ["4", "Core CSR pillars"], ["Open", "Research methodology"]].map(([value, label]) => <div key={label} className="bg-panel/95 p-6 md:p-8"><strong className="display text-3xl text-white md:text-5xl">{value}</strong><span className="mt-3 block text-sm text-slate-400">{label}</span></div>)}</div></section>

        <section className="grid gap-8 lg:grid-cols-[.65fr_1.35fr]"><div className="grid-bg flex min-h-80 items-end rounded-[2rem] border bg-gradient-to-br from-sky-500/20 to-panel p-8"><div><span className="grid size-16 place-items-center rounded-2xl bg-sky-500 text-2xl font-bold">DS</span><p className="mt-6 text-xs uppercase tracking-[.2em] text-cyan">Founder</p><h2 className="display mt-3 text-4xl">Daksh Shetty</h2></div></div><article className="surface-card p-8 md:p-12"><p className="text-xs uppercase tracking-[.2em] text-cyan">About the founder</p><div className="mt-6 space-y-5 text-lg leading-8 text-slate-300"><p>Daksh Shetty is the founder of Impact500 and an aspiring business and public policy leader with a passion for corporate responsibility, sustainability, and economic development.</p><p>His experiences in entrepreneurship, financial literacy education, IRS Volunteer Income Tax Assistance (VITA), public policy research, and sustainability analytics inspired the creation of Impact500. Recognizing the difficulty of comparing corporate responsibility information across organizations, he launched the platform to improve transparency and make responsible business research more accessible to students, researchers, and the public.</p><p>Through Impact500, Daksh hopes to encourage informed decision-making, promote greater corporate accountability, and demonstrate how businesses can create meaningful value for both shareholders and society.</p></div></article></section>

        <section className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><SectionHeading eyebrow="Looking ahead" title="Building the next research chapter." text="Impact500 continues to expand through broader company coverage, enhanced research methodologies, interactive analytical tools, and new educational resources." /></div><ol className="grid gap-3">{outlook.map((item, index) => <li key={item} className="flex items-center gap-4 rounded-2xl border bg-panel/70 p-5"><span className="text-xs text-cyan">{String(index + 1).padStart(2, "0")}</span><CheckCircle2 className="size-5 shrink-0 text-emerald-400" /><span className="text-slate-300">{item}</span></li>)}</ol></section>

        <section className="grid gap-6 lg:grid-cols-[1fr_.9fr]"><article className="surface-card"><p className="text-xs uppercase tracking-[.2em] text-cyan">Disclaimer</p><h2 className="mt-5 text-2xl font-semibold">Independent research for educational use.</h2><p className="mt-5 leading-7 text-slate-400">Impact500 is an independent educational and research initiative. All company evaluations are based on publicly available information and are intended solely for informational and educational purposes. The platform does not provide investment, legal, or financial advice, and company scores represent analytical assessments based on the Impact500 methodology.</p></article><article className="grid-bg rounded-[1.5rem] border bg-accent/10 p-8"><Globe2 className="size-6 text-cyan" /><h2 className="mt-5 text-3xl font-semibold">Follow the research.</h2><p className="mt-4 leading-7 text-slate-400">Receive research updates, annual reports, industry insights, and major platform releases.</p><div className="mt-6"><Newsletter /></div></article></section>
      </div>
    </main>
  );
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return <div className="max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[.24em] text-cyan">{eyebrow}</p><h2 className="display mt-5 text-4xl leading-[1.02] md:text-6xl">{title}</h2>{text && <p className="mt-6 text-lg leading-8 text-slate-400">{text}</p>}</div>;
}
