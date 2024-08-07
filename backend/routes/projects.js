import express from "express";
import { PrismaClient } from "@prisma/client";
import env from "dotenv";

const projectRouter = express.Router();
const prisma = new PrismaClient();
env.config();

projectRouter.post("/projects", async (req, res) => {
  const {
    title,
    description,
    status,
    startDate,
    dueDate,
    priority,
    teamMembers,
  } = req.body;

  const managerId = req.session.user.id;

  try {
    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        status,
        start_date: new Date(startDate),
        due_date: new Date(dueDate),
        priority,
        manager: { connect: { id: managerId } },
        teamMembers: {
          connect: teamMembers.map((member) => ({ id: member.id })),
        },
      },
    });
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

projectRouter.get("/projects", async (req, res) => {
  const userId = req.session.user.id;

  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { manager_id: userId },
          {
            teamMembers: { some: { id: userId } },
          },
        ],
      },
      include: {
        tasks: {
          include: {
            assignee: true,
          },
        },
        manager: true,
        teamMembers: true,
      },
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

projectRouter.get("/projects/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        tasks: {
          orderBy: {
            start_date: "asc",
          },
          include: {
            assignee: true,
          },
        },
        manager: true,
        teamMembers: true,
      },
    });
    const tasks = await prisma.task.findMany({
      where: { project_id: parseInt(id) },
    });
    if (!project) {
      res.status(404).json({ error: "Project not found" });
    }

    const progress = calculateProgress(tasks);
    res.json({ project, progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function calculateProgress(tasks) {
  const statusValues = {
    TODO: 0,
    IN_PROGRESS: 0.5,
    COMPLETED: 1,
  };

  const totalProgress = tasks.reduce(
    (acc, task) => acc + statusValues[task.status],
    0
  );
  return (totalProgress / tasks.length) * 100;
}

projectRouter.put("/projects/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, status, due_date, priority } = req.body;
  const managerId = req.session.user.id;
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.manager_id !== managerId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this project" });
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: parseInt(id),
      },

      data: {
        name,
        description,
        status,
        due_date: new Date(due_date),
        priority,
        manager_id: managerId,
      },
    });
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

projectRouter.put(
  "/projects/:projectId/approve-suggestions",
  async (req, res) => {
    const { projectId } = req.params;
    const { tasks } = req.body;

    for (const task of tasks) {
      const {
        id,
        project_id,
        assignee_id,
        title_lockUser_id,
        description_lockUser_id,
        status_lockUser_id,
        due_date_lockUser_id,
        assignee_lockUser_id,
        ...updateData
      } = task;
      await prisma.task.update({
        where: {
          id: parseInt(task.id),
        },
        data: {
          ...updateData,
          project: {
            connect: { id: parseInt(project_id) },
          },
          assignee: {
            connect: { id: parseInt(assignee_id) },
          },
          title_lockUser: title_lockUser_id
            ? {
                connect: { id: parseInt(title_lockUser_id) },
              }
            : undefined,
          description_lockUser: description_lockUser_id
            ? {
                connect: { id: parseInt(description_lockUser_id) },
              }
            : undefined,
          status_lockUser: status_lockUser_id
            ? {
                connect: { id: parseInt(status_lockUser_id) },
              }
            : undefined,
          due_date_lockUser: due_date_lockUser_id
            ? {
                connect: { id: parseInt(due_date_lockUser_id) },
              }
            : undefined,
          assignee_lockUser: assignee_lockUser_id
            ? {
                connect: { id: parseInt(assignee_lockUser_id) },
              }
            : undefined,
        },
      });
    }

    res.status(200).json({ message: "Project updated successfuly" });
  }
);

projectRouter.delete("/projects/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.comment.deleteMany({
      where: {
        task: {
          project_id: parseInt(id),
        },
      },
    });
    await prisma.task.deleteMany({
      where: {
        project_id: parseInt(id),
      },
    });
    const project = await prisma.project.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default projectRouter;
