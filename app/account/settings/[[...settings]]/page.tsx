import { UserProfile } from "@clerk/nextjs";
import { AuthUnavailable } from "@/components/auth/auth-unavailable";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Account Settings",
  "Manage your Impact500 profile, password, security, and account.",
  "/account/settings",
);
export default function SettingsPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return <AuthUnavailable />;
  return (
    <section className="grid min-h-[70vh] place-items-center px-5 py-16">
      <UserProfile path="/account/settings" />
    </section>
  );
}
