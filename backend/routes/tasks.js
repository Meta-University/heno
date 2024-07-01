import express from "express";
import { PrismaClient } from "@prisma/client";

const taskRouter = express.Router();
const prisma = new PrismaClient();

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
  try {
    const tasks = await prisma.task.findMany({
      include: {
        project: true,
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
        project: true,
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

export default taskRouter;
