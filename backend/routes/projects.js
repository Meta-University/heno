import express from "express";
import { PrismaClient } from "@prisma/client";
import env from "dotenv";
import { emitNotification } from "./notifications.js";

const projectRouter = express.Router();
const prisma = new PrismaClient();
env.config();

function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }
  next();
}

projectRouter.post("/projects", requireAuth, async (req, res) => {
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

projectRouter.get("/projects", requireAuth, async (req, res) => {
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

projectRouter.put("/projects/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    status,
    due_date,
    start_date,
    priority,
  } = req.body;
  const managerId = req.session.user.id;
  const pid = parseInt(id, 10);
  try {
    const project = await prisma.project.findUnique({
      where: { id: pid },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.manager_id !== managerId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this project" });
    }

    const data = {};
    if (title != null) data.title = title;
    if (description != null) data.description = description;
    if (status != null) data.status = status;
    if (priority != null) data.priority = priority;
    if (due_date != null) data.due_date = new Date(due_date);
    if (start_date != null) data.start_date = new Date(start_date);

    const updatedProject = await prisma.project.update({
      where: { id: pid },
      data,
    });

    await emitNotification("PROJECT_UPDATED", {
      content: `Project "${updatedProject.title}" was updated.`,
      projectId: pid,
      actorUserId: managerId,
    });

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function coerceTaskStatus(status) {
  if (!status) return "TODO";
  const s = String(status).toUpperCase().replace(/[- ]/g, "_");
  if (["TODO", "IN_PROGRESS", "COMPLETED"].includes(s)) return s;
  return "TODO";
}

function coercePriority(priority) {
  if (!priority) return "MEDIUM";
  const p = String(priority).toUpperCase();
  if (["LOW", "MEDIUM", "HIGH"].includes(p)) return p;
  return "MEDIUM";
}

projectRouter.put(
  "/projects/:projectId/approve-suggestions",
  async (req, res) => {
    const { projectId } = req.params;
    const { tasks } = req.body;
    const pid = parseInt(projectId, 10);

    if (!Array.isArray(tasks)) {
      return res.status(400).json({ error: "tasks array required" });
    }

    try {
      const project = await prisma.project.findUnique({
        where: { id: pid },
        select: { tasks: { select: { id: true } } },
      });
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      const taskIds = new Set(project.tasks.map((t) => t.id));

      await prisma.$transaction(
        tasks.map((task) => {
          const taskId = parseInt(task.id, 10);
          if (!taskIds.has(taskId)) {
            throw new Error(`Task ${taskId} does not belong to this project`);
          }

          const assigneeIdRaw = task.assignee_id ?? task.assignee?.id;
          const assignee_id = parseInt(assigneeIdRaw, 10);
          const project_id = parseInt(task.project_id ?? pid, 10);

          if (Number.isNaN(assignee_id)) {
            throw new Error(`Task ${task.id} is missing a valid assignee_id`);
          }

          const start_date = new Date(task.start_date);
          const due_date = new Date(task.due_date);
          if (Number.isNaN(start_date.getTime()) || Number.isNaN(due_date.getTime())) {
            throw new Error(`Task ${task.id} has invalid start_date or due_date`);
          }

          const {
            title_lockUser_id,
            description_lockUser_id,
            status_lockUser_id,
            due_date_lockUser_id,
            assignee_lockUser_id,
          } = task;

          return prisma.task.update({
            where: { id: taskId },
            data: {
              title: String(task.title ?? ""),
              description: String(task.description ?? ""),
              status: coerceTaskStatus(task.status),
              start_date,
              due_date,
              priority: coercePriority(task.priority),
              project: { connect: { id: project_id } },
              assignee: { connect: { id: assignee_id } },
              title_lockUser: title_lockUser_id
                ? { connect: { id: parseInt(title_lockUser_id, 10) } }
                : undefined,
              description_lockUser: description_lockUser_id
                ? { connect: { id: parseInt(description_lockUser_id, 10) } }
                : undefined,
              status_lockUser: status_lockUser_id
                ? { connect: { id: parseInt(status_lockUser_id, 10) } }
                : undefined,
              due_date_lockUser: due_date_lockUser_id
                ? { connect: { id: parseInt(due_date_lockUser_id, 10) } }
                : undefined,
              assignee_lockUser: assignee_lockUser_id
                ? { connect: { id: parseInt(assignee_lockUser_id, 10) } }
                : undefined,
            },
          });
        })
      );

      await emitNotification("PROJECT_UPDATED", {
        content:
          "Approved AI schedule changes were applied to project tasks.",
        projectId: pid,
        actorUserId: req.session.user.id,
      });

      res.status(200).json({ message: "Project updated successfuly" });
    } catch (error) {
      console.error("approve-suggestions:", error);
      res.status(500).json({
        error: error.message || "Failed to apply schedule changes",
      });
    }
  }
);

projectRouter.delete("/projects/:id", async (req, res) => {
  const { id } = req.params;
  const pid = parseInt(id, 10);
  const actorUserId = req.session?.user?.id;
  if (!actorUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const project = await prisma.project.findUnique({
      where: { id: pid },
      select: { id: true, title: true, manager_id: true },
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    if (project.manager_id !== actorUserId) {
      return res.status(403).json({ error: "Not authorized to delete project" });
    }

    await emitNotification("PROJECT_DELETED", {
      content: `Project "${project.title}" was deleted.`,
      projectId: pid,
      actorUserId,
    });

    await prisma.comment.deleteMany({
      where: {
        task: {
          project_id: pid,
        },
      },
    });
    await prisma.task.deleteMany({
      where: {
        project_id: pid,
      },
    });
    const deleted = await prisma.project.delete({
      where: {
        id: pid,
      },
    });
    res.json(deleted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default projectRouter;
