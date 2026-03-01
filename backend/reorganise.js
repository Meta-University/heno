import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod"; // npm install zod

dotenv.config();
const reorganiseRouter = express.Router();
const prisma = new PrismaClient();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// --- 1. DEFINE THE DATA CONTRACT ---
const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  start_date: z.string(),
  due_date: z.string(),
  assignee_id: z.string(),
});

const ScheduleSchema = z.object({
  tasks: z.array(TaskSchema),
});

// --- 2. UTILITIES ---
const cleanResponse = (text) => text.replace(/```json|```/g, "").trim();

const formatDate = (date) => new Date(date).toISOString().split('T')[0];

const getMemberName = (id, members, manager) => {
  const person = members.find(m => m.id === id) || (manager?.id === id ? manager : null);
  return person ? person.name : "Unassigned";
};

// --- 3. THE REORGANIZATION ENGINE ---
async function geminiGenerate(prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      const text = cleanResponse(result.response.text());
      // Force validation: if this fails, it jumps to catch
      return ScheduleSchema.parse(JSON.parse(text));
    } catch (err) {
      if (err.status === 429) {
        const wait = (i + 1) * 20000; // 20s, 40s...
        console.warn(`Rate limit hit. Retrying in ${wait/1000}s...`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      throw err;
    }
  }
}

// --- 4. ROUTES ---
reorganiseRouter.post("/reorganise-schedule", async (req, res) => {
  const { schedule } = req.body;
  if (!schedule?.tasks) return res.status(400).json({ error: "No tasks provided" });

  const prompt = `
    Context: Reorganize this project schedule for peak efficiency.
    Constraint: Return valid JSON matching the provided task list. Do not add/remove tasks.
    Data: ${JSON.stringify(schedule)}
  `;

  try {
    const suggested = await geminiGenerate(prompt);
    
    // Sort and Compare
    suggested.tasks.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

    const changes = [];
    suggested.tasks.forEach(newTask => {
      const oldTask = schedule.tasks.find(t => t.id === newTask.id);
      if (!oldTask) return;

      if (oldTask.status !== newTask.status) {
        changes.push(`${oldTask.title}: Status updated to ${newTask.status}`);
      }
      if (formatDate(oldTask.start_date) !== formatDate(newTask.start_date)) {
        changes.push(`${oldTask.title}: Started shifted to ${formatDate(newTask.start_date)}`);
      }
      if (oldTask.assignee_id !== newTask.assignee_id) {
        const name = getMemberName(newTask.assignee_id, schedule.teamMembers, schedule.manager);
        changes.push(`${oldTask.title}: Reassigned to ${name}`);
      }
    });

    res.json({ resolvedSchedule: suggested, changes });
  } catch (error) {
    console.error("Critical Failure:", error);
    res.status(500).json({ error: "Engine failure", details: error.message });
  }
});

export default reorganiseRouter;