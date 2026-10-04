import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { sendImpactHorizonEmail } from "@/lib/email";
import {
  clean,
  cleanLine,
  emailPattern,
  guardSubmission,
  readSubmissionBody,
} from "@/lib/submission-security";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const blocked = guardSubmission(request, "newsletter", { limit: 10, windowMs: 60 * 60_000 });
  if (blocked) return blocked;
  const parsed = await readSubmissionBody(request, 4_096);
  if (parsed.response) return parsed.response;
  const body = parsed.body;
  if (body?.website) return NextResponse.json({ ok: true });
  const name = cleanLine(body?.name, 100);
  const email = clean(body?.email, 254).toLowerCase();
  if (!emailPattern.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  const db = getSupabase();
  if (!db) {
    return NextResponse.json(
      { error: "Subscriptions are temporarily unavailable." },
      { status: 503 },
    );
  }
  const { data: existing } = await db
    .from("newsletter_subscribers")
    .select("status")
    .eq("email", email)
    .maybeSingle();
  if (existing?.status === "subscribed") {
    return NextResponse.json({ ok: true, duplicate: true });
  }
  const { error } = await db
    .from("newsletter_subscribers")
    .upsert(
      { email, status: "subscribed", subscribed_at: new Date().toISOString() },
      { onConflict: "email" },
    );
  if (error)
    return NextResponse.json({ error: "We could not save your subscription." }, { status: 500 });
  try {
    await sendImpactHorizonEmail({
      replyTo: email,
      subject: "[Impact Horizon Newsletter Subscription] New subscriber",
      text: [
        "Submission type: NEWSLETTER SUBSCRIPTION",
        "",
        "A new newsletter subscription was received through Impact Horizon.",
        "",
        `Name: ${name || "Not provided"}`,
        `Email: ${email}`,
      ].join("\n"),
    });
  } catch (mailError) {
    console.error("Newsletter notification delivery failed", mailError);
    await db.from("newsletter_subscribers").update({ status: "unsubscribed" }).eq("email", email);
    return NextResponse.json(
      {
        error: "Your address was saved, but confirmation could not be completed. Please try again.",
      },
      { status: 503 },
    );
  }
  return NextResponse.json({ ok: true, duplicate: false });
}
