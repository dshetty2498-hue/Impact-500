"use client";
import { Download, ExternalLink, Printer } from "lucide-react";
export function ReportActions({ pdf }: { pdf: string }) {
  return (
    <div className="mt-10 flex flex-wrap gap-3">
      <a
        href={pdf}
        download
        className="focus-ring inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium hover:bg-blue-500"
      >
        <Download className="size-4" />
        Download PDF
      </a>
      <a
        href={pdf}
        target="_blank"
        rel="noreferrer"
        className="focus-ring inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-white/5"
      >
        <ExternalLink className="size-4" />
        Open in tab
      </a>
      <button
        type="button"
        onClick={() => window.print()}
        className="focus-ring inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-white/5"
      >
        <Printer className="size-4" />
        Print
      </button>
    </div>
  );
}
