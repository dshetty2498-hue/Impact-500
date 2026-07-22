import { cn } from "@/lib/utils";
export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-cyan/30 bg-cyan/10 px-2.5 py-1 text-xs font-medium text-cyan",
        className,
      )}
    >
      {children}
    </span>
  );
}
export function SectionTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: React.ReactNode;
  text?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-cyan">{eyebrow}</p>
      <h1 className="display text-4xl leading-tight md:text-6xl">{title}</h1>
      {text && <p className="mt-5 text-lg leading-8 text-zinc-400">{text}</p>}
    </div>
  );
}
export function Score({ score, grade }: { score: number; grade?: string }) {
  return (
    <div className="text-right">
      <strong className="text-2xl text-cyan">{score.toFixed(1)}</strong>
      {grade && (
        <span className="ml-2 rounded bg-cyan/15 px-1.5 py-0.5 text-xs font-bold text-cyan">
          {grade}
        </span>
      )}
    </div>
  );
}
