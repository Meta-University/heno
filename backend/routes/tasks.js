import express from "express";
import { PrismaClient } from "@prisma/client";
import { emitNotification } from "./notifications.js";
import { io } from "../index.js";

const taskRouter = express.Router();
const prisma = new PrismaClient();

const LOCK_TIMEOUT = 60000;
const blockedUsers = new Map();

async function acquireLock(taskId, field, userId) {
  const now = new Date();
  const task = await prisma.task.findUnique({
    where: { id: parseInt(taskId) },
    include: {
      [`${field}_lockUser`]: true,
    },
  });
  if (!task) {
    throw new Error("Task not found");
  }

  const lockField = `${field}_is_updating`;
  const lockTimestampField = `${field}_lockTimestamp`;
  const lockUserField = `${field}_lockUser_id`;

  if (
    task[lockField] &&
    new Date(task[lockTimestampField].getTime() + LOCK_TIMEOUT) > now
  ) {
    return { acquired: false, lockUser: task[`${field}_lockUser`] };
  }

  await prisma.task.update({
    where: { id: parseInt(taskId) },
    data: {
      [lockField]: true,
      [lockTimestampField]: now,
      [lockUserField]: userId,
    },
  });

  return { acquired: true };
}

async function releaseLock(taskId, field) {
  const lockField = `${field}_is_updating`;
  const lockTimestampField = `${field}_lockTimestamp`;
  const lockUserField = `${field}_lockUser_id`;

  await prisma.task.update({
    where: { id: parseInt(taskId) },
    data: {
      [lockField]: false,
      [lockTimestampField]: null,
      [lockUserField]: null,
    },
  });
}

taskRouter.post("/tasks", async (req, res) => {
  const {
    title,
    description,
    status,
    priority,
    due_date,
    start_date,
    assigneeId,
    projectId,
  } = req.body;
  const actorUserId = req.session?.user?.id;
  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        start_date: new Date(start_date),
        due_date: new Date(due_date),
        assignee: { connect: { id: assigneeId } },
        project: {
          connect: { id: projectId },
        },
      },
    });
    await emitNotification("TASK_CREATED", {
      taskId: task.id,
      content: `New task "${task.title}" was created.`,
      projectId: task.project_id,
      actorUserId,
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

taskRouter.get("/tasks", async (req, res) => {
  const userId = req.session.user.id;

  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [{ assignee_id: userId }, { project: { manager_id: userId } }],
      },
      include: {
        project: {
          include: {
            teamMembers: true,
          },
        },
        assignee: true,
      },
    });
    tasks.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

taskRouter.get("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: {
        project: {
          include: {
            teamMembers: true,
          },
        },
        assignee: true,
      },
    });
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

taskRouter.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const {
    title,
    description,
    status,
    priority,
    due_date,
    start_date,
    assignee_id,
    projectId,
  } = req.body;

  const userId = req.session.user.id;

  try {
    const fieldsToLock = [
      "title",
      "description",
      "status",
      "due_date",
      "assignee",
    ];

    for (const field of fieldsToLock) {
      const { acquired, lockUser } = await acquireLock(id, field, userId);
      if (!acquired) {
        const errorMessage = `This task is currently being updated by ${lockUser.name}. Please try again after one minute`;
        io.to(`task:${id}`).emit("taskUpdateError", {
          taskId: id,
          error: errorMessage,
        });

        if (!blockedUsers.has(id)) {
          blockedUsers.set(id, new Set());
        }

        blockedUsers.get(id).add(userId);
        return res.status(409).json({ error: errorMessage });
      }
    }

    io.to(`task:${id}`).emit("taskEditing", { taskId: id });

    setTimeout(async () => {
      for (const field of fieldsToLock) {
        await releaseLock(id, field);
      }

      if (blockedUsers.has(id)) {
        blockedUsers.get(id).forEach((blockedUserId) => {
          const notifyMessage = "You can now update task";
          io.to(`user:${blockedUserId}`).emit("lockReleased", {
            taskId: id,
            message: notifyMessage,
          });
        });
        blockedUsers.delete(id);
      }
    }, LOCK_TIMEOUT);

    setTimeout(async () => {
      const updatedTask = await prisma.task.update({
        where: { id: parseInt(id) },
        data: {
          title,
          description,
          status,
          priority,
          due_date: new Date(due_date),
          start_date: new Date(start_date),
          assignee: { connect: { id: parseInt(assignee_id) } },
        },
      });

      await emitNotification("TASK_EDIT", {
        taskId: parseInt(id, 10),
        content: `Task "${updatedTask.title}" was updated.`,
        projectId: updatedTask.project_id,
        actorUserId: userId,
      });

      io.to(`task:${id}`).emit("taskUpdated", updatedTask);

      res.json({ message: "Task updated successfully", task: updatedTask });
    }, 2000);
  } catch (err) {
    console.error("Error updating task", err);
    const errorMessage = "Internal server error";
    io.to(`task:${id}`).emit("taskUpdateError", {
      taskId: id,
      error: errorMessage,
    });
    res.status(500).json({ message: errorMessage });
  }
});

taskRouter.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const taskId = parseInt(id, 10);
  const actorUserId = req.session?.user?.id;
  try {
    const existing = await prisma.task.findUnique({
      where: { id: taskId },
      select: { id: true, title: true, project_id: true },
    });
    if (!existing) {
      return res.status(404).json({ error: "Task not found" });
    }

    await prisma.comment.deleteMany({
      where: {
        task_id: taskId,
      },
    });
    const task = await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    await emitNotification("TASK_DELETED", {
      taskId: existing.id,
      content: `Task "${existing.title}" was deleted.`,
      projectId: existing.project_id,
      actorUserId,
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

taskRouter.get("/tasks/:id/comments", async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { task_id: parseInt(id) },
      include: { user: true },
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

taskRouter.post("/tasks/:taskId/comments", async (req, res) => {
  const { taskId } = req.params;
  const userId = req.session.user.id;
  const { content } = req.body;

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        user: {
          connect: { id: parseInt(userId) },
        },
        task: {
          connect: { id: parseInt(taskId) },
        },
      },
    });

    const task = await prisma.task.findUnique({
      where: { id: parseInt(taskId) },
      include: { project: true },
    });

    if (task) {
      await emitNotification("COMMENT", {
        taskId: parseInt(taskId, 10),
        commentId: comment.id,
        content: `New comment on "${task.title}": ${content}`,
        projectId: task.project_id,
        actorUserId: userId,
      });
    }
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

taskRouter.delete("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const userId = req.session.user.id;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
      include: {
        task: {
          include: {
            project: {
              include: {
                manager: true,
              },
            },
          },
        },
      },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (
      comment.user_id !== userId &&
      comment.task.project.manager_id != userId
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const projectId = comment.task.project_id;
    const taskTitle = comment.task.title;

    await emitNotification("COMMENT_DELETED", {
      taskId: comment.task_id,
      commentId: parseInt(commentId, 10),
      content: `A comment was removed from task "${taskTitle}".`,
      projectId,
      actorUserId: userId,
    });

    await prisma.comment.delete({
      where: { id: parseInt(commentId, 10) },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

export default taskRouter;
