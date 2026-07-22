import { NextResponse } from "next/server";

export function apiSuccess<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(
    { data, meta: { generatedAt: new Date().toISOString(), version: "2026.1" } },
    {
      ...init,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
        ...init?.headers,
      },
    },
  );
}

export function apiNotFound(resource: string) {
  return NextResponse.json(
    { error: { code: "NOT_FOUND", message: `${resource} was not found.` } },
    { status: 404 },
  );
}

export function finiteNumber(value: string | null) {
  if (value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
