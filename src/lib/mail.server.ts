import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import nodemailer from "nodemailer";
import { env } from "@/lib/env.server";
import { HOST_EMAIL, HOST_NAME } from "@/lib/brand";

export type JoinMail = {
  name: string;
  email: string;
};

export async function sendJoinEmail({ name, email }: JoinMail): Promise<void> {
  const join = env("WEBINAR_JOIN_URL");
  const first = name.split(/\s+/)[0] ?? name;
  const subject = "You're in — CISSP first-attempt, Sunday 4 Oct";
  const text = join
    ? [
        `Hi ${first},`,
        "",
        "Seat confirmed. Sunday 4 October 2026, 10:00–12:00 IST. Live only — no recording.",
        "",
        "Join here (laptop, not a phone if you can):",
        join,
        "",
        "Bring one practice item you keep missing. Cameras optional. Notes expected.",
        "",
        `— ${HOST_NAME}`,
        HOST_EMAIL,
      ].join("\n")
    : [
        `Hi ${first},`,
        "",
        "Seat confirmed. Sunday 4 October 2026, 10:00–12:00 IST. Live only — no recording.",
        "",
        `The join link is not on this mail yet. Watch this thread — it will come from ${HOST_EMAIL} before Sunday.`,
        "",
        `— ${HOST_NAME}`,
      ].join("\n");

  const html = join
    ? `<p>Hi ${escapeHtml(first)},</p>
<p>Seat confirmed. Sunday 4 October 2026, 10:00–12:00 IST. Live only — no recording.</p>
<p><a href="${escapeHtml(join)}">Join the webinar</a></p>
<p>Bring one practice item you keep missing. Cameras optional. Notes expected.</p>
<p>— ${escapeHtml(HOST_NAME)}<br>${escapeHtml(HOST_EMAIL)}</p>`
    : `<p>Hi ${escapeHtml(first)},</p>
<p>Seat confirmed. Sunday 4 October 2026, 10:00–12:00 IST. Live only — no recording.</p>
<p>The join link is not on this mail yet. Watch this thread — it will come from ${escapeHtml(HOST_EMAIL)} before Sunday.</p>
<p>— ${escapeHtml(HOST_NAME)}</p>`;

  const from = env("EMAIL_FROM") ?? env("GMAIL_USER") ?? HOST_EMAIL;
  const resend = env("RESEND_API_KEY");
  if (resend) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resend}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${HOST_NAME} <${from}>`,
        to: [email],
        bcc: [HOST_EMAIL],
        reply_to: HOST_EMAIL,
        subject,
        text,
        html,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Resend failed: ${res.status} ${detail}`);
    }
    return;
  }

  const user = env("GMAIL_USER");
  const pass = env("GMAIL_APP_PASSWORD");
  if (!user || !pass) {
    throw new Error("Set GMAIL_USER + GMAIL_APP_PASSWORD, or RESEND_API_KEY, on Vercel.");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
  await transporter.sendMail({
    from: `${HOST_NAME} <${user}>`,
    to: email,
    bcc: HOST_EMAIL,
    replyTo: HOST_EMAIL,
    subject,
    text,
    html,
  });
}

export function verifyDodoWebhook(rawBody: string, headers: Headers, secret: string): boolean {
  const id = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const signatureHeader = headers.get("webhook-signature");
  if (!id || !timestamp || !signatureHeader) return false;

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${rawBody}`).digest("base64");
  const presented = signatureHeader
    .split(" ")
    .map((part) => part.replace(/^v1,/i, "").trim())
    .filter(Boolean);
  return presented.some((sig) => timingEqual(sig, expected));
}

export function paymentCustomer(payload: unknown): JoinMail | null {
  const root = payload as {
    type?: string;
    data?: {
      customer?: { email?: string; name?: string };
      metadata?: { email?: string; name?: string };
    };
  };
  if (root?.type && root.type !== "payment.succeeded") return null;
  const customer = root?.data?.customer;
  const email = customer?.email?.trim().toLowerCase();
  const name = customer?.name?.trim() || "there";
  if (!email || !email.includes("@")) return null;
  return { email, name };
}

function timingEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    createHash("sha256").update(left).digest();
    return false;
  }
  return timingSafeEqual(left, right);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&" + "amp;")
    .replaceAll("<", "&" + "lt;")
    .replaceAll(">", "&" + "gt;")
    .replaceAll('"', "&" + "quot;");
}
