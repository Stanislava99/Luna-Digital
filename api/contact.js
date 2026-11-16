/**
 * Luna Digital — contact form handler (Vercel serverless function).
 *
 * Sends form messages by email through Resend (https://resend.com, free tier).
 * To turn it on, add these Environment Variables in the Vercel project settings:
 *   RESEND_API_KEY   your Resend API key
 *   CONTACT_TO       where messages go, e.g. contact@lunadigital.pro (or your Gmail)
 *   CONTACT_FROM     optional, e.g. "Luna Digital <noreply@lunadigital.pro>"
 *                    (needs lunadigital.pro verified in Resend; defaults to Resend's test sender)
 *
 * Until RESEND_API_KEY is set, this returns ok:false and the website falls back
 * to opening the visitor's own email app, so no message is lost.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const oneLine = (v, max) => String(v || "").replace(/[\r\n]+/g, " ").trim().slice(0, max);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body = req.body || {};

  // Honeypot: bots fill hidden fields. Pretend success so they don't retry.
  if (body._gotcha) return res.status(200).json({ ok: true });

  const name = oneLine(body.name, 100);
  const email = oneLine(body.email, 150);
  const company = oneLine(body.company, 150);
  const budget = oneLine(body.budget, 50);
  const founding = body.founding ? "Yes" : "";
  const message = String(body.message || "").trim().slice(0, 5000);

  const errors = [];
  if (name.length < 2) errors.push("name");
  if (!EMAIL_RE.test(email)) errors.push("email");
  if (message.length < 10) errors.push("message");
  if (errors.length) return res.status(422).json({ ok: false, error: "Invalid fields", fields: errors });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (!apiKey || !to) {
    return res.status(503).json({ ok: false, error: "Email sending not configured" });
  }

  const text = [
    "New message from the Luna Digital website",
    "----------------------------------------",
    `Name:    ${name}`,
    `Email:   ${email}`,
    company ? `Company: ${company}` : null,
    budget ? `Budget:  ${budget}` : null,
    founding ? "Founding client spot: Yes (20% off)" : null,
    "",
    message,
  ].filter((l) => l !== null).join("\n");

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || "Luna Digital <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject: `${founding ? "[Founding client] " : ""}New enquiry from ${name}${company ? ` (${company})` : ""}`,
        text,
      }),
    });
    if (!r.ok) throw new Error(`Resend responded ${r.status}`);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact form email failed:", err);
    return res.status(502).json({ ok: false, error: "Could not send email" });
  }
};
