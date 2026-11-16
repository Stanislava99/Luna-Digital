"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Reveal } from "@/components/Reveal";
import { useToast } from "@/components/Toast";
import { track } from "@/lib/analytics";
import { CONTACT_EMAIL, EMAIL_RE, openMailClient, sendToServer } from "@/lib/site";
import { EMPTY_FORM, useContact, type ContactForm } from "./ContactContext";

const BUDGETS = ["Under €300", "€300–1,000", "€1,000–3,000", "€3,000+"];

type Field = "name" | "email" | "message";
const RULES: Record<Field, (v: string) => boolean> = {
  name: (v) => v.trim().length > 1,
  email: (v) => EMAIL_RE.test(v.trim()),
  message: (v) => v.trim().length >= 10,
};

export function ContactSection() {
  const toast = useToast();
  const { form, setForm } = useContact();
  const [invalid, setInvalid] = useState<Partial<Record<Field, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [sentName, setSentName] = useState<string | null>(null);

  const set = <K extends keyof ContactForm>(key: K, value: ContactForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    // Re-check a field as soon as the visitor fixes it
    if (key in RULES && invalid[key as Field]) setInvalid((i) => ({ ...i, [key]: !RULES[key as Field](String(value)) }));
  };
  const check = (field: Field) => form[field] && setInvalid((i) => ({ ...i, [field]: !RULES[field](form[field]) }));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = { name: !RULES.name(form.name), email: !RULES.email(form.email), message: !RULES.message(form.message) };
    setInvalid(result);
    const firstBad = (Object.keys(result) as Field[]).find((k) => result[k]);
    if (firstBad) {
      document.getElementById(firstBad)?.focus();
      return;
    }
    if (form._gotcha) return; // bot

    setLoading(true);
    try {
      const fields: Record<string, string> = {
        name: form.name, email: form.email, company: form.company, budget: form.budget, message: form.message,
        ...(form.founding ? { founding: "Yes" } : {}),
      };
      const sent = await sendToServer(fields);
      if (!sent) {
        // Server unavailable: let the visitor send it from their own email app
        const subject = `${form.founding ? "[Founding client] " : ""}New project enquiry from ${form.name}${form.company ? ` (${form.company})` : ""}`;
        const body =
          `Name: ${form.name}\nEmail: ${form.email}\n` +
          (form.company ? `Company: ${form.company}\n` : "") +
          (form.budget ? `Budget: ${form.budget}\n` : "") +
          (form.founding ? "Founding client spot: Yes\n" : "") +
          `\n${form.message}`;
        openMailClient(subject, body);
        toast("Opening your email app to finish sending…");
        await new Promise((r) => setTimeout(r, 600));
      }
      setSentName(form.name.trim().split(" ")[0]);
      track("Contact form sent", { founding: form.founding });
      setForm(EMPTY_FORM);
    } catch {
      toast(`Something went wrong — please email us at ${CONTACT_EMAIL}`);
    } finally {
      setLoading(false);
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      toast("Email copied to clipboard");
    } catch {
      toast(CONTACT_EMAIL);
    }
  }

  const fieldClass = (f: Field) => `field${invalid[f] ? " is-invalid" : ""}`;

  return (
    <section className="section section--tint" id="contact">
      <div className="container contact">
        <Reveal className="contact__info">
          <p className="eyebrow">Contact</p>
          <h2>Let&apos;s build something <em>luminous</em></h2>
          <p className="section__sub">
            Tell us a little about your project. We reply within one business day with next steps and a time for a free
            30-minute call.
          </p>
          <ul className="contact__list">
            <li>
              <span className="icon-tile">
                <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
              </span>
              <span>
                <small>Email</small>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </span>
              <button className="copy" type="button" aria-label="Copy email address" onClick={copyEmail}>Copy</button>
            </li>
          </ul>
          <Link href="/builder" className="planner-link">
            <span><b>Have a rental?</b> Plan your website in 2 minutes and send it to us.</span>
            <span aria-hidden="true">→</span>
          </Link>
        </Reveal>

        <Reveal as="form" className="contact__form" id="contactForm" noValidate onSubmit={onSubmit}>
          <div className="field-row">
            <div className={fieldClass("name")}>
              <label htmlFor="name">Your name</label>
              <input id="name" name="name" type="text" autoComplete="name" required placeholder="Jane Doe"
                value={form.name} aria-invalid={!!invalid.name}
                onChange={(e) => set("name", e.target.value)} onBlur={() => check("name")} />
              <span className="field__error">Please tell us your name.</span>
            </div>
            <div className={fieldClass("email")}>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required placeholder="jane@company.com"
                value={form.email} aria-invalid={!!invalid.email}
                onChange={(e) => set("email", e.target.value)} onBlur={() => check("email")} />
              <span className="field__error">Please enter a valid email.</span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="company">Business name <small>(optional)</small></label>
            <input id="company" name="company" type="text" autoComplete="organization" placeholder="e.g. Villa Olive"
              value={form.company} onChange={(e) => set("company", e.target.value)} />
          </div>
          <fieldset className="field">
            <legend>Budget</legend>
            <div className="chips">
              {BUDGETS.map((b) => (
                <label className="chip" key={b}>
                  <input type="radio" name="budget" value={b} checked={form.budget === b} onChange={() => set("budget", b)} />
                  <span>{b}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="check">
            <input type="checkbox" name="founding" id="foundingCheck" checked={form.founding}
              onChange={(e) => set("founding", e.target.checked)} />
            <span>I&apos;d like one of the 5 founding client spots (20% off, in exchange for an honest review)</span>
          </label>
          <div className={fieldClass("message")}>
            <label htmlFor="message">Project details</label>
            <textarea id="message" name="message" rows={5} required
              placeholder="What are you building, and what does success look like?"
              value={form.message} aria-invalid={!!invalid.message}
              onChange={(e) => set("message", e.target.value)} onBlur={() => check("message")} />
            <span className="field__error">A few words about your project, please (min. 10 characters).</span>
          </div>
          <input type="text" name="_gotcha" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true"
            value={form._gotcha} onChange={(e) => set("_gotcha", e.target.value)} />
          <button className={`btn btn--primary btn--block btn--lg${loading ? " is-loading" : ""}`} type="submit" disabled={loading}>
            <span className="btn__label">Send message</span>
            <span className="spinner" aria-hidden="true"></span>
          </button>
          <p className="form__note">By sending, you agree we may contact you about your enquiry. No spam, ever.</p>

          <div className="form__success" role="status" hidden={sentName === null}>
            <div className="success__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5 10 17l9-10" /></svg>
            </div>
            <h3>Message received!</h3>
            <p>Thanks, {sentName || "friend"}. We&apos;ll get back to you within one business day.</p>
            <button className="btn btn--ghost" type="button"
              onClick={() => { setSentName(null); document.getElementById("name")?.focus(); }}>
              Send another
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
