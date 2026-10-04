"use client";

import { useState } from "react";

type CompanyLogoProps = {
  name: string;
  website?: string;
  logo?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  priority?: boolean;
};

const sizes = {
  sm: "size-8 rounded-lg p-1.5",
  md: "size-10 rounded-xl p-2",
  lg: "size-14 rounded-xl p-2.5",
  xl: "size-24 rounded-2xl p-4 md:size-28",
};

export function companyLogoUrl(website?: string) {
  if (!website || website.includes("fortune.com/ranking/fortune500")) return null;
  return `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(website)}&sz=256`;
}

export function CompanyLogo({
  name,
  website,
  logo,
  size = "md",
  className = "",
  priority = false,
}: CompanyLogoProps) {
  const [failed, setFailed] = useState(false);
  const source = logo || companyLogoUrl(website);
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <span
      className={`relative grid shrink-0 place-items-center overflow-hidden border border-white/10 bg-white text-sm font-bold text-slate-700 shadow-sm ${sizes[size]} ${className}`}
      aria-hidden="true"
    >
      {source && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={source}
          alt=""
          width={size === "xl" ? 112 : size === "lg" ? 56 : size === "md" ? 40 : 32}
          height={size === "xl" ? 112 : size === "lg" ? 56 : size === "md" ? 40 : 32}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        <span>{initials || "IH"}</span>
      )}
    </span>
  );
}
