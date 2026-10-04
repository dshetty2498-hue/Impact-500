import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
export const scoreColor = (score: number) =>
  score >= 90
    ? "text-green-700"
    : score >= 80
      ? "text-green-400"
      : score >= 70
        ? "text-yellow-400"
        : score >= 60
          ? "text-orange-400"
          : "text-red-400";
