"use client";

import { createContext, useCallback, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { prefersReducedMotion } from "@/lib/site";

export type ContactForm = {
  name: string;
  email: string;
  company: string;
  budget: string;
  founding: boolean;
  message: string;
  _gotcha: string;
};

export const EMPTY_FORM: ContactForm = { name: "", email: "", company: "", budget: "", founding: false, message: "", _gotcha: "" };

type Ctx = {
  form: ContactForm;
  setForm: Dispatch<SetStateAction<ContactForm>>;
  /** Fill in parts of the contact form, then scroll to it and focus the name field. */
  prefill: (patch: Partial<ContactForm> | ((f: ContactForm) => Partial<ContactForm>)) => void;
};

const ContactContext = createContext<Ctx | null>(null);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [form, setForm] = useState<ContactForm>(EMPTY_FORM);

  const prefill = useCallback<Ctx["prefill"]>((patch) => {
    setForm((f) => ({ ...f, ...(typeof patch === "function" ? patch(f) : patch) }));
    document.getElementById("contact")?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
    setTimeout(() => document.getElementById("name")?.focus({ preventScroll: true }), 700);
  }, []);

  return <ContactContext.Provider value={{ form, setForm, prefill }}>{children}</ContactContext.Provider>;
}

export function useContact() {
  const ctx = useContext(ContactContext);
  if (!ctx) throw new Error("useContact must be used inside <ContactProvider>");
  return ctx;
}
