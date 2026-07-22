import Link from "next/link";
export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-28 text-center">
      <p className="text-cyan">404</p>
      <h1 className="display mt-4 text-5xl">This page isn’t in the index.</h1>
      <p className="mt-5 text-zinc-400">
        The research you requested may have moved or is no longer published.
      </p>
      <Link className="mt-8 inline-block rounded-lg bg-accent px-5 py-3" href="/">
        Return home
      </Link>
    </section>
  );
}
