/**
 * Luna Digital: contact form handler (POST /api/contact).
 *
 * Sends form messages by email through Resend (https://resend.com, free tier).
 * To turn it on, add these Environment Variables in the Vercel project settings:
 *   RESEND_API_KEY   your Resend API key
 *   CONTACT_TO       where messages go, e.g. contact@lunadigital.pro
 *   CONTACT_FROM     optional, e.g. "Luna Digital <noreply@lunadigital.pro>"
 *                    (needs lunadigital.pro verified in Resend; defaults to Resend's test sender)
 *
 * Until RESEND_API_KEY is set this returns ok:false, and the website falls back
 * to opening the visitor's own email app, so no message is lost.
 */
import { NextResponse } from "next/server";
import { isLocale, LOCALES } from "@/lib/i18n";
import { estimateText, parseChoices } from "@/lib/planPrices";
import { EMAIL_RE } from "@/lib/site";

const oneLine = (v: unknown, max: number) => String(v ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);

async function readBody(req: Request): Promise<Record<string, unknown>> {
  const type = req.headers.get("content-type") ?? "";
  if (type.includes("application/json")) return (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const form = await req.formData().catch(() => null);
  return form ? Object.fromEntries(form.entries()) : {};
}

export async function POST(req: Request) {
  const body = await readBody(req);

  // Honeypot: bots fill hidden fields. Pretend success so they don't retry.
  if (body._gotcha) return NextResponse.json({ ok: true });

  const name = oneLine(body.name, 100);
  const email = oneLine(body.email, 150);
  const company = oneLine(body.company, 150);
  const budget = oneLine(body.budget, 50);
  const locale = oneLine(body.locale, 5);
  const founding = Boolean(body.founding);
  const choices = parseChoices(body.plan); // only sent by the planner
  const message = String(body.message ?? "").trim().slice(0, 5000);

  const fields: string[] = [];
  if (name.length < 2) fields.push("name");
  if (!EMAIL_RE.test(email)) fields.push("email");
  if (message.length < 10) fields.push("message");
  if (fields.length) return NextResponse.json({ ok: false, error: "Invalid fields", fields }, { status: 422 });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (!apiKey || !to) return NextResponse.json({ ok: false, error: "Email sending not configured" }, { status: 503 });

  const text = [
    `${choices ? "New price request" : "New message"} from the Luna Digital website`,
    "----------------------------------------",
    `Name:    ${name}`,
    `Email:   ${email}`,
    company ? `Company: ${company}` : null,
    isLocale(locale) ? `Language: ${LOCALES[locale].name}` : null,
    budget ? `Budget:  ${budget}` : null,
    founding ? "Founding client spot: Yes (20% off)" : null,
    "",
    message,
    choices ? `\n----------------------------------------\n${estimateText(choices, founding)}` : null,
  ].filter((l) => l !== null).join("\n");

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || "Luna Digital <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject: `${founding ? "[Founding client] " : ""}${choices ? "Price request" : "New enquiry"} from ${name}${company ? ` (${company})` : ""}`,
        text,
      }),
    });
    if (!r.ok) throw new Error(`Resend responded ${r.status}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form email failed:", err);
    return NextResponse.json({ ok: false, error: "Could not send email" }, { status: 502 });
  }
}

export function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed" }, { status: 405 });
}
