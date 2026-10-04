import "server-only";

import { NextResponse } from "next/server";

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RateLimitEntry = { count: number; resetAt: number };
type SubmissionBody = Record<string, unknown>;

const rateLimits = new Map<string, RateLimitEntry>();

function clientAddress(request: Request) {
  return (
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function jsonError(message: string, status: number, headers?: HeadersInit) {
  return NextResponse.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store", ...headers } },
  );
}

export function guardSubmission(
  request: Request,
  scope: string,
  { limit, windowMs }: { limit: number; windowMs: number },
) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return jsonError("Requests must use application/json.", 415);
  }

  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return jsonError("Cross-site submissions are not accepted.", 403);
  }

  const now = Date.now();
  const key = `${scope}:${clientAddress(request)}`;
  const current = rateLimits.get(key);
  const entry =
    !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current;
  entry.count += 1;
  rateLimits.set(key, entry);

  if (rateLimits.size > 10_000) {
    for (const [storedKey, storedEntry] of rateLimits) {
      if (storedEntry.resetAt <= now) rateLimits.delete(storedKey);
    }
  }

  if (entry.count > limit) {
    return jsonError("Too many submissions. Please try again later.", 429, {
      "Retry-After": Math.max(1, Math.ceil((entry.resetAt - now) / 1000)).toString(),
    });
  }

  return null;
}

export async function readSubmissionBody(
  request: Request,
  maximumBytes: number,
): Promise<{ body: SubmissionBody | null; response: NextResponse | null }> {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > maximumBytes) {
    return { body: null, response: jsonError("Submission is too large.", 413) };
  }

  if (!request.body) return { body: null, response: jsonError("A JSON body is required.", 400) };
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maximumBytes) {
        await reader.cancel();
        return { body: null, response: jsonError("Submission is too large.", 413) };
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { body: null, response: jsonError("A JSON object is required.", 400) };
    }
    return { body: parsed as SubmissionBody, response: null };
  } catch {
    return { body: null, response: jsonError("Invalid JSON body.", 400) };
  }
}

export function clean(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

export function cleanLine(value: unknown, maximum: number) {
  return clean(value, maximum)
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
