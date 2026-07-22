"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type BookmarkType = "company" | "research" | "report" | "industry";
export type Bookmark = {
  type: BookmarkType;
  slug: string;
  title: string;
  href: string;
  savedAt: string;
};
export type Watchlist = { id: string; name: string; companies: string[]; createdAt: string };
export type Activity = {
  type: "view" | "read" | "download" | "comparison";
  slug: string;
  title: string;
  href: string;
  at: string;
};
export type NotificationPreference = {
  research: boolean;
  reports: boolean;
  scores: boolean;
  product: boolean;
};
type MemberState = {
  bookmarks: Bookmark[];
  watchlists: Watchlist[];
  activity: Activity[];
  notifications: NotificationPreference;
};
type Context = MemberState & {
  ready: boolean;
  isBookmarked: (type: BookmarkType, slug: string) => boolean;
  toggleBookmark: (bookmark: Omit<Bookmark, "savedAt">) => void;
  recordActivity: (activity: Omit<Activity, "at">) => void;
  createWatchlist: (name: string) => void;
  deleteWatchlist: (id: string) => void;
  toggleWatchlistCompany: (id: string, slug: string) => void;
  setNotifications: (preferences: NotificationPreference) => void;
  clearData: () => void;
};
const initial: MemberState = {
  bookmarks: [],
  watchlists: [],
  activity: [],
  notifications: { research: true, reports: true, scores: false, product: true },
};
const MemberContext = createContext<Context | null>(null);
const storageKey = "impact500-member-v1";

export function MemberDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setState({ ...initial, ...JSON.parse(saved) });
    } catch {
      /* keep safe defaults */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(storageKey, JSON.stringify(state));
  }, [ready, state]);
  const toggleBookmark = useCallback(
    (bookmark: Omit<Bookmark, "savedAt">) =>
      setState((current) => ({
        ...current,
        bookmarks: current.bookmarks.some(
          (item) => item.type === bookmark.type && item.slug === bookmark.slug,
        )
          ? current.bookmarks.filter(
              (item) => item.type !== bookmark.type || item.slug !== bookmark.slug,
            )
          : [{ ...bookmark, savedAt: new Date().toISOString() }, ...current.bookmarks],
      })),
    [],
  );
  const recordActivity = useCallback(
    (activity: Omit<Activity, "at">) =>
      setState((current) => ({
        ...current,
        activity: [
          { ...activity, at: new Date().toISOString() },
          ...current.activity.filter(
            (item) => item.type !== activity.type || item.slug !== activity.slug,
          ),
        ].slice(0, 50),
      })),
    [],
  );
  const value = useMemo<Context>(
    () => ({
      ...state,
      ready,
      isBookmarked: (type, slug) =>
        state.bookmarks.some((item) => item.type === type && item.slug === slug),
      toggleBookmark,
      recordActivity,
      createWatchlist: (name) =>
        setState((current) => ({
          ...current,
          watchlists: [
            ...current.watchlists,
            {
              id: crypto.randomUUID(),
              name: name.trim(),
              companies: [],
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      deleteWatchlist: (id) =>
        setState((current) => ({
          ...current,
          watchlists: current.watchlists.filter((item) => item.id !== id),
        })),
      toggleWatchlistCompany: (id, slug) =>
        setState((current) => ({
          ...current,
          watchlists: current.watchlists.map((item) =>
            item.id === id
              ? {
                  ...item,
                  companies: item.companies.includes(slug)
                    ? item.companies.filter((company) => company !== slug)
                    : [...item.companies, slug],
                }
              : item,
          ),
        })),
      setNotifications: (notifications) => setState((current) => ({ ...current, notifications })),
      clearData: () => setState(initial),
    }),
    [ready, recordActivity, state, toggleBookmark],
  );
  return <MemberContext.Provider value={value}>{children}</MemberContext.Provider>;
}
export function useMemberData() {
  const value = useContext(MemberContext);
  if (!value) throw new Error("useMemberData must be used inside MemberDataProvider");
  return value;
}
