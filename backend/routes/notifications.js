import express from "express";
import { PrismaClient } from "@prisma/client";
import { io } from "../index.js";
import { sendEmailNotification } from "../emailNotifications.js";

const notificationRouter = express.Router();
const prisma = new PrismaClient();

async function emitNotification(type, taskId, commentId, content, projectId) {
  const projectUsers = await prisma.user.findMany({
    where: {
      OR: [
        { projects: { some: { id: projectId } } },
        { teamProjects: { some: { id: projectId } } },
      ],
    },
  });

  const notifications = await Promise.all(
    projectUsers.map(async (user) => {
      return prisma.notification.create({
        data: {
          type,
          task_id: parseInt(taskId),
          comment_id: parseInt(commentId),
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

  projectUsers.map(async (user) => {
    if (type === "TASK_EDIT") {
      await sendEmailNotification(
        "joyoneh.15@gmail.com",
        "Task Updated",
        `<h1>Task Updated</h1>
            <p>Hello ${user.name},</p>
         <p>${content}</p>
         <p>Please log in to the system to view the comment and respond if necessary.</p>
        `
      );
    } else if (type === "COMMENT") {
      await sendEmailNotification(
        "joyoneh.15@gmail.com",
        "New Comment on Task",
        `<h1>New Comment on Task</h1>
        <p>Hello ${user.name},</p>
         <p>${content}</p>
         <p>Please log in to the system to view the comment and respond if necessary.</p>`
      );
    }
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
