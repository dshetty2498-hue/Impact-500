"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = String(form.get("subject") || "Impact500 inquiry");
    const body = [`Name: ${form.get("name")}`, `Organization: ${form.get("organization") || "Not provided"}`, `Email: ${form.get("email")}`, "", String(form.get("message"))].join("\n");
    window.location.href = `mailto:research@impact500.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  return <form onSubmit={submit} className="surface-card grid gap-5" aria-describedby={sent ? "contact-confirmation" : undefined}>
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Full Name" name="name" required /><Field label="Organization (Optional)" name="organization" /></div>
    <Field label="Email Address" name="email" type="email" required />
    <Field label="Subject" name="subject" required />
    <label className="grid gap-2 text-sm font-medium text-slate-300">Message<textarea name="message" required rows={7} className="form-control resize-y" /></label>
    <div className="flex flex-wrap items-center gap-4"><button className="button-primary" type="submit">Send Message <Send className="size-4" /></button>{sent && <p id="contact-confirmation" role="status" className="flex items-center gap-2 text-sm text-emerald-400"><CheckCircle2 className="size-4" />Your email application has opened with the message prepared.</p>}</div>
  </form>;
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return <label className="grid gap-2 text-sm font-medium text-slate-300">{label}<input className="form-control" name={name} type={type} required={required} /></label>;
}
