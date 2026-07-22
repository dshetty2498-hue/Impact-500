"use client";
import Link from "next/link";
import { useState } from "react";
import { Bell, Bookmark, Clock3, Download, Eye, FolderPlus, Settings, Trash2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { companies } from "@/lib/data";
import { useMemberData } from "@/components/member/member-data";

export function MemberDashboard() {
  const { user } = useUser();
  const data = useMemberData();
  const [watchlistName, setWatchlistName] = useState("");
  const favorites = data.bookmarks.filter((item) => item.type === "company");
  const savedResearch = data.bookmarks.filter((item) => item.type === "research");
  const recent = data.activity.filter((item) => item.type === "view").slice(0, 6);
  const downloads = data.activity.filter((item) => item.type === "download").slice(0, 6);
  const reading = data.activity.filter((item) => item.type === "read").slice(0, 6);
  const comparisons = data.activity.filter((item) => item.type === "comparison").slice(0, 6);
  return (
    <section className="page-shell">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs uppercase tracking-[.18em] text-cyan">
            Personal research workspace
          </p>
          <h1 className="display mt-4 text-5xl">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}.
          </h1>
          <p className="mt-4 text-zinc-400">
            Your saved evidence, watchlists, reading, and account preferences in one place.
          </p>
        </div>
        <Link href="/account/settings" className="button-secondary">
          <Settings className="size-4" /> Profile settings
        </Link>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Bookmark} label="Bookmarks" value={data.bookmarks.length} />
        <Stat icon={FolderPlus} label="Watchlists" value={data.watchlists.length} />
        <Stat icon={Eye} label="Recently viewed" value={recent.length} />
        <Stat icon={Download} label="Downloads" value={downloads.length} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <Panel
          title="Favorite companies"
          empty="Save a company profile to see it here."
          items={favorites}
        />
        <Panel
          title="Saved research"
          empty="Bookmark publications while reading."
          items={savedResearch}
        />
        <Panel
          title="Recently viewed"
          empty="Company profiles you visit will appear here."
          items={recent}
        />
        <Panel
          title="Reading history"
          empty="Your article history will appear here."
          items={reading}
        />
        <Panel
          title="Downloaded reports"
          empty="Downloaded reports will appear here."
          items={downloads}
        />
        <Panel
          title="Saved comparisons"
          empty="Export or save a comparison to track it here."
          items={comparisons}
        />
      </div>
      <section className="mt-8 rounded-2xl border bg-panel p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-semibold">Custom watchlists</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Organize companies around sectors, themes, or research projects.
            </p>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (watchlistName.trim()) {
                data.createWatchlist(watchlistName);
                setWatchlistName("");
              }
            }}
            className="flex gap-2"
          >
            <input
              value={watchlistName}
              onChange={(event) => setWatchlistName(event.target.value)}
              maxLength={50}
              required
              placeholder="Watchlist name"
              aria-label="New watchlist name"
              className="focus-ring min-w-0 rounded-lg border bg-ink px-3 py-2"
            />
            <button className="button-primary">
              <FolderPlus className="size-4" /> Create
            </button>
          </form>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {data.watchlists.map((watchlist) => (
            <article key={watchlist.id} className="rounded-xl border bg-ink/40 p-5">
              <div className="flex justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{watchlist.name}</h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    {watchlist.companies.length} companies
                  </p>
                </div>
                <button
                  onClick={() => data.deleteWatchlist(watchlist.id)}
                  aria-label={`Delete ${watchlist.name}`}
                  className="focus-ring rounded p-2 text-zinc-600 hover:text-red-400"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {companies.map((company) => (
                  <button
                    key={company.slug}
                    onClick={() => data.toggleWatchlistCompany(watchlist.id, company.slug)}
                    aria-pressed={watchlist.companies.includes(company.slug)}
                    className={`focus-ring rounded-full border px-2.5 py-1 text-xs ${watchlist.companies.includes(company.slug) ? "border-cyan/40 bg-cyan/10 text-cyan" : "text-zinc-500"}`}
                  >
                    {company.ticker}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      <NotificationSettings />
    </section>
  );
}
function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Bookmark;
  label: string;
  value: number;
}) {
  return (
    <article className="metric-card">
      <Icon className="size-4 text-cyan" />
      <strong className="display mt-5 block text-3xl">{value}</strong>
      <span className="mt-2 block text-xs text-zinc-500">{label}</span>
    </article>
  );
}
function Panel({
  title,
  items,
  empty,
}: {
  title: string;
  items: { title: string; href: string; at?: string }[];
  empty: string;
}) {
  return (
    <article className="rounded-2xl border bg-panel p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      {items.length ? (
        <div className="mt-4 divide-y">
          {items.map((item, index) => (
            <Link
              href={item.href}
              key={`${item.href}-${index}`}
              className="flex items-center justify-between gap-3 py-3 text-sm hover:text-cyan"
            >
              <span className="truncate">{item.title}</span>
              <Clock3 className="size-3 shrink-0 text-zinc-600" />
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm text-zinc-600">{empty}</p>
      )}
    </article>
  );
}
function NotificationSettings() {
  const data = useMemberData();
  return (
    <section className="mt-8 rounded-2xl border bg-panel p-6">
      <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-cyan">
        <Bell className="size-4" /> Notifications
      </p>
      <h2 className="mt-3 text-xl font-semibold">Choose your research updates.</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {(
          [
            ["research", "New research"],
            ["reports", "Annual reports"],
            ["scores", "Company score changes"],
            ["product", "Platform updates"],
          ] as const
        ).map(([key, label]) => (
          <label
            className="flex items-center justify-between rounded-xl border p-4 text-sm"
            key={key}
          >
            {label}
            <input
              type="checkbox"
              checked={data.notifications[key]}
              onChange={(event) =>
                data.setNotifications({ ...data.notifications, [key]: event.target.checked })
              }
              className="accent-cyan"
            />
          </label>
        ))}
      </div>
    </section>
  );
}
