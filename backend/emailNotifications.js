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

async function sendReminderNotificationEmail(user, task, type) {
  const subject = type === "start" ? "Task Starting Soon" : "Task Due Soon";
  const html = `
    <h1>${subject}</h1>
    <p>Hello ${user.name},</p>
    <p>This is a reminder about your task: ${task.title}</p>
    <p>${type === "start" ? "Start" : "Due"} Date: ${new Date(
    type === "start" ? task.start_date : task.due_date
  ).toLocaleDateString()}</p>
    <p>Please log in to your account for more details.</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: "joyoneh.15@gmail.com",
    subject,
    html,
  });
}

export async function sendEmailNotification(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export async function checkAndSendNotifications() {
  const today = new Date();
  const threeDaysFromNow = new Date(today.setDate(today.getDate() + 3));

  const upcomingTasks = await prisma.task.findMany({
    where: {
      OR: [
        { start_date: { lte: threeDaysFromNow, gt: today } },
        { due_date: { lte: threeDaysFromNow, gt: today } },
      ],
    },
    include: {
      assignee: true,
    },
  });

  for (const task of upcomingTasks) {
    if (
      new Date(task.start_date) <= threeDaysFromNow &&
      new Date(task.start_date) > today
    ) {
      await sendReminderNotificationEmail(task.assignee, task, "start");
    }
    if (
      new Date(task.due_date) <= threeDaysFromNow &&
      new Date(task.due_date) > today
    ) {
      await sendReminderNotificationEmail(task.assignee, task, "due");
    }
  }
}
