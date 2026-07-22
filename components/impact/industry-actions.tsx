"use client";
import { Download } from "lucide-react";
import { BookmarkButton } from "@/components/member/bookmark-button";
export function IndustryActions({ slug, name }: { slug: string; name: string }) {
  return (
    <div className="mt-7 flex flex-wrap gap-2 print:hidden">
      <BookmarkButton
        type="industry"
        slug={slug}
        title={`${name} industry research`}
        href={`/industries/${slug}`}
      />
      <button onClick={() => window.print()} className="button-secondary">
        <Download className="size-4" /> Export industry report
      </button>
    </div>
  );
}
