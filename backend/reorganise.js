import express from "express";
import { PrismaClient } from "@prisma/client";
import env from "dotenv";
import { FunctionDeclarationSchemaType } from "@google/generative-ai";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const reorganiseRouuter = express.Router();
const prisma = new PrismaClient();
env.config();

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

function detectConflicts(currentSchedule, suggestedSchedule) {
  const conflicts = [];

  for (const currentTask of currentSchedule.tasks) {
    const suggestedTask = suggestedSchedule.tasks.find(
      (t) => t.id === currentTask.id
    );

    if (suggestedTask && isConflict(currentTask, suggestedTask)) {
      conflicts.push({
        taskId: currentTask.id,
        conflicts: getConflictDetails(
          currentTask,
          suggestedTask,
          currentSchedule.teamMembers,
          currentSchedule.manager
        ),
      });
    }
  }

  return conflicts;
}

function isConflict(task1, task2) {
  return (
    task1.title !== task2.title ||
    task1.status !== task2.status ||
    task1.start_date !== task2.start_date ||
    task1.due_date !== task2.due_date ||
    task1.assignee_id !== task2.assignee_id
  );
}

const findMemberOrManager = (id, teamMembers, manager) => {
  const member = teamMembers.find((member) => member.id === id);
  if (member) {
    return member;
  }
  return manager;
};

function getConflictDetails(task1, task2, teamMembers, manager) {
  const conflicts = {};

  if (task1.title !== task2.title)
    conflicts.title = { current: task1.title, suggested: task2.title };
  if (task1.status !== task2.status)
    conflicts.status = { current: task1.status, suggested: task2.status };
  if (task1.start_date !== task2.start_date)
    conflicts.start_date = {
      current: task1.start_date,
      suggested: task2.start_date,
    };
  if (task1.due_date !== task2.due_date)
    conflicts.due_date = { current: task1.due_date, suggested: task2.due_date };
  if (task1.assignee_id !== task2.assignee_id) {
    const currentAssignee = findMemberOrManager(
      task1.assignee_id,
      teamMembers,
      manager
    );
    const suggestedAssignee = findMemberOrManager(
      task2.assignee_id,
      teamMembers,
      manager
    );

    conflicts.assignee = {
      current: currentAssignee,
      suggested: suggestedAssignee,
    };
  }

  return conflicts;
}

function autoResolveConflicts(conflicts, currentSchedule, suggestedSchedule) {
  const resolutions = [];

  for (const conflict of conflicts) {
    resolutions.push(
      autoResolveConflict(conflict, currentSchedule, suggestedSchedule)
    );
  }

  return resolutions;
}

function autoResolveConflict(conflict, currentSchedule, suggestedSchedule) {
  const resolution = { taskId: conflict.taskId, changes: {} };
  const currentTask = currentSchedule.tasks.find(
    (t) => t.id === conflict.taskId
  );
  const suggestedTask = suggestedSchedule.tasks.find(
    (t) => t.id === conflict.taskId
  );

  for (const [key, value] of Object.entries(conflict.conflicts)) {
    switch (key) {
      case "status":
        resolution.changes[key] = resolveStatusConflict(
          value.current,
          value.suggested
        );
        break;
      case "start_date":
        resolution.changes[key] = resolveStartDateConflict(
          value.current,
          value.suggested,
          currentSchedule.start_date,
          currentSchedule.due_date
        );
        break;

      case "due_date":
        resolution.changes[key] = resolveDueDateConflict(
          value.current,
          value.suggested,
          currentSchedule.due_date
        );
        break;
      case "assignee":
        resolution.changes[key] = resolveAssigneeConflict(
          value.current,
          value.suggested,
          currentSchedule,
          suggestedSchedule
        );
        break;
      default:
        resolution.changes[key] = value.suggested;
    }
  }

  return resolution;
}

function resolveStatusConflict(current, suggested) {
  const statusPriority = ["COMPLETED", "IN_PROGRESS", "TODO"];
  return statusPriority.indexOf(suggested) < statusPriority.indexOf(current)
    ? suggested
    : current;
}

function resolveStartDateConflict(
  currentStartDate,
  suggestedStartDate,
  projectStartDate,
  projectDueDate
) {
  const current = new Date(currentStartDate);
  const suggested = new Date(suggestedStartDate);
  const projectStart = new Date(projectStartDate);
  const projectEnd = new Date(projectDueDate);

  if (suggested >= projectStart && suggested <= projectEnd) {
    return suggestedStartDate;
  }

  return currentStartDate;
}

function resolveDueDateConflict(current, suggested, projectDueDate) {
  const currentDate = new Date(current);
  const suggestedDate = new Date(suggested);
  const projectEnd = new Date(projectDueDate);

  if (suggestedDate <= projectEnd) {
    return suggested;
  }
  return current;
}

function resolveAssigneeConflict(
  currentAssigneeId,
  suggestedAssigneeId,
  currentSchedule,
  suggestedSchedule
) {
  const currentAssignee = currentSchedule.teamMembers.find(
    (m) => m.id === currentAssigneeId
  );
  const suggestedAssignee = suggestedSchedule.teamMembers.find(
    (m) => m.id === suggestedAssigneeId
  );

  if (
    !currentAssignee ||
    (suggestedAssignee &&
      getAssigneeWorkload(suggestedAssignee, suggestedSchedule) <
        getAssigneeWorkload(currentAssignee, currentSchedule))
  ) {
    return suggestedAssigneeId;
  }
  return currentAssigneeId;
}

function getAssigneeWorkload(assignee, schedule) {
  return schedule.tasks.filter((task) => task.assignee_id === assignee.id)
    .length;
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

async function handleAutomaticConflictResolution(
  currentSchedule,
  suggestedSchedule
) {
  const conflicts = detectConflicts(currentSchedule, suggestedSchedule);

  if (conflicts.length === 0) {
    return suggestedSchedule;
  }

  const resolutions = autoResolveConflicts(
    conflicts,
    currentSchedule,
    suggestedSchedule
  );
  return applyResolutions(currentSchedule, resolutions);
}

function generateChangesList(currentSchedule, resolvedSchedule) {
  const changes = [];

  for (let i = 0; i < currentSchedule.tasks.length; i++) {
    const currentTask = currentSchedule.tasks[i];
    const resolvedTask = resolvedSchedule.tasks[i];

    const taskChanges = {};
    if (currentTask.status !== resolvedTask.status) {
      taskChanges.status = {
        from: currentTask.status,
        to: resolvedTask.status,
      };
    }
    if (currentTask.start_date !== resolvedTask.start_date) {
      taskChanges.start_date = {
        from: currentTask.start_date,
        to: resolvedTask.start_date,
      };
    }
    if (currentTask.due_date !== resolvedTask.due_date) {
      taskChanges.due_date = {
        from: currentTask.due_date,
        to: resolvedTask.due_date,
      };
    }
    if (currentTask.assignee_id !== resolvedTask.assignee_id) {
      taskChanges.assignee = {
        from: currentSchedule.teamMembers.find(
          (m) => m.id === currentTask.assignee_id
        )?.name,
        to: resolvedSchedule.teamMembers.find(
          (m) => m.id === resolvedTask.assignee_id
        )?.name,
      };
    }

    if (Object.keys(taskChanges).length > 0) {
      changes.push({
        taskId: currentTask.id,
        taskTitle: currentTask.title,
        changes: taskChanges,
      });
    }
  }

  return changes;
}

function generateChangeSentences(changes) {
  const sentences = [];

  changes.forEach((change) => {
    const { taskTitle, changes: taskChanges } = change;
    const changeSentences = [];

    if (taskChanges.status) {
      changeSentences.push(
        `${taskTitle} status changed from ${taskChanges.status.from} to ${taskChanges.status.to}.`
      );
    }
    if (taskChanges.start_date) {
      changeSentences.push(
        `${taskTitle} start date changed from ${new Date(
          taskChanges.start_date.from
        ).toLocaleDateString()} to ${new Date(
          taskChanges.start_date.to
        ).toLocaleDateString()}.`
      );
    }
    if (taskChanges.due_date) {
      changeSentences.push(
        `${taskTitle} due date changed from ${new Date(
          taskChanges.due_date.from
        ).toLocaleDateString()} to ${new Date(
          taskChanges.due_date.to
        ).toLocaleDateString()}.`
      );
    }
    if (taskChanges.assignee) {
      changeSentences.push(
        `${taskTitle} assignee changed from ${taskChanges.assignee.from} to ${taskChanges.assignee.to}.`
      );
    }

    sentences.push(...changeSentences);
  });

  return sentences;
}

async function geminiChat(prompt) {
  const chatSession = model.startChat({
    generationConfig,
  });

  const result = await chatSession.sendMessage(prompt);
  const message = await chatSession.sendMessage(
    `Send a message on each of the changes made as a JSON.`
  );

  return JSON.parse(result.response.text());
}

reorganiseRouuter.post("/reorganise-schedule", async (req, res) => {
  const schedule = req.body.schedule;
  const prompt = `Reorganize the following project  schedule to be more efficient and balanced:\n  ${JSON.stringify(
    schedule
  )}\n  Provide the reorganized schedule in the same format and do not suggest a new task`;
  try {
    async function run() {
      const reorganizedSchedule = await geminiChat(prompt);
      reorganizedSchedule.tasks.sort(
        (a, b) => new Date(a.start_date) - new Date(b.start_date)
      );
      const resolvedSchedule = await handleAutomaticConflictResolution(
        schedule,
        reorganizedSchedule
      );
      resolvedSchedule.tasks.sort(
        (a, b) => new Date(a.start_date) - new Date(b.start_date)
      );

      const changesList = generateChangesList(schedule, resolvedSchedule);
      const changes = generateChangeSentences(changesList);

      res.json({ resolvedSchedule, changes });
    }

    run();
  } catch (error) {
    console.error("Error reorganising schedule: ", error);
    res.status(500).json({ error: "Failed to reorganize schedule" });
  }
});

reorganiseRouuter.post("/retry-schedule", async (req, res) => {
  const currentSchedule = req.body.currentSchedule;

  const feedback = req.body.feedback;
  const prompt = `
  The user did not approve the suggested schedule for their project. Here are the details of the current schedule and the user's feedback:
    Current Schedule:
    ${JSON.stringify(currentSchedule)}
    Feedback:
    ${feedback}
    Please generate a new schedule taking the feedback into consideration. Ensure that the workload is balanced among team members and the tasks' start and end dates align properly with the project's timeline. Provide the reorganized schedule in the same format as the current schedule and do not suggest a new task
  `;

  try {
    async function run() {
      const reorganizedSchedule = await geminiChat(prompt);
      reorganizedSchedule.tasks.sort(
        (a, b) => new Date(a.start_date) - new Date(b.start_date)
      );
      const resolvedSchedule = await handleAutomaticConflictResolution(
        currentSchedule,
        reorganizedSchedule
      );
      resolvedSchedule.tasks.sort(
        (a, b) => new Date(a.start_date) - new Date(b.start_date)
      );

      const changesList = generateChangesList(
        currentSchedule,
        resolvedSchedule
      );
      const changes = generateChangeSentences(changesList);

      res.json({ resolvedSchedule, changes });
    }

    run();
  } catch (error) {}
});

export default reorganiseRouuter;
