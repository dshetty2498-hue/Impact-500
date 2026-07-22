import { SectionTitle } from "@/components/ui/primitives";
import { ReportActions } from "@/components/impact/report-actions";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "2025 Annual Report",
  "Download and read the 2025 Impact500 annual report.",
  "/annual-report",
);
export default function AnnualReport() {
  const pdf = "/reports/impact500-annual-report-2025.pdf";
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <SectionTitle
        eyebrow="Annual publication"
        title={
          <>
            Impact500 <em className="text-cyan">2025 outlook.</em>
          </>
        }
        text="The patterns, questions, and corporate decisions shaping the next phase of responsibility."
      />
      <ReportActions pdf={pdf} />
      <div className="mt-8 overflow-hidden rounded-2xl border bg-panel print:border-0">
        <iframe
          title="Impact500 2025 Annual Report"
          src={`${pdf}#view=FitH`}
          className="h-[70vh] w-full bg-white"
        />
        <div className="p-6 text-sm text-zinc-400 print:hidden">
          If the viewer does not load, use the download or open-in-new-tab controls above.
        </div>
      </div>
    </section>
  );
}
