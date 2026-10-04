import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { serializeJsonLd, siteUrl } from "@/lib/metadata";
import { AuthShell } from "@/components/auth/auth-shell";
import { AccessibilityControls } from "@/components/site/accessibility-controls";
import { PageTools } from "@/components/site/page-tools";
import { Analytics } from "@vercel/analytics/next";
import { ResearchCycleNotice } from "@/components/site/research-cycle-notice";
import { currentResearchCycle, previousResearchCycle } from "@/data/research-cycles";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Impact Horizon | Corporate responsibility research",
    template: "%s | Impact Horizon",
  },
  description:
    "Independent intelligence on corporate social responsibility across America's most influential companies.",
  applicationName: "Impact Horizon",
  authors: [{ name: "Impact Horizon Research Institute" }],
  creator: "Impact Horizon Research Institute",
  publisher: "Impact Horizon Research Institute",
  category: "Corporate responsibility research",
  verification: {
    google: "aK7LOkY3Vb2a2icJ8ObnEm_fQwj6rzhHrmfc9OcucHQ",
  },
  alternates: { canonical: siteUrl },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: "Impact Horizon",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0B1118",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Impact Horizon Research Institute",
        alternateName: "Impact Horizon",
        url: siteUrl,
        description: "Independent intelligence on corporate responsibility.",
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "Impact Horizon",
        url: siteUrl,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "en-US",
      },
    ],
  };
  return (
    <html lang="en">
      <body>
        <AuthShell publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
          />
          <a
            href="#content"
            className="focus-ring sr-only fixed left-4 top-4 z-[100] rounded bg-cyan px-4 py-2 text-ink focus:not-sr-only"
          >
            Skip to content
          </a>
          <Navbar />
          <ResearchCycleNotice
            cycle={currentResearchCycle}
            previousCycle={previousResearchCycle}
          />
          <PageTools />
          <main id="content" className="min-h-screen">
            {children}
          </main>
          <Footer />
          <AccessibilityControls />
          <Analytics />
        </AuthShell>
      </body>
    </html>
  );
}
