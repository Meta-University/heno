import express from "express";
import { PrismaClient } from "@prisma/client";
import { io } from "../index.js";
// import { sendEmailNotification } from "../emailNotifications.js";

const notificationRouter = express.Router();
const prisma = new PrismaClient();

async function emitNotification(type, taskId, commentId, content, projectId) {
  let usersToNotify = [];

  if (projectId) {
    usersToNotify = await prisma.user.findMany({
      where: {
        OR: [
          { projects: { some: { id: projectId } } },
          { teamProjects: { some: { id: projectId } } },
        ],
      },
    });
  } else {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(taskId) },
      include: { assignee: true },
    });
    if (task && task.assignee) {
      usersToNotify = [task.assignee];
    }
  }

  const notifications = await Promise.all(
    usersToNotify.map(async (user) => {
      return prisma.notification.create({
        data: {
          type,
          task_id: parseInt(taskId),
          comment_id: commentId ? parseInt(commentId) : null,
          user: {
            connect: { id: parseInt(user.id) },
          },
          content,
        },
      });
    })
  );

  notifications.forEach((notification) => {
    io.emit(`notifications-${notification.user_id}`, notification);
  });
}

notificationRouter.post("/notifications", async (req, res) => {
  const { type, taskId, commentId, content, projectId } = req.body;
  const userId = req.session.user.id;
  try {
    const notification = await prisma.notification.create({
      data: {
        type,
        taskId,
        commentId,
        content,
        user: {
          connect: { id: parseInt(userId) },
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

notificationRouter.get("/notifications/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await prisma.notification.findMany({
      where: { user_id: parseInt(userId) },
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
    const { id } = req.params;
    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting notification", error: error.message });
  }
});

export { emitNotification };
export default notificationRouter;
