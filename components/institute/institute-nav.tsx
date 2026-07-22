import Link from "next/link";

export const instituteLinks = [
  ["Overview", "/about"],
  ["Building Impact500", "/building-impact500"],
  ["Team", "/team"],
  ["Impact", "/impact"],
  ["Architecture", "/architecture"],
  ["Editorial standards", "/editorial-standards"],
  ["Media", "/media"],
  ["Partnerships", "/partnerships"],
] as const;

export function InstituteNav() {
  return (
    <nav aria-label="Institute" className="mb-12 overflow-x-auto rounded-2xl border bg-panel/80 px-4 backdrop-blur-xl">
      <div className="flex min-w-max gap-1 py-2">
        {instituteLinks.map(([label, href]) => (
          <Link key={href} href={href} className="focus-ring rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/[.05] hover:text-white">
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
