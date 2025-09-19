import nodemailer from "nodemailer";
import { loginEmailTemplate } from '@/components/email_template/page';

export async function POST(req) {
  const { to, userName, loginDate, userIp, deviceInfo} = await req.json();
  const emailHtml = loginEmailTemplate({
      userName,
      loginDate,
      userIp,
      deviceInfo,
      resetLink:"https://localhost:3000/",
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Split Sharing App" <${process.env.SMTP_USER}>`,
    to,
    subject: "Login Notification",
    html: emailHtml,
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
