"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { MemberDataProvider } from "@/components/member/member-data";

export function AuthShell({
  children,
  publishableKey,
}: {
  children: React.ReactNode;
  publishableKey?: string;
}) {
  const content = <MemberDataProvider>{children}</MemberDataProvider>;
  return publishableKey ? (
    <ClerkProvider publishableKey={publishableKey}>{content}</ClerkProvider>
  ) : (
    content
  );
}
