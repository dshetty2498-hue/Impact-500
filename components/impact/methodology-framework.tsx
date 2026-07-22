"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronDown, Database, FileSearch, Scale, ShieldCheck } from "lucide-react";

const pillars = [
  { name: "Environmental", weight: 25, color: "#60a5fa" },
  { name: "Financial responsibility", weight: 25, color: "#3b82f6" },
  { name: "Philanthropy", weight: 25, color: "#c084fc" },
  { name: "Ethics", weight: 25, color: "#34d399" },
];
const faqs = [
  [
    "How often are scores updated?",
    "The full index is published annually. Material corrections and source updates are reviewed throughout the research cycle.",
  ],
  [
    "Can companies influence their score?",
    "Companies may submit public evidence or corrections, but cannot purchase placement, suppress findings, or influence model weights.",
  ],
  [
    "How do you handle missing data?",
    "Missing evidence is distinguished from negative evidence. Confidence and disclosure quality are evaluated separately before normalization.",
  ],
  [
    "Are scores investment recommendations?",
    "No. Impact500 scores are comparative research tools and should not be interpreted as investment, legal, or compliance advice.",
  ],
];
export function MethodologyFramework() {
  const [active, setActive] = useState(0);
  return (
    <div className="space-y-16">
      <section>
        <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
          <div className="rounded-[1.5rem] border bg-panel p-7">
            <p className="text-xs uppercase tracking-[.18em] text-cyan">Weighting model</p>
            <h2 className="mt-4 text-2xl font-semibold">Four lenses. One comparable score.</h2>
            <p className="mt-3 leading-7 text-zinc-400">
              Weights reflect stakeholder materiality, evidence availability, and the durability of
              observed outcomes.
            </p>
            <div className="mt-8 flex h-4 overflow-hidden rounded-full">
              {pillars.map((pillar) => (
                <span
                  key={pillar.name}
                  style={{ width: `${pillar.weight}%`, backgroundColor: pillar.color }}
                  title={`${pillar.name}: ${pillar.weight}%`}
                />
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {pillars.map((pillar) => (
                <div key={pillar.name} className="rounded-xl border bg-ink p-4">
                  <span className="text-xs text-zinc-500">{pillar.name}</span>
                  <strong className="mt-1 block text-xl" style={{ color: pillar.color }}>
                    {pillar.weight}%
                  </strong>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[1.5rem] border bg-panel p-7">
            <p className="text-xs uppercase tracking-[.18em] text-cyan">Interactive framework</p>
            <div className="mt-6 grid gap-2 sm:grid-cols-4">
              {pillars.map((pillar, index) => (
                <button
                  key={pillar.name}
                  onClick={() => setActive(index)}
                  className={`focus-ring rounded-xl border p-4 text-left transition ${active === index ? "border-cyan/40 bg-cyan/10" : "bg-ink hover:bg-white/5"}`}
                >
                  <span className="text-xs text-zinc-500">0{index + 1}</span>
                  <strong className="mt-6 block">{pillar.name}</strong>
                </button>
              ))}
            </div>
            <motion.div
              key={pillars[active].name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-xl border bg-ink p-6"
            >
              <h3 className="text-xl font-semibold text-cyan">{pillars[active].name} evidence</h3>
              <p className="mt-3 leading-7 text-zinc-400">
                Indicators combine policy strength, implementation quality, measured outcomes,
                disclosure continuity, and independent validation.
              </p>
              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {["Outcome quality", "Disclosure depth", "External assurance"].map((item) => (
                  <span key={item} className="flex items-center gap-2 text-sm text-zinc-300">
                    <CheckCircle2 className="size-4 text-emerald-400" />
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <section>
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-cyan">
          Research workflow
        </p>
        <h2 className="display mt-4 text-4xl">From source to published score.</h2>
        <div className="mt-9 grid gap-3 md:grid-cols-4">
          {[
            [Database, "Collect", "Public filings, reports, and independent evidence."],
            [FileSearch, "Review", "Researchers classify and assess every observation."],
            [Scale, "Normalize", "Metrics are made comparable within sector context."],
            [ShieldCheck, "Validate", "Findings receive methodological and editorial review."],
          ].map(([Icon, title, text], index) => {
            const Component = Icon as typeof Database;
            return (
              <motion.article
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="relative rounded-2xl border bg-panel p-6"
                key={String(title)}
              >
                <Component className="size-5 text-cyan" />
                <span className="absolute right-5 top-5 text-xs text-zinc-700">0{index + 1}</span>
                <h3 className="mt-10 font-semibold">{String(title)}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{String(text)}</p>
              </motion.article>
            );
          })}
        </div>
      </section>
      <section>
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-cyan">
          Frequently asked questions
        </p>
        <h2 className="display mt-4 text-4xl">Questions, answered plainly.</h2>
        <div className="mt-8 divide-y overflow-hidden rounded-2xl border bg-panel">
          {faqs.map(([question, answer], index) => (
            <Faq key={question} question={question} answer={answer} defaultOpen={index === 0} />
          ))}
        </div>
      </section>
    </div>
  );
}
function Faq({
  question,
  answer,
  defaultOpen,
}: {
  question: string;
  answer: string;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="focus-ring flex w-full items-center justify-between gap-4 p-6 text-left font-medium"
      >
        <span>{question}</span>
        <ChevronDown className={`size-4 shrink-0 transition ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 leading-7 text-zinc-400">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
