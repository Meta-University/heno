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
  model: "gemini-2.0-flash",
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

function findMemberOrManager(id, teamMembers, manager) {
  const member = teamMembers.find((member) => member.id === id);
  if (member) return member;
  return manager;
}

function detectConflicts(currentSchedule, suggestedSchedule) {
  const conflicts = [];
  for (const currentTask of currentSchedule.tasks) {
    const suggestedTask = suggestedSchedule.tasks.find((t) => t.id === currentTask.id);
    if (suggestedTask && isConflict(currentTask, suggestedTask)) {
      conflicts.push({
        taskId: currentTask.id,
        conflicts: getConflictDetails(currentTask, suggestedTask, currentSchedule.teamMembers, currentSchedule.manager),
      });
    }
  }
  return conflicts;
}

function autoResolveConflict(conflict, currentSchedule, suggestedSchedule) {
  const resolution = { taskId: conflict.taskId, changes: {} };
  for (const [key, value] of Object.entries(conflict.conflicts)) {
    resolution.changes[key] = value.suggested;
  }
  return resolution;
}

function autoResolveConflicts(conflicts, currentSchedule, suggestedSchedule) {
  return conflicts.map((conflict) => autoResolveConflict(conflict, currentSchedule, suggestedSchedule));
}

function applyResolutions(currentSchedule, resolutions) {
  const updatedSchedule = JSON.parse(JSON.stringify(currentSchedule));
  for (const resolution of resolutions) {
    const task = updatedSchedule.tasks.find((t) => t.id === resolution.taskId);
    if (task) {
      Object.assign(task, resolution.changes);
    }
  }
  return updatedSchedule;
}

async function handleAutomaticConflictResolution(currentSchedule, suggestedSchedule) {
  const conflicts = detectConflicts(currentSchedule, suggestedSchedule);
  if (conflicts.length === 0) {
    return suggestedSchedule;
  }
  const resolutions = autoResolveConflicts(conflicts, currentSchedule, suggestedSchedule);
  return applyResolutions(currentSchedule, resolutions);
}

function generateChangesList(currentSchedule, resolvedSchedule) {
  const changes = [];
  for (let i = 0; i < currentSchedule.tasks.length; i++) {
    const currentTask = currentSchedule.tasks[i];
    const resolvedTask = resolvedSchedule.tasks.find((t) => t.id === currentTask.id);
    if (!resolvedTask) continue;
    
    const taskChanges = {};
    if (currentTask.status !== resolvedTask.status) {
      taskChanges.status = { from: currentTask.status, to: resolvedTask.status };
    }
    if (!datesAreEqual(currentTask.start_date, resolvedTask.start_date)) {
      taskChanges.start_date = { from: currentTask.start_date, to: resolvedTask.start_date };
    }
    if (!datesAreEqual(currentTask.due_date, resolvedTask.due_date)) {
      taskChanges.due_date = { from: currentTask.due_date, to: resolvedTask.due_date };
    }
    if (currentTask.assignee_id !== resolvedTask.assignee_id) {
      taskChanges.assignee = {
        from: currentSchedule.teamMembers.find((m) => m.id === currentTask.assignee_id)?.name,
        to: resolvedSchedule.teamMembers.find((m) => m.id === resolvedTask.assignee_id)?.name,
      };
    }
    if (Object.keys(taskChanges).length > 0) {
      changes.push({ taskId: currentTask.id, taskTitle: currentTask.title, changes: taskChanges });
    }
  }
  return changes;
}

function generateChangeSentences(changes) {
  const sentences = [];
  changes.forEach((change) => {
    const { taskTitle, changes: taskChanges } = change;
    if (taskChanges.status) {
      sentences.push(`${taskTitle} status changed from ${taskChanges.status.from} to ${taskChanges.status.to}.`);
    }
    if (taskChanges.start_date) {
      sentences.push(`${taskTitle} start date changed from ${new Date(taskChanges.start_date.from).toLocaleDateString()} to ${new Date(taskChanges.start_date.to).toLocaleDateString()}.`);
    }
    if (taskChanges.due_date) {
      sentences.push(`${taskTitle} due date changed from ${new Date(taskChanges.due_date.from).toLocaleDateString()} to ${new Date(taskChanges.due_date.to).toLocaleDateString()}.`);
    }
    if (taskChanges.assignee) {
      sentences.push(`${taskTitle} assignee changed from ${taskChanges.assignee.from} to ${taskChanges.assignee.to}.`);
    }
  });
  return sentences;
}

// --- AI INTERACTION ---

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function geminiChat(prompt, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const chatSession = model.startChat({ generationConfig });
      const result = await chatSession.sendMessage(prompt);
      const text = cleanGeminiResponse(result.response.text());
      return JSON.parse(text);
    } catch (error) {
      console.error(`Gemini Chat Error (attempt ${attempt}/${retries}):`, error.message);
      
      if (error.status === 429 && attempt < retries) {
        const waitTime = Math.min(60000, 10000 * attempt);
        console.log(`Rate limited. Waiting ${waitTime/1000}s before retry...`);
        await sleep(waitTime);
        continue;
      }
      
      if (attempt === retries) {
        throw new Error("Failed to get AI response after retries");
      }
    }
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