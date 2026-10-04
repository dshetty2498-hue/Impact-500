"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { industries, team } from "@/lib/data";
import { resolveIndustryCoverage } from "@/lib/industry-data";

export function TeamGrid() {
  const [open, setOpen] = useState<string>("");

  return (
    <div className="divide-y border-y">
      {team.map((member, index) => {
        const expanded = open === member.slug;
        const initials = member.name
          .split(" ")
          .map((part) => part[0])
          .join("");

        return (
          <article key={member.slug} id={member.slug} className="scroll-mt-28">
            <button
              type="button"
              onClick={() => setOpen(expanded ? "" : member.slug)}
              aria-expanded={expanded}
              aria-controls={`${member.slug}-profile`}
              className="focus-ring grid w-full gap-4 py-6 text-left sm:grid-cols-[3rem_4.5rem_1fr_auto] sm:items-center"
            >
              <span className="text-xs tabular-nums text-slate-600">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Portrait member={member} initials={initials} compact />
              <span>
                <strong className="display block text-2xl">{member.name}</strong>
                <span className="mt-1 block text-sm text-cyan">{member.role}</span>
                <span className="mt-1 block text-xs text-slate-500">{member.focus}</span>
              </span>
              <ChevronDown
                className={`size-5 text-slate-500 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            <div
              id={`${member.slug}-profile`}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="grid gap-8 border-t py-9 md:grid-cols-[15rem_1fr] lg:grid-cols-[18rem_1fr]">
                  <Portrait member={member} initials={initials} />
                  <div>
                    <h2 className="display text-3xl">{member.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-cyan">{member.role}</p>

                    <section className="mt-7">
                      <h3 className="text-[.68rem] font-semibold uppercase tracking-wider text-slate-500">
                        Biography
                      </h3>
                      <p className="mt-4 max-w-3xl whitespace-pre-line leading-7 text-slate-300">
                        {member.bio}
                      </p>
                    </section>

                    {member.industryCoverage && (
                      <section className="mt-7 border-t pt-5">
                        <h3 className="text-[.68rem] font-semibold uppercase tracking-wider text-slate-500">
                          Industry coverage
                        </h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {member.industryCoverage.map((industry) => {
                            const page = resolveIndustryCoverage(industry, industries);
                            const className =
                              "border border-cyan/35 px-3 py-1.5 text-xs font-semibold text-cyan";
                            return page ? (
                              <Link
                                key={industry}
                                href={`/industries/${page.slug}`}
                                className={`${className} focus-ring hover:border-cyan hover:bg-cyan/5`}
                              >
                                {industry}
                              </Link>
                            ) : (
                              <span key={industry} className={className}>
                                {industry}
                              </span>
                            );
                          })}
                        </div>
                      </section>
                    )}

                    <div className="mt-7 grid gap-7 border-t pt-5 lg:grid-cols-2">
                      <section>
                        <h3 className="text-[.68rem] font-semibold uppercase tracking-wider text-slate-500">
                          Research focus
                        </h3>
                        <p className="mt-3 font-semibold text-slate-200">{member.focus}</p>
                        {member.focusAreas && (
                          <ul className="mt-4 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
                            {member.focusAreas.map((area) => (
                              <li key={area} className="border-l border-cyan/40 pl-3">
                                {area}
                              </li>
                            ))}
                          </ul>
                        )}
                      </section>
                      <section>
                        <h3 className="text-[.68rem] font-semibold uppercase tracking-wider text-slate-500">
                          Contribution
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-300">
                          {member.contribution}
                        </p>
                      </section>
                    </div>

                    {member.quote && (
                      <blockquote className="display mt-7 max-w-3xl border-l-2 border-cyan pl-5 text-xl italic leading-8 text-slate-300">
                        “{member.quote}”
                      </blockquote>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Portrait({
  member,
  initials,
  compact = false,
}: {
  member: (typeof team)[number];
  initials: string;
  compact?: boolean;
}) {
  return (
    <span
      className={`relative grid shrink-0 place-items-center overflow-hidden bg-slate-800 ${
        compact ? "size-[4.5rem]" : "aspect-[4/5] w-full"
      }`}
    >
      {member.photo ? (
        <Image
          src={member.photo}
          fill
          sizes={compact ? "72px" : "(max-width:768px) 100vw, 288px"}
          className="object-cover grayscale-[15%]"
          style={{ objectPosition: member.photoPosition }}
          alt={compact ? "" : `Portrait of ${member.name}`}
        />
      ) : (
        <span className={`display text-slate-300 ${compact ? "text-xl" : "text-5xl"}`}>
          {initials}
        </span>
      )}
    </span>
  );
}
