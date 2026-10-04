import type { MetadataRoute } from "next";
import { companies, industries, news, publications } from "@/lib/data";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://impact-horizon.org";
  const paths = [
    "",
    "/leaderboard",
    "/companies",
    "/compare",
    "/explorer",
    "/industries",
    "/industry-intelligence",
    "/sustainable-investing",
    "/dashboard",
    "/map",
    "/research",
    "/publications",
    "/insights",
    "/trends",
    "/statistics",
    "/news",
    "/annual-report",
    "/methodology",
    "/research-cycles",
    "/why-csr",
    "/about",
    "/building-impact-horizon",
    "/team",
    "/impact",
    "/architecture",
    "/editorial-standards",
    "/media",
    "/partnerships",
    "/contact",
    "/privacy",
    "/terms",
    "/disclaimer",
  ];
  return [
    ...paths.map((path) => ({
      url: `${base}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...companies.map((c) => ({
      url: `${base}/companies/${c.slug}`,
      lastModified: new Date(c.lastReviewed),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...publications.map((a) => ({
      url: `${base}/research/${a.slug}`,
      lastModified: new Date(a.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...industries.map((industry) => ({
      url: `${base}/industries/${industry.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...news.map((item) => ({
      url: `${base}/news/${item.slug}`,
      lastModified: new Date(item.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
