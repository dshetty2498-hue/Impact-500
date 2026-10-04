import type { Metadata } from "next";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://impact-horizon.org";

type ArticleMetadataOptions = {
  authors: string[];
  image?: string;
  publishedTime: string;
};

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const canonical = path === "/" ? siteUrl : `${siteUrl}${path}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: [{ url: "/opengraph-image" }],
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
      images: ["/opengraph-image"],
    },
  };
}

export function articleMetadata(
  title: string,
  description: string,
  path: string,
  { authors, image = "/opengraph-image", publishedTime }: ArticleMetadataOptions,
): Metadata {
  const canonical = `${siteUrl}${path}`;
  return {
    title,
    description,
    authors: authors.map((name) => ({ name })),
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      authors,
      publishedTime,
      images: [{ url: image }],
    },
    twitter: { title, description, card: "summary_large_image", images: [image] },
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
