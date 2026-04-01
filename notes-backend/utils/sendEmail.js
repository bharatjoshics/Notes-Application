import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, html) => {
  try {
    await resend.emails.send({
      from: "Vault Notes <auth@bharatjoshi.xyz>",
      to: [to],
      subject: subject,
      html: html
    });
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};