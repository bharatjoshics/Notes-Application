import axios from "axios";

export const sendEmail = async (to, subject, html) => {
  try {
    await axios.post(
      "https://send.api.mailtrap.io/api/send",
      {
        from: {
          email: "hello@notesapp.com",
          name: "Notes App"
        },
        to: [{ email: to }],
        subject,
        html
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MAILTRAP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    console.error("Email sending failed:", err.message);
  }
};