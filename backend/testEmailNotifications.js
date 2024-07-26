import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
import env from "dotenv";

env.config();
const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function testEmailSending() {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "joyoneh.15@gmail.com",
      subject: "Test Email",
      html: "<h1>This is a test email</h1><p>If you receive this, email sending is working.</p>",
    });
  } catch (error) {
    console.error("Error sending test email:", error);
  }
}

testEmailSending();
