"use client";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function AccountLink({ configured }: { configured: boolean }) {
  if (!configured)
    return (
      <Link
        href="/account/sign-in"
        aria-label="Account"
        className="focus-ring rounded-md p-2 text-zinc-300 hover:bg-white/10"
      >
        <UserRound className="size-4" />
      </Link>
    );
  return (
    <>
      <SignedOut>
        <Link
          href="/account/sign-in"
          className="focus-ring rounded-lg border px-3 py-2 text-xs text-zinc-300 hover:border-cyan/30"
        >
          Sign in
        </Link>
      </SignedOut>
      <SignedIn>
        <Link
          href="/account"
          className="focus-ring hidden text-xs text-zinc-300 hover:text-white sm:block"
        >
          Dashboard
        </Link>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </>
  );
}
