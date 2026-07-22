"use client";
import { FormEvent, useState } from "react";

export function Newsletter() {
  const [message, setMessage] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("You’re on the list. Thank you.");
    event.currentTarget.reset();
  }
  return (
    <form onSubmit={submit}>
      <label htmlFor="newsletter" className="sr-only">
        Email address
      </label>
      <div className="mt-3 flex">
        <input
          id="newsletter"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="focus-ring min-w-0 rounded-l-md border bg-white/5 px-3 py-2 text-sm"
          placeholder="you@example.com"
        />
        <button className="focus-ring rounded-r-md bg-accent px-3 text-sm font-medium hover:bg-blue-500">
          Join
        </button>
      </div>
      <p className="mt-2 min-h-5 text-xs text-emerald-400" role="status">
        {message}
      </p>
    </form>
  );
}
