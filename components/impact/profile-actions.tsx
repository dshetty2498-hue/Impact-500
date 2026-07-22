"use client";
import { Download, Share2 } from "lucide-react";
import { BookmarkButton } from "@/components/member/bookmark-button";
export function ProfileActions({ name, slug }: { name: string; slug: string }) {
  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <button
        onClick={() => window.print()}
        className="button-secondary"
        aria-label={`Save ${name} profile as a PDF`}
      >
        <Download className="size-4" />
        Save profile as PDF
      </button>
      <BookmarkButton type="company" slug={slug} title={name} href={`/companies/${slug}`} />
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(window.location.href);
        }}
        className="button-secondary"
        aria-label={`Copy a link to ${name}`}
      >
        <Share2 className="size-4" />
        Copy link
      </button>
    </div>
  );
}
