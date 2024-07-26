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
  const loginUrl = "http://localhost:5173/login";
  const html = `
    <h1>${subject}</h1>
    <p>Hello ${user.name},</p>
    <p>This is a reminder that the ${
      type === "start" ? "start date" : "due date"
    } of your task: ${task.title} is fast approaching</p>
    <p>${type === "start" ? "Start" : "Due"} Date: ${new Date(
    type === "start" ? task.start_date : task.due_date
  ).toLocaleDateString()}</p>
    <p>Please <a href="${loginUrl}">log in</a>  to your account for more details.</p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject,
      html,
    });
  } catch (error) {
    console.error(
      `Error sending email to ${user.email} for task ${task.title}:`,
      error
    );
  }
}

export async function sendEmailNotification(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export async function checkAndSendNotifications() {
  const today = new Date();
  const threeDaysFromNow = new Date(today);
  threeDaysFromNow.setDate(today.getDate() + 3);

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
