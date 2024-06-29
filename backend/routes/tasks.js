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
  //   try {
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
  //   } catch (err) {
  //     res.status(500).json({ message: err.message });
  //   }
});

export default taskRouter;
