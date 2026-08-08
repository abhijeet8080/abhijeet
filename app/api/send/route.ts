import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface ContactPayload {
  senderEmail?: string;
  senderName?: string;
  reasonToContact?: string;
  senderMsg?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: ContactPayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { senderEmail, senderName, reasonToContact, senderMsg } = body;

  if (!senderEmail || !EMAIL_RE.test(senderEmail)) {
    return NextResponse.json(
      { ok: false, error: "A valid sender email is required" },
      { status: 400 }
    );
  }
  if (!senderName?.trim() || !senderMsg?.trim()) {
    return NextResponse.json(
      { ok: false, error: "Name and message are required" },
      { status: 400 }
    );
  }

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const to = process.env.EMAIL_TO || "abhijeetkadam.dev@gmail.com";

  if (!user || !pass) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Email service is not configured. Set EMAIL_USER and EMAIL_PASS env vars.",
      },
      { status: 503 }
    );
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT || 465),
    secure: true,
    auth: { user, pass },
  });

  const html = `
    <div style="font-family: ui-monospace, monospace; background:#0a0a0f; color:#eee; padding:24px; border-radius:12px;">
      <h2 style="margin:0 0 16px; color:#7dd3fc;">New message via abhi os</h2>
      <p><strong>Name:</strong> ${senderName}</p>
      <p><strong>Email:</strong> ${senderEmail}</p>
      <p><strong>Reason:</strong> ${reasonToContact || "—"}</p>
      <hr style="border-color:#222; margin:16px 0;" />
      <p style="white-space:pre-wrap;">${senderMsg}</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"abhi os contact" <${user}>`,
      to,
      replyTo: senderEmail,
      subject: `[Portfolio] ${reasonToContact || "New message"} — ${senderName}`,
      text: `Name: ${senderName}\nEmail: ${senderEmail}\nReason: ${reasonToContact || "—"}\n\n${senderMsg}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/send] failed to send email:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
