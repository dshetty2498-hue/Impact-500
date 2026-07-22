"use client";
import { useEffect, useState } from "react";
import { Check, Link2, Printer, Share2 } from "lucide-react";
import { BookmarkButton } from "@/components/member/bookmark-button";
import { ActivityTracker } from "@/components/member/activity-tracker";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const root = document.documentElement;
      const total = root.scrollHeight - root.clientHeight;
      setProgress(total ? Math.min(100, (root.scrollTop / total) * 100) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <div className="fixed inset-x-0 top-[5.25rem] z-40 h-0.5 bg-white/5" aria-hidden="true">
      <span
        className="block h-full bg-cyan transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function ResearchActions({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  useEffect(() => setCanShare("share" in navigator), []);
  const href = `/research/${slug}`;
  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <ActivityTracker activity={{ type: "read", slug, title, href }} />
      <BookmarkButton type="research" slug={slug} title={title} href={href} />
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        }}
        className="button-secondary"
      >
        {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
        {copied ? "Copied" : "Copy link"}
      </button>
      {canShare && (
        <button
          onClick={() => navigator.share({ title, url: window.location.href })}
          className="button-secondary"
        >
          <Share2 className="size-4" /> Share
        </button>
      )}
      <button onClick={() => window.print()} className="button-secondary">
        <Printer className="size-4" /> Print
      </button>
    </div>
  );
}
