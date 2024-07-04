import express from "express";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { createClient } from "pexels";
import env from "dotenv";

const projectRouter = express.Router();
const prisma = new PrismaClient();
env.config();

async function getImageUrl(description) {
  const options = {
    method: "GET",
    url: "https://api.pexels.com/v1/search",
    headers: {
      Authorization: process.env.API_KEY,
    },
    params: {
      query: description,
      per_page: 1,
      page: 1,
    },
  };

  try {
    const response = await axios.request(options);
    const imageUrl = response.data.photos[0].url;
    console.log(imageUrl);
  } catch (error) {
    console.error("Error generating image: ", error);
  }
}

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
  try {
    const projects = await prisma.project.findMany({
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
          include: {
            assignee: true,
          },
        },
        manager: true,
        teamMembers: true,
      },
    });
    if (!project) {
      res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

projectRouter.delete("/projects/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.deleteMany();
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
