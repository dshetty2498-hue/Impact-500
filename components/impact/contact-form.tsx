"use client";

import { FormEvent, useId, useState } from "react";
import { AlertCircle, CheckCircle2, LoaderCircle, Send } from "lucide-react";

type Status = { kind: "idle" | "success" | "error"; message: string };

export function ContactForm() {
  const id = useId();
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    setPending(true);
    setStatus({ kind: "idle", message: "" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok && response.status === 503) {
        const subject = String(data.subject ?? "Impact Horizon inquiry");
        const body = [
          `Name: ${String(data.name ?? "")}`,
          `Email: ${String(data.email ?? "")}`,
          `Organization: ${String(data.organization ?? "Not provided") || "Not provided"}`,
          "",
          String(data.message ?? ""),
        ].join("\n");
        window.location.href = `mailto:dshetty2498@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setStatus({
          kind: "success",
          message:
            "Server delivery is unavailable, so your email app was opened with this inquiry addressed to our research desk.",
        });
        return;
      }
      if (!response.ok) throw new Error(result.error ?? "Inquiry delivery failed.");
      form.reset();
      setStatus({
        kind: "success",
        message: "Your inquiry was delivered. Thank you—we’ll review it shortly.",
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "Inquiry delivery failed.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="surface-card grid gap-5" aria-busy={pending} noValidate>
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${id}-name`} label="Name" name="name" autoComplete="name" required />
        <Field
          id={`${id}-organization`}
          label="Organization"
          name="organization"
          autoComplete="organization"
          optional
        />
      </div>
      <Field
        id={`${id}-email`}
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
      />
      <Field id={`${id}-subject`} label="Subject" name="subject" required />
      <label htmlFor={`${id}-message`} className="grid gap-2 text-sm font-medium text-slate-300">
        Message <span className="sr-only">(required)</span>
        <textarea
          id={`${id}-message`}
          name="message"
          required
          maxLength={5000}
          rows={7}
          className="form-control resize-y"
        />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button className="button-primary" type="submit" disabled={pending}>
          {pending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send inquiry <Send className="size-4" />
            </>
          )}
        </button>
        {status.message && (
          <p
            role={status.kind === "error" ? "alert" : "status"}
            className={`flex max-w-xl items-start gap-2 text-sm ${status.kind === "error" ? "text-rose-300" : "text-emerald-300"}`}
          >
            {status.kind === "error" ? (
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
            ) : (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            )}
            {status.message}
          </p>
        )}
      </div>
      <p className="text-xs leading-5 text-slate-500">
        You can also email the research desk directly at{" "}
        <a className="text-cyan hover:underline" href="mailto:dshetty2498@gmail.com">
          dshetty2498@gmail.com
        </a>
        .
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  name,
  type = "text",
  autoComplete,
  required = false,
  optional = false,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <label htmlFor={id} className="grid gap-2 text-sm font-medium text-slate-300">
      <span>
        {label} {optional && <span className="font-normal text-slate-500">(optional)</span>}
        {required && <span className="sr-only"> (required)</span>}
      </span>
      <input
        id={id}
        className="form-control"
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        maxLength={type === "email" ? 254 : 160}
      />
    </label>
  );
}
