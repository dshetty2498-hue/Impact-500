import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
export const scoreColor = (score: number) =>
  score >= 90 ? "text-cyan" : score >= 80 ? "text-emerald-400" : "text-amber-400";
