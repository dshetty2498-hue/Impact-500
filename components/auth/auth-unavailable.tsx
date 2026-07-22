import Link from "next/link";
import { LockKeyhole } from "lucide-react";
export function AuthUnavailable() {
  return (
    <section className="mx-auto max-w-xl px-5 py-24 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl border bg-panel text-cyan">
        <LockKeyhole />
      </span>
      <h1 className="display mt-7 text-4xl">Member accounts are being connected.</h1>
      <p className="mt-5 leading-7 text-zinc-400">
        The complete account experience is installed, but this deployment still needs its Clerk
        publishable and secret keys. Public research remains available without an account.
      </p>
      <Link href="/" className="button-primary mt-8">
        Return to research
      </Link>
    </section>
  );
}
