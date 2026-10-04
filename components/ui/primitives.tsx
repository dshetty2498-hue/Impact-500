import { cn } from "@/lib/utils";
import { gradeForScore, gradeStyle } from "@/lib/grading";
export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border border-cyan/35 bg-transparent px-2.5 py-1 text-[.68rem] font-semibold uppercase tracking-wider text-cyan",
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
    <div className="max-w-4xl">
      <p className="editorial-kicker mb-4">{eyebrow}</p>
      <h1 className="display text-3xl leading-[1.08] sm:text-4xl md:text-[3.4rem]">{title}</h1>
      {text && <p className="editorial-deck mt-5">{text}</p>}
    </div>
  );
}
export function GradeBadge({ score, className }: { score: number; className?: string }) {
  const grade = gradeForScore(score);
  return (
    <span
      className={cn(
        "inline-flex min-w-8 justify-center rounded border px-2 py-1 text-xs font-bold",
        gradeStyle(grade),
        className,
      )}
      title={`Grade ${grade}: ${score.toFixed(1)} points`}
    >
      {grade}
    </span>
  );
}

export function Score({ score }: { score: number; grade?: string }) {
  return (
    <div className="text-right">
      <strong className="text-2xl text-cyan">{score.toFixed(1)}</strong>
      <GradeBadge score={score} className="ml-2 px-1.5 py-0.5" />
    </div>
  );
}
