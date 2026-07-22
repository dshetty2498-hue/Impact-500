import type { MetadataRoute } from "next";
import { companies, research } from "@/lib/data";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://impact500.org";
  const paths = [
    "",
    "/leaderboard",
    "/compare",
    "/explorer",
    "/research",
    "/annual-report",
    "/methodology",
    "/why-csr",
    "/about",
    "/search",
    "/privacy",
    "/terms",
    "/disclaimer",
  ];
  return [
    ...paths.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...companies.map((c) => ({
      url: `${base}/companies/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...research.map((a) => ({
      url: `${base}/research/${a.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
