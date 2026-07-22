import { SignUp } from "@clerk/nextjs";
import { AuthUnavailable } from "@/components/auth/auth-unavailable";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Create Account",
  "Create an Impact500 research account.",
  "/account/sign-up",
);
export default function SignUpPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return <AuthUnavailable />;
  return (
    <section className="grid min-h-[70vh] place-items-center px-5 py-16">
      <SignUp path="/account/sign-up" signInUrl="/account/sign-in" fallbackRedirectUrl="/account" />
    </section>
  );
}
