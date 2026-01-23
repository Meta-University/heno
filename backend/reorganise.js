import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

dotenv.config();
const reorganiseRouuter = express.Router();
const prisma = new PrismaClient();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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

// --- HELPER FUNCTIONS ---

/**
 * Sanitizes Gemini's response to ensure it's valid JSON
 */
function cleanGeminiResponse(text) {
  return text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
}

/**
 * Robust date comparison helper
 */
function datesAreEqual(date1, date2) {
  return new Date(date1).getTime() === new Date(date2).getTime();
}

function isConflict(task1, task2) {
  return (
    task1.title !== task2.title ||
    task1.status !== task2.status ||
    !datesAreEqual(task1.start_date, task2.start_date) ||
    !datesAreEqual(task1.due_date, task2.due_date) ||
    task1.assignee_id !== task2.assignee_id
  );
}

// ... [Existing helper functions: findMemberOrManager, getConflictDetails, etc.]
// Note: Ensure getConflictDetails uses datesAreEqual() instead of !== for date strings

function getConflictDetails(task1, task2, teamMembers, manager) {
  const conflicts = {};

  if (task1.title !== task2.title)
    conflicts.title = { current: task1.title, suggested: task2.title };
  if (task1.status !== task2.status)
    conflicts.status = { current: task1.status, suggested: task2.status };
  if (!datesAreEqual(task1.start_date, task2.start_date))
    conflicts.start_date = { current: task1.start_date, suggested: task2.start_date };
  if (!datesAreEqual(task1.due_date, task2.due_date))
    conflicts.due_date = { current: task1.due_date, suggested: task2.due_date };
  
  if (task1.assignee_id !== task2.assignee_id) {
    const currentAssignee = findMemberOrManager(task1.assignee_id, teamMembers, manager);
    const suggestedAssignee = findMemberOrManager(task2.assignee_id, teamMembers, manager);
    conflicts.assignee = { current: currentAssignee, suggested: suggestedAssignee };
  }
  return conflicts;
}

// --- AI INTERACTION ---

async function geminiChat(prompt) {
  try {
    const chatSession = model.startChat({ generationConfig });
    const result = await chatSession.sendMessage(prompt);
    const text = cleanGeminiResponse(result.response.text());
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw new Error("Failed to parse AI response");
  }
}

// --- ROUTES ---

reorganiseRouuter.post("/reorganise-schedule", async (req, res) => {
  const schedule = req.body.schedule;
  const prompt = `Reorganize the following project schedule to be more efficient and balanced. 
  Return ONLY the JSON. Do not add new tasks. 
  Schedule: ${JSON.stringify(schedule)}`;

  try {
    const reorganizedSchedule = await geminiChat(prompt);
    
    // Sort tasks by start date
    reorganizedSchedule.tasks.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

    const resolvedSchedule = await handleAutomaticConflictResolution(schedule, reorganizedSchedule);
    
    const changesList = generateChangesList(schedule, resolvedSchedule);
    const changes = generateChangeSentences(changesList);

    res.json({ resolvedSchedule, changes });
  } catch (error) {
    console.error("Error reorganising schedule:", error);
    res.status(500).json({ error: "Failed to reorganize schedule" });
  }
});

// Added error handling to retry-schedule as well
reorganiseRouuter.post("/retry-schedule", async (req, res) => {
  const { currentSchedule, feedback } = req.body;
  const prompt = `User feedback on current schedule: "${feedback}". 
  Please regenerate the schedule keeping this feedback in mind.
  Format: ${JSON.stringify(currentSchedule)}`;

  try {
    const reorganizedSchedule = await geminiChat(prompt);
    const resolvedSchedule = await handleAutomaticConflictResolution(currentSchedule, reorganizedSchedule);
    const changesList = generateChangesList(currentSchedule, resolvedSchedule);
    const changes = generateChangeSentences(changesList);

    res.json({ resolvedSchedule, changes });
  } catch (error) {
    console.error("Retry Error:", error);
    res.status(500).json({ error: "Failed to retry schedule generation" });
  }
});

export default reorganiseRouuter;