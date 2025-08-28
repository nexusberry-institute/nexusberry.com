import "dotenv/config";
import nodemailer from "nodemailer";

async function testSMTP() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === "465", // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("✅ SMTP connection successful");

    // send a test email
    const info = await transporter.sendMail({
      from: `"Nexusberry Test" <${process.env.SMTP_USER}>`,
      to: "mjehanzaib084@gmail.com", // put your own email here
      subject: "SMTP Test",
      text: "If you see this, SMTP is working 🎉",
    });

    console.log("📩 Test email sent:", info.messageId);
  } catch (err) {
    console.error("❌ SMTP connection failed:", err);
  }
}

testSMTP();
