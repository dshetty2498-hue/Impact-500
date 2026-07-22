"use client";
import { Download, Expand, ExternalLink, Printer } from "lucide-react";
import { BookmarkButton } from "@/components/member/bookmark-button";
import { useMemberData } from "@/components/member/member-data";
export function ReportActions({ pdf, slug, title }: { pdf: string; slug: string; title: string }) {
  const { recordActivity } = useMemberData();
  return (
    <div className="mt-10 flex flex-wrap gap-3">
      <a
        href={pdf}
        download
        onClick={() => recordActivity({ type: "download", slug, title, href: pdf })}
        className="button-primary"
      >
        <Download className="size-4" />
        Download PDF
      </a>
      <a
        href={pdf}
        target="_blank"
        rel="noreferrer"
        className="button-secondary"
      >
        <ExternalLink className="size-4" />
        Open in tab
      </a>
      <button
        type="button"
        onClick={() => window.print()}
        className="button-secondary"
      >
        <Printer className="size-4" />
        Print
      </button>
      <BookmarkButton
        type="report"
        slug={slug}
        title={title}
        href={`/annual-report?report=${slug}`}
      />
      <button
        type="button"
        onClick={() => document.getElementById("report-viewer")?.requestFullscreen()}
        className="button-secondary"
      >
        <Expand className="size-4" />
        Full screen
      </button>
    </div>
  );
}
