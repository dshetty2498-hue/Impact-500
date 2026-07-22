"use client";
import { FormEvent, useId, useState } from "react";

export function Newsletter() {
  const inputId = useId();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setPending(true);
    setMessage("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), website: data.get("website") }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Subscription failed.");
      setMessage("You’re subscribed. Thank you.");
      form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Subscription failed.");
    } finally {
      setPending(false);
    }
  }
  return (
    <form onSubmit={submit}>
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="mt-4 flex gap-2">
        <input
          id={inputId}
          name="email"
          type="email"
          required
          autoComplete="email"
          className="form-control min-w-0 flex-1"
          placeholder="you@example.com"
        />
        <button disabled={pending} className="button-primary shrink-0 px-4 py-3 disabled:opacity-60">
          {pending ? "Joining…" : "Join"}
        </button>
      </div>
      <p className="mt-2 min-h-5 text-xs text-slate-300" role="status">
        {message}
      </p>
    </form>
  );
}
