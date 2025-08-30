import "dotenv/config";
import nodemailer from "nodemailer";

async function testSMTP() {
  // Debug log: show all env vars in table
  const envVars = {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS, // not hidden
  };
  console.log("\n🔍 Debugging SMTP Environment Variables:");
  console.table(envVars);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true, // set true if you are using port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("✅ SMTP connection successful");

    const mailOptions = {
      from: `admin@nexusberry.com`,
      to: "muhammadjehanzaib2021@gmail.com",
      subject: "SMTP Test",
      text: "If you see this, SMTP is working 🎉",
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(
      `📩 Test email sent successfully!\nMessage ID: ${info.messageId}\nTo: ${mailOptions.to}`
    );
  } catch (err) {
    console.error("❌ SMTP connection failed:");
    console.error(err);
  }
}

testSMTP();
