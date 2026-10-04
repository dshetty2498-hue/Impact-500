import type { LetterGrade } from "@/lib/domain/types";

export type { LetterGrade } from "@/lib/domain/types";

export const gradingScale = [
  {
    grade: "A",
    label: "Excellent",
    range: "90–100",
    minimum: 90,
    maximum: 100,
    color: "Dark green",
    hex: "#15803d",
    badgeClass: "border-green-700/50 bg-green-800/25 text-green-300",
  },
  {
    grade: "B",
    label: "Strong",
    range: "80–89",
    minimum: 80,
    maximum: 89.999,
    color: "Green",
    hex: "#22c55e",
    badgeClass: "border-green-500/50 bg-green-500/15 text-green-300",
  },
  {
    grade: "C",
    label: "Developing",
    range: "70–79",
    minimum: 70,
    maximum: 79.999,
    color: "Yellow",
    hex: "#eab308",
    badgeClass: "border-yellow-500/50 bg-yellow-500/15 text-yellow-300",
  },
  {
    grade: "D",
    label: "Needs improvement",
    range: "60–69",
    minimum: 60,
    maximum: 69.999,
    color: "Orange",
    hex: "#f97316",
    badgeClass: "border-orange-500/50 bg-orange-500/15 text-orange-300",
  },
  {
    grade: "F",
    label: "Insufficient",
    range: "Below 60",
    minimum: 0,
    maximum: 59.999,
    color: "Red",
    hex: "#ef4444",
    badgeClass: "border-red-500/50 bg-red-500/15 text-red-300",
  },
] as const;

export function gradeForScore(score: number): LetterGrade {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export function gradeStyle(grade: string) {
  return (
    gradingScale.find((item) => item.grade === grade)?.badgeClass ?? gradingScale[4].badgeClass
  );
}

export function gradeHex(grade: string) {
  return gradingScale.find((item) => item.grade === grade)?.hex;
}
