import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { siteUrl } from "@/lib/metadata";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Impact500 | Corporate responsibility, made legible",
    template: "%s | Impact500",
  },
  description:
    "Independent intelligence on corporate social responsibility across America's most influential companies.",
  applicationName: "Impact500",
  authors: [{ name: "Impact500 Institute" }],
  creator: "Impact500 Institute",
  publisher: "Impact500 Institute",
  category: "Corporate responsibility research",
  alternates: { canonical: siteUrl },
  manifest: "/manifest.webmanifest",
  openGraph: { type: "website", siteName: "Impact500", images: [{ url: "/opengraph-image" }] },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#050816",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Impact500",
    url: siteUrl,
    description: "Independent intelligence on corporate responsibility.",
  };
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <a
          href="#content"
          className="focus-ring sr-only fixed left-4 top-4 z-[100] rounded bg-cyan px-4 py-2 text-ink focus:not-sr-only"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="content" className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
