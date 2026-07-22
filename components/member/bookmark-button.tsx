"use client";
import { Bookmark } from "lucide-react";
import { useMemberData, type BookmarkType } from "@/components/member/member-data";
export function BookmarkButton({
  type,
  slug,
  title,
  href,
  className = "button-secondary",
}: {
  type: BookmarkType;
  slug: string;
  title: string;
  href: string;
  className?: string;
}) {
  const { isBookmarked, toggleBookmark } = useMemberData();
  const active = isBookmarked(type, slug);
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => toggleBookmark({ type, slug, title, href })}
      className={className}
    >
      <Bookmark className={`size-4 ${active ? "fill-cyan text-cyan" : ""}`} />
      {active ? "Saved" : "Save"}
    </button>
  );
}
