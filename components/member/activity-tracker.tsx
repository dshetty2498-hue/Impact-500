"use client";
import { useEffect } from "react";
import { useMemberData, type Activity } from "@/components/member/member-data";
export function ActivityTracker({ activity }: { activity: Omit<Activity, "at"> }) {
  const { recordActivity } = useMemberData();
  const { href, slug, title, type } = activity;
  useEffect(
    () => recordActivity({ href, slug, title, type }),
    [href, slug, title, type, recordActivity],
  );
  return null;
}
