import { NextResponse } from "next/server";
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
  const blocked = guardSubmission(request, "contact", { limit: 5, windowMs: 15 * 60_000 });
  if (blocked) return blocked;
  const parsed = await readSubmissionBody(request, 8_192);
  if (parsed.response) return parsed.response;
  const body = parsed.body;
  if (body?.website) return NextResponse.json({ ok: true });

  const name = cleanLine(body?.name, 100);
  const email = clean(body?.email, 254).toLowerCase();
  const organization = cleanLine(body?.organization, 150);
  const subject = cleanLine(body?.subject, 160);
  const message = clean(body?.message, 5000);

  if (!name || !subject || !message || !emailPattern.test(email)) {
    return NextResponse.json(
      { error: "Enter your name, a valid email address, a subject, and a message." },
      { status: 400 },
    );
  }

  try {
    await sendImpactHorizonEmail({
      replyTo: email,
      subject: `[Impact Horizon Inquiry] ${subject}`,
      text: [
        "Submission type: INQUIRY",
        "",
        "New inquiry received through Impact Horizon.",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Organization: ${organization || "Not provided"}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact email delivery failed", error);
    return NextResponse.json(
      { error: "We could not deliver your inquiry right now. Please try again shortly." },
      { status: 503 },
    );
  }
}
