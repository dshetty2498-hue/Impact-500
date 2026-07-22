"use client";
import { useState } from "react";
import { companies } from "@/lib/data";
import { InteractiveBarChart } from "@/components/impact/charts";
import { SectionTitle } from "@/components/ui/primitives";
export function CompanyComparison() {
  const [first, setFirst] = useState("microsoft");
  const [second, setSecond] = useState("salesforce");
  const a = companies.find((c) => c.slug === first) ?? companies[0];
  const b = companies.find((c) => c.slug === second) ?? companies[1];
  const rows = [
    ["Overall", a.score, b.score],
    ...Object.keys(a.pillars).map(
      (key) => [key, a.pillars[key], b.pillars[key]] as [string, number, number],
    ),
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <SectionTitle
        eyebrow="Comparative analysis"
        title="See the difference in the details."
        text="A transparent side-by-side view of the evidence behind each score."
      />
      <div className="mt-10 flex flex-wrap gap-3">
        {[first, second].map((value, index) => (
          <select
            key={index}
            aria-label={`Company ${index + 1}`}
            className="focus-ring rounded-lg border bg-panel px-4 py-3"
            value={value}
            onChange={(e) => (index ? setSecond(e.target.value) : setFirst(e.target.value))}
          >
            {companies.map((c) => (
              <option
                disabled={(index === 0 && c.slug === second) || (index === 1 && c.slug === first)}
                value={c.slug}
                key={c.slug}
              >
                {c.name}
              </option>
            ))}
          </select>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_.9fr]">
        <div className="overflow-hidden rounded-2xl border">
          <div className="grid grid-cols-3 border-b bg-panel p-5 text-center">
            <span />
            <strong>{a.name}</strong>
            <strong>{b.name}</strong>
          </div>
          {rows.map(([label, left, right]) => (
            <div className="grid grid-cols-3 border-b p-5 text-center last:border-0" key={label}>
              <span className="text-left text-zinc-400">{label}</span>
              <strong className="text-cyan">{left}</strong>
              <strong className="text-cyan">{right}</strong>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border bg-panel p-6">
          <InteractiveBarChart
            title="Pillar comparison"
            description="Hover or focus the chart to inspect values."
            data={Object.keys(a.pillars).map((label) => ({
              label,
              [a.name]: a.pillars[label],
              [b.name]: b.pillars[label],
            }))}
            series={[
              { key: a.name, label: a.name },
              { key: b.name, label: b.name },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
