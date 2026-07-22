import { MemberDashboard } from "@/components/member/member-dashboard";
import { AuthUnavailable } from "@/components/auth/auth-unavailable";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Research Dashboard",
  "Your saved Impact500 research, watchlists, comparisons, and account settings.",
  "/account",
);
export default function AccountPage() {
  return process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? <MemberDashboard /> : <AuthUnavailable />;
}
