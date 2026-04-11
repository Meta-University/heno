import express from "express";
import { PrismaClient } from "@prisma/client";
import { io } from "../index.js";
import { sendEmailNotification } from "../emailNotifications.js";

const notificationRouter = express.Router();
const prisma = new PrismaClient();

const emailSubjects = {
  TASK_EDIT: "Task updated",
  COMMENT: "New comment on a task",
  TASK_DELETED: "Task deleted",
  TASK_CREATED: "New task created",
  COMMENT_DELETED: "Comment removed",
  PROJECT_UPDATED: "Project updated",
  PROJECT_DELETED: "Project deleted",
};

function emailHtml(type, userName, content) {
  const subjectLine = emailSubjects[type] || "Henō notification";
  return `
    <h1>${subjectLine}</h1>
    <p>Hello ${userName},</p>
    <p>${content}</p>
    <p><a href="http://localhost:5173/notifications">View notifications</a> or log in to the app for details.</p>
  `;
}

/**
 * Notify all users linked to a project (manager + team), except optional actor.
 * Persists notifications, emits Socket.IO, sends email when configured.
 */
export async function emitNotification(type, payload) {
  const {
    taskId = null,
    commentId = null,
    content,
    projectId,
    actorUserId = null,
  } = payload;

  if (!content || projectId == null) {
    console.warn("emitNotification: missing content or projectId", {
      type,
      projectId,
    });
    return;
  }

  const pid = parseInt(projectId, 10);
  if (Number.isNaN(pid)) {
    console.warn("emitNotification: invalid projectId", projectId);
    return;
  }

  const projectUsers = await prisma.user.findMany({
    where: {
      OR: [
        { projects: { some: { id: pid } } },
        { teamProjects: { some: { id: pid } } },
      ],
    },
  });

  let recipients = actorUserId
    ? projectUsers.filter((u) => u.id !== actorUserId)
    : projectUsers;

  // If you're the only person on the project, excluding the actor leaves nobody — still notify you.
  if (recipients.length === 0 && projectUsers.length > 0) {
    recipients = projectUsers;
  }

  if (recipients.length === 0) {
    return;
  }

  const tid =
    taskId != null && !Number.isNaN(parseInt(taskId, 10))
      ? parseInt(taskId, 10)
      : null;
  const cid =
    commentId != null && !Number.isNaN(parseInt(commentId, 10))
      ? parseInt(commentId, 10)
      : null;

  const notifications = await Promise.all(
    recipients.map((user) =>
      prisma.notification.create({
        data: {
          type,
          content,
          ...(tid != null ? { task_id: tid } : {}),
          ...(cid != null ? { comment_id: cid } : {}),
          user: { connect: { id: user.id } },
        },
      })
    )
  );

  notifications.forEach((notification) => {
    io.emit(`notifications-${notification.user_id}`, notification);
  });

  const subject = emailSubjects[type] || "Henō notification";
  for (const user of recipients) {
    if (!user.email) continue;
    await sendEmailNotification(
      user.email,
      subject,
      emailHtml(type, user.name, content)
    );
  }
}

notificationRouter.post("/notifications", async (req, res) => {
  const { type, taskId, commentId, content, projectId } = req.body;
  const userId = req.session.user.id;
  try {
    const notification = await prisma.notification.create({
      data: {
        type,
        content,
        ...(taskId != null ? { task_id: parseInt(taskId, 10) } : {}),
        ...(commentId != null ? { comment_id: parseInt(commentId, 10) } : {}),
        user: {
          connect: { id: parseInt(userId, 10) },
        },
      },
    });

    io.emit(`notifications-${userId}`, notification);
    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
});

notificationRouter.get("/notifications", async (req, res) => {
  const sessionUserId = req.session?.user?.id;
  if (sessionUserId == null) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { user_id: parseInt(sessionUserId, 10) },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

notificationRouter.get("/notifications/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await prisma.notification.findMany({
      where: { user_id: parseInt(userId, 10) },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

notificationRouter.delete("/notifications/:id", async (req, res) => {
  try {
    const sessionUserId = req.session?.user?.id;
    if (sessionUserId == null) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid notification id" });
    }

    const existing = await prisma.notification.findUnique({
      where: { id },
    });
    if (!existing) {
      return res.status(404).json({ message: "Notification not found" });
    }
    if (existing.user_id !== parseInt(sessionUserId, 10)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.notification.delete({
      where: { id },
    });

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(500).json({
      message: "Error deleting notification",
      error: error.message,
    });
  }
});

export default notificationRouter;
