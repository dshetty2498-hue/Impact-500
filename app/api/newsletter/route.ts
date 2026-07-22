import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: unknown; website?: unknown } | null;
  if (body?.website) return NextResponse.json({ ok: true });
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!emailPattern.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  const db = getSupabase();
  if (!db) {
    return NextResponse.json({ error: "Subscriptions are temporarily unavailable." }, { status: 503 });
  }
  const { error } = await db.from("newsletter_subscribers").upsert(
    { email, status: "subscribed", subscribed_at: new Date().toISOString() },
    { onConflict: "email" },
  );
  if (error) return NextResponse.json({ error: "We could not save your subscription." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
