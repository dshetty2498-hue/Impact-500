import "server-only";

import nodemailer from "nodemailer";

export const INQUIRY_DESTINATION = "dshetty2498@gmail.com";

type Mail = {
  subject: string;
  text: string;
  replyTo?: string;
};

export async function sendImpactHorizonEmail(mail: Mail) {
  const user = process.env.GMAIL_USER?.trim();
  const password = process.env.GMAIL_APP_PASSWORD?.replaceAll(" ", "").trim();
  if (!user || !password) {
    throw new Error("EMAIL_NOT_CONFIGURED");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass: password },
  });

  await transporter.sendMail({
    from: `Impact Horizon Website <${user}>`,
    to: INQUIRY_DESTINATION,
    replyTo: mail.replyTo,
    subject: mail.subject,
    text: mail.text,
  });
}
