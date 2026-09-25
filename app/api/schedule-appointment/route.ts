import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import {
  buildAppointmentEmails,
  getEmailLogoAttachment,
} from "@/lib/appointment-emails";

type AppointmentPayload = {
  companyName?: string;
  email?: string;
  appointmentType?: string;
  date?: string;
  time?: string;
  duration?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AppointmentPayload;

    const companyName = body.companyName?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const appointmentType = body.appointmentType?.trim() ?? "";
    const date = body.date?.trim() ?? "";
    const time = body.time?.trim() ?? "";
    const duration = body.duration?.trim() ?? "";

    if (
      !companyName ||
      !email ||
      !appointmentType ||
      !date ||
      !time ||
      !duration
    ) {
      return NextResponse.json(
        { error: "Please complete all fields before scheduling." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM;
    const to = process.env.SMTP_TO;

    if (!host || !user || !pass || !from || !to) {
      console.error("SMTP environment variables are missing.");
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: { user, pass },
    });

    const emails = buildAppointmentEmails({
      companyName,
      email,
      appointmentType,
      date,
      time,
      duration,
    });

    await Promise.all([
      transporter.sendMail({
        from: `"NORTH POINT SALES GROUP" <${from}>`,
        to,
        replyTo: email,
        subject: emails.internalSubject,
        text: emails.internalText,
        html: emails.internalHtml,
        attachments: [getEmailLogoAttachment()],
      }),
      transporter.sendMail({
        from: `"NORTH POINT SALES GROUP" <${from}>`,
        to: email,
        replyTo: from,
        subject: emails.confirmationSubject,
        text: emails.confirmationText,
        html: emails.confirmationHtml,
        attachments: [getEmailLogoAttachment()],
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send appointment email:", error);

    const responseText =
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response?: unknown }).response === "string"
        ? (error as { response: string }).response
        : "";

    const messageText =
      error instanceof Error ? error.message : "Unknown email error";

    const senderNotVerified =
      /verified Sender Identity/i.test(responseText) ||
      /verified Sender Identity/i.test(messageText);

    return NextResponse.json(
      {
        error: senderNotVerified
          ? "Email could not be sent because the From address is not verified in SendGrid. Please verify contact@northpointsalesgroup.com (or your domain) in SendGrid Sender Identity."
          : "Unable to send appointment request. Please try again.",
      },
      { status: 500 },
    );
  }
}
