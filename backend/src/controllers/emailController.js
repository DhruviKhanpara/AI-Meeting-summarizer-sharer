import nodemailer from "nodemailer";
import EmailLog from "../models/EmailLog.js";

export const sendEmail = async (req, res) => {
  const { recipients, subject, summary, transcript, prompt } = req.body;

  if (!recipients || !summary || !transcript) {
    return res.status(400).json({ message: "Recipients, summary, transcript are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipients,
      subject: subject || "Meeting Summary",
      html: `
        <h2>Meeting Transcript</h2>
        <p>${transcript}</p>
        <hr/>
        <h2>Prompt</h2>
        <p>${prompt}</p>
        <hr/>
        <h2>Summary</h2>
        <p>${summary}</p>
      `
    });

    await EmailLog.create({
      recipients,
      subject: subject || "Meeting Summary",
      transcript,
      prompt,
      summary,
      status: "SENT"
    });

    res.json({ message: "Email sent and logged successfully" });
  } catch (error) {
    console.error("Email error:", error);

    await EmailLog.create({
      recipients,
      subject: subject || "Meeting Summary",
      transcript,
      prompt,
      summary,
      status: "FAILED",
      error: error.message
    });

    res.status(500).json({ message: "Error sending email" });
  }
};
