import express from "express";
import { PrismaClient } from "@prisma/client";
import checkProjectPermission from "../permission.js";

const taskRouter = express.Router();
const prisma = new PrismaClient();

const LOCK_TIMEOUT = 60000;

async function acquireLock(taskId, field) {
  const now = new Date();
  const task = await prisma.task.findUnique({
    where: { id: parseInt(taskId) },
  });
  if (!task) {
    throw new Error("Task not found");
  }

  const lockField = `${field}_is_updating`;
  const lockTimestampField = `${field}_lockTimestamp`;

  if (
    task[lockField] &&
    new Date(task[lockTimestampField].getTime() + LOCK_TIMEOUT) > now
  ) {
    return false;
  }

  await prisma.task.update({
    where: { id: parseInt(taskId) },
    data: {
      [lockField]: true,
      [lockTimestampField]: now,
    },
  });

  return true;
}

async function releaseLock(taskId, field) {
  const lockField = `${field}_is_updating`;
  const lockTimestampField = `${field}_lockTimestamp`;

  await prisma.task.update({
    where: { id: parseInt(taskId) },
    data: {
      [lockField]: false,
      [lockTimestampField]: null,
    },
  });
}

taskRouter.post("/tasks", async (req, res) => {
  const {
    title,
    description,
    status,
    due_date,
    start_date,
    assigneeId,
    projectId,
  } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        start_date: new Date(start_date),
        due_date: new Date(due_date),
        assignee: { connect: { id: assigneeId } },
        project: {
          connect: { id: projectId },
        },
      },
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
        OR: [
          { assignee_id: userId },
          { project: { manager_id: userId } },
          {
            project: {
              teamMembers: { some: { id: userId } },
            },
          },
        ],
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
    due_date,
    start_date,
    assignee_id,
    projectId,
  } = req.body;

  try {
    const fieldsToLock = [
      "title",
      "description",
      "status",
      "due_date",
      "assignee",
    ];

    for (const field of fieldsToLock) {
      const acquired = await acquireLock(id, field);
      if (!acquired) {
        return res.status(409).json({
          error: `Task is being upated by someone else. Please try again later`,
        });
      }
    }

    setTimeout(async () => {
      for (const field of fieldsToLock) {
        await releaseLock(id, field);
      }
    }, LOCK_TIMEOUT);

    setTimeout(async () => {
      await prisma.task.update({
        where: { id: parseInt(id) },
        data: {
          title,
          description,
          status,
          due_date: new Date(due_date),
          start_date: new Date(start_date),
          assignee: { connect: { id: parseInt(assignee_id) } },
        },
      });

      res.json({ message: "Task updated successfuly" });
    }, 5000);
  } catch (err) {
    console.error("Error updating task", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

taskRouter.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default taskRouter;
