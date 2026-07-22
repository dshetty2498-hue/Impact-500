"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { companies } from "@/lib/data";

export function MetricCounter({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!visible) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1100, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, value, reduced]);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="metric-card"
    >
      <strong className="display text-3xl text-white md:text-4xl">
        {display.toLocaleString()}
        {suffix}
      </strong>
      <span className="mt-2 block text-xs leading-5 text-zinc-500">{label}</span>
    </motion.div>
  );
}

export function CompanySpotlight() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % companies.length),
      6000,
    );
    return () => window.clearInterval(timer);
  }, [reduced]);
  const company = companies[index];
  const move = (direction: number) =>
    setIndex((current) => (current + direction + companies.length) % companies.length);
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border bg-panel/70 p-6 shadow-2xl shadow-black/20 md:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(79,126,255,.18),transparent_35%)]" />
      <motion.div
        key={company.slug}
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative grid gap-8 lg:grid-cols-[1fr_.8fr]"
      >
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-xl border bg-ink text-lg font-bold text-cyan">
              {company.name.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <p className="text-xs uppercase tracking-[.18em] text-cyan">Company spotlight</p>
              <h3 className="mt-1 text-2xl font-semibold">{company.name}</h3>
            </div>
          </div>
          <p className="mt-7 max-w-xl text-lg leading-8 text-zinc-300">{company.summary}</p>
          <div className="mt-7 flex flex-wrap gap-2">
            {[...company.strengths.slice(0, 2), company.industry].map((item) => (
              <span
                key={item}
                className="rounded-full border bg-white/[.03] px-3 py-1.5 text-xs text-zinc-400"
              >
                {item}
              </span>
            ))}
          </div>
          <Link className="button-primary mt-8" href={`/companies/${company.slug}`}>
            Quick profile <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 self-center">
          <div className="rounded-2xl border bg-ink/70 p-5">
            <span className="text-xs text-zinc-500">Overall score</span>
            <strong className="display mt-3 block text-5xl text-cyan">{company.score}</strong>
          </div>
          <div className="rounded-2xl border bg-ink/70 p-5">
            <span className="text-xs text-zinc-500">CSR grade</span>
            <strong className="display mt-3 block text-5xl text-white">{company.grade}</strong>
          </div>
          <div className="col-span-2 flex items-center justify-between rounded-2xl border bg-ink/70 p-5">
            <span className="text-sm text-zinc-400">Latest research-cycle momentum</span>
            <strong className="text-emerald-400">+{company.change}% ↗</strong>
          </div>
        </div>
      </motion.div>
      <div className="absolute bottom-5 right-5 flex gap-2">
        <button
          onClick={() => move(-1)}
          aria-label="Previous featured company"
          className="focus-ring rounded-full border bg-ink/80 p-2 hover:border-cyan/40"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          onClick={() => move(1)}
          aria-label="Next featured company"
          className="focus-ring rounded-full border bg-ink/80 p-2 hover:border-cyan/40"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

const milestones = [
  [
    "2013",
    "Project founded",
    "A public-interest research effort begins with a simple question: can responsibility be compared?",
  ],
  [
    "2016",
    "Research begins",
    "A cross-sector evidence library establishes the first consistent baseline.",
  ],
  [
    "2019",
    "Framework developed",
    "Four pillars and a documented normalization system create comparable scores.",
  ],
  [
    "2023",
    "Database completed",
    "Structured source, company, metric, and review records reach production scale.",
  ],
  [
    "2026",
    "Annual report published",
    "The expanded index organizes more than 800 pillar values into accessible intelligence.",
  ],
  [
    "Next",
    "Future expansion",
    "More sectors, deeper citations, and new tools for researchers and communities.",
  ],
] as const;

export function ResearchTimeline() {
  return (
    <ol className="relative ml-3 border-l border-white/10 md:ml-0 md:grid md:grid-cols-3 md:border-l-0 md:border-t">
      {milestones.map(([year, title, text], index) => (
        <motion.li
          key={title}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: (index % 3) * 0.08 }}
          className="relative px-7 pb-10 md:px-5 md:pb-0 md:pt-8"
        >
          <span className="absolute -left-1.5 top-1 size-3 rounded-full border-2 border-ink bg-cyan md:-top-1.5 md:left-5" />
          <span className="text-xs font-semibold text-cyan">{year}</span>
          <h3 className="mt-3 font-semibold">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-500">{text}</p>
        </motion.li>
      ))}
    </ol>
  );
}

export function IndustryCards() {
  const groups = Array.from(new Set(companies.map((c) => c.industry))).map((industry) => {
    const list = companies.filter((c) => c.industry === industry);
    return {
      industry,
      average: list.reduce((sum, c) => sum + c.score, 0) / list.length,
      top: [...list].sort((a, b) => b.score - a.score)[0],
      count: list.length,
    };
  });
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group, index) => (
        <motion.article key={group.industry} whileHover={{ y: -4 }} className="premium-card group">
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-xl bg-accent/10 text-cyan">
              <Building2 className="size-5" />
            </span>
            <span className="text-xs text-emerald-400">↗ {(1.8 + index * 0.7).toFixed(1)}%</span>
          </div>
          <h3 className="mt-8 text-xl font-semibold">{group.industry}</h3>
          <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-5">
            <div>
              <span className="text-xs text-zinc-500">Average score</span>
              <strong className="mt-1 block text-2xl text-cyan">{group.average.toFixed(1)}</strong>
            </div>
            <div>
              <span className="text-xs text-zinc-500">Top company</span>
              <strong className="mt-1 block truncate text-sm">{group.top.name}</strong>
            </div>
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            {group.count} published {group.count === 1 ? "profile" : "profiles"}
          </p>
        </motion.article>
      ))}
    </div>
  );
}
