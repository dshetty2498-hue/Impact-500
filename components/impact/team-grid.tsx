"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, FileCheck2, Microscope } from "lucide-react";
import { team } from "@/lib/data";

export function TeamGrid() {
  const [open, setOpen] = useState<string>(team[0]?.slug ?? "");
  return <div className="grid gap-4">{team.map((member) => {
    const expanded = open === member.slug;
    const initials = member.name.split(" ").map((part) => part[0]).join("");
    return <motion.article layout key={member.slug} id={member.slug} className="scroll-mt-28 overflow-hidden rounded-2xl border border-sky-300/25 bg-slate-50 text-slate-900 shadow-xl shadow-black/10">
      <button type="button" onClick={() => setOpen(expanded ? "" : member.slug)} aria-expanded={expanded} className="focus-ring flex w-full items-center gap-4 p-5 text-left md:px-7">
        <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-slate-900 text-sm font-bold text-white">{initials}</span>
        <span className="min-w-0 flex-1"><strong className="display block truncate text-2xl tracking-tight">{member.name}</strong><span className="mt-1 block text-sm text-slate-500">{member.role}</span></span>
        <ChevronDown className={`size-5 text-slate-500 transition ${expanded ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>{expanded && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="grid gap-8 border-t border-slate-200 p-6 md:grid-cols-[.42fr_1fr] md:p-10">
        <div className="grid min-h-56 place-items-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700"><div className="text-center"><span className="display text-6xl text-white">{initials}</span><p className="mt-3 text-xs uppercase tracking-[.2em] text-sky-300">Impact500 Research</p></div></div>
        <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Biography</p><p className="mt-4 text-lg leading-8 text-slate-700">{member.bio}</p><div className="mt-7 grid gap-5 sm:grid-cols-2"><div><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600"><Microscope className="size-4" />Research focus</p><p className="mt-3 leading-7 text-slate-700">{member.focus}</p></div><div><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600"><FileCheck2 className="size-4" />Contribution</p><p className="mt-3 leading-7 text-slate-700">{member.contribution}</p></div></div></div>
      </div></motion.div>}</AnimatePresence>
    </motion.article>;
  })}</div>;
}
