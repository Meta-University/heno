import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
import env from "dotenv";

env.config();
const prisma = new PrismaClient();

let transporter;

function areEmailNotificationsEnabled() {
  const v = process.env.EMAIL_NOTIFICATIONS_ENABLED?.toLowerCase();
  return v !== "false" && v !== "0";
}

function getMailer() {
  if (!areEmailNotificationsEnabled()) {
    return null;
  }
  if (!process.env.EMAIL_HOST) {
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

/** If set, every notification email is delivered here (dev / single-inbox testing). */
function resolveOutboundEmailTo(intendedTo) {
  const override = process.env.EMAIL_NOTIFICATIONS_TO?.trim();
  if (override) {
    return override;
  }
  return intendedTo;
}

async function sendReminderNotificationEmail(user, task, type) {
  const subject = type === "start" ? "Task Starting Soon" : "Task Due Soon";
  const loginUrl = "http://localhost:5173/login";
  const override = process.env.EMAIL_NOTIFICATIONS_TO?.trim();
  const routingNote = override
    ? `<p><em>Originally for: ${user.name} &lt;${user.email}&gt;</em></p>`
    : "";

  const html = `
    <h1>${subject}</h1>
    <p>Hello ${user.name},</p>
    ${routingNote}
    <p>This is a reminder that the ${
      type === "start" ? "start date" : "due date"
    } of your task: ${task.title} is fast approaching</p>
    <p>${type === "start" ? "Start" : "Due"} Date: ${new Date(
    type === "start" ? task.start_date : task.due_date
  ).toLocaleDateString()}</p>
    <p>Please <a href="${loginUrl}">log in</a>  to your account for more details.</p>
  `;

  const mailer = getMailer();
  if (!mailer) return;
  const to = resolveOutboundEmailTo(user.email);
  if (!to) return;
  try {
    await mailer.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error(
      `Error sending reminder email (${to}) for task ${task.title}:`,
      error
    );
  }
}

export async function sendEmailNotification(to, subject, html) {
  const mailer = getMailer();
  const recipient = resolveOutboundEmailTo(to);
  if (!mailer || !recipient) {
    return;
  }
  const override = process.env.EMAIL_NOTIFICATIONS_TO?.trim();
  const body =
    override && to && to !== override
      ? `<p><em>Originally for: ${to}</em></p>${html}`
      : html;
  try {
    await mailer.sendMail({
      from: process.env.EMAIL_FROM,
      to: recipient,
      subject,
      html: body,
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
