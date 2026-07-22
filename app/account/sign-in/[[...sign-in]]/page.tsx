import { SignIn } from "@clerk/nextjs";
import { AuthUnavailable } from "@/components/auth/auth-unavailable";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Sign In",
  "Sign in to your Impact500 research account.",
  "/account/sign-in",
);
export default function SignInPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return <AuthUnavailable />;
  return (
    <section className="grid min-h-[70vh] place-items-center px-5 py-16">
      <SignIn path="/account/sign-in" signUpUrl="/account/sign-up" fallbackRedirectUrl="/account" />
    </section>
  );
}
