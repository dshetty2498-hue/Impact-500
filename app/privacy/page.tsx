import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Privacy Policy",
  "How Impact500 handles visitor information.",
  "/privacy",
);
export default function Privacy() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-wider text-cyan">Legal</p>
      <h1 className="display mt-4 text-5xl">Privacy Policy</h1>
      <div className="mt-10 space-y-6 leading-7 text-zinc-400">
        <p>
          Impact500 minimizes data collection. We do not sell personal information. Standard hosting
          logs may record device, browser, and request information for security and reliability.
        </p>
        <h2 className="text-xl font-semibold text-white">Information you provide</h2>
        <p>
          If you subscribe or contact us, we use your details only to fulfill that request. You may
          request access or deletion by emailing privacy@impact500.org.
        </p>
        <h2 className="text-xl font-semibold text-white">Updates</h2>
        <p>
          This policy was last updated July 21, 2026. Material changes will be posted on this page.
        </p>
      </div>
    </article>
  );
}
