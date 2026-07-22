"use client";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, UserRound } from "lucide-react";
import { team } from "@/lib/data";

export function TeamGrid() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {team.map((member) => (
        <motion.article
          layout
          id={member.slug}
          className="scroll-mt-24 overflow-hidden rounded-[1.5rem] border bg-panel"
          key={member.slug}
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/research-team.png"
              fill
              sizes="(max-width:768px) 100vw, 33vw"
              alt={`Portrait of ${member.name}, ${member.role}`}
              className="scale-[2.9] object-cover"
              style={{ objectPosition: member.photoPosition }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
          </div>
          <div className="p-6">
            <p className="text-xs uppercase tracking-wider text-cyan">{member.role}</p>
            <h3 className="mt-2 text-2xl font-semibold">{member.name}</h3>
            <p className="mt-4 text-sm leading-6 text-zinc-400">{member.bio}</p>
            <button
              onClick={() => setOpen((current) => (current === member.slug ? null : member.slug))}
              aria-expanded={open === member.slug}
              className="focus-ring mt-5 flex w-full items-center justify-between border-t pt-4 text-sm font-medium"
            >
              <span>Research profile</span>
              <ChevronDown
                className={`size-4 transition ${open === member.slug ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {open === member.slug && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 pt-5 text-sm">
                    <div>
                      <span className="text-xs text-zinc-600">Research focus</span>
                      <p className="mt-1 text-zinc-300">{member.focus}</p>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-600">Contribution</span>
                      <p className="mt-1 leading-6 text-zinc-400">{member.contribution}</p>
                    </div>
                    <p className="inline-flex items-center gap-2 text-xs text-zinc-500">
                      <UserRound className="size-4" /> Professional profile forthcoming
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
