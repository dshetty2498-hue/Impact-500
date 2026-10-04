"use client";

import { FormEvent, useId, useState } from "react";
import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";

export function Newsletter() {
  const id = useId();
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    setPending(true);
    setMessage("");
    setError(false);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          website: data.get("website"),
        }),
      });
      const result = (await response.json()) as { error?: string; duplicate?: boolean };
      if (!response.ok) throw new Error(result.error ?? "Subscription failed.");
      setMessage(
        result.duplicate
          ? "You’re already subscribed with this email address."
          : "You’re subscribed. Thank you for joining Impact Horizon.",
      );
      form.reset();
    } catch (caught) {
      setError(true);
      setMessage(caught instanceof Error ? caught.message : "Subscription failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-5" aria-busy={pending} noValidate>
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <label htmlFor={`${id}-name`} className="sr-only">
        Name (optional)
      </label>
      <input
        id={`${id}-name`}
        name="name"
        autoComplete="name"
        maxLength={100}
        className="form-control w-full"
        placeholder="Name (optional)"
      />
      <label htmlFor={`${id}-email`} className="sr-only">
        Email address
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          className="form-control min-w-0 flex-1"
          placeholder="you@example.com"
        />
        <button
          type="submit"
          disabled={pending}
          className="button-primary shrink-0 px-4 py-3 disabled:opacity-60"
        >
          {pending ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {pending ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-400">
        We use your email only for Impact Horizon updates. You can request removal at any time.
      </p>
      <div
        className={`mt-2 flex min-h-5 items-start gap-2 text-xs ${error ? "text-rose-300" : "text-emerald-300"}`}
        role={error ? "alert" : "status"}
        aria-live="polite"
      >
        {message &&
          (error ? (
            <AlertCircle className="size-4 shrink-0" />
          ) : (
            <CheckCircle2 className="size-4 shrink-0" />
          ))}
        <span>{message}</span>
      </div>
    </form>
  );
}
