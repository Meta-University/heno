import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv"; // Changed to standard naming
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

dotenv.config();
const recommendRouuter = express.Router();
const prisma = new PrismaClient();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

recommendRouuter.post("/ai-recommend-tasks", async (req, res) => {
  const { title, description, endGoals, startDate, endDate, teamMembers } = req.body;
  const teamMembersNames = teamMembers.map((member) => member.name);

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    };

    const chatSession = model.startChat({
      generationConfig,
      // Note: Try to keep history clean or use a System Instruction for better reliability
      history: [], 
    });

    const prompt = `Project Title: ${title}
Description: ${description}
End Goals: ${endGoals}
Start Date: ${startDate}
End Date: ${endDate}
Team Members: ${teamMembersNames.join(", ")}

Recommend tasks with title, description, start date, status (default "Not Started"), due dates, priorities, and assignments. 
Return ONLY a JSON object with a "tasks" key.`;

    const result = await chatSession.sendMessage(prompt);
    let text = result.response.text();

    // REMOVE MARKDOWN BACKTICKS if the model included them
    if (text.startsWith("```")) {
      text = text.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    }

    const recommendedTask = JSON.parse(text);
    res.json(recommendedTask);

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "AI generation failed" });
  }
});

// Helper for Prisma enums
function getPriority(priority) {
  const p = priority?.toUpperCase();
  if (["LOW", "MEDIUM", "HIGH"].includes(p)) return p;
  return "MEDIUM";
}

recommendRouuter.post("/api/store-project", async (req, res) => {
  try {
    const { title, description, startDate, endDate, teamMembers, tasks, user } = req.body;
    const managerId = user.id;

    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        status: "NOT_STARTED",
        priority: "MEDIUM",
        start_date: new Date(startDate),
        due_date: new Date(endDate),
        manager: { connect: { id: managerId } },
        teamMembers: {
          connect: teamMembers.map((member) => ({
            id: parseInt(member.id),
          })),
        },
        tasks: {
          create: tasks.map((task) => ({
            title: task.title,
            description: task.description,
            status: "TODO",
            priority: getPriority(task.priority),
            start_date: new Date(task.startDate),
            due_date: new Date(task.dueDate),
            assignee: {
              connect: {
                id: parseInt(
                  teamMembers.find((member) => member.name === task.assignment)?.id || teamMembers[0].id
                ),
              },
            },
          })),
        },
      },
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to store project" });
  }
});

export default recommendRouuter;