import express from "express";
import { PrismaClient } from "@prisma/client";
import env from "dotenv";
import { FunctionDeclarationSchemaType } from "@google/generative-ai";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const recommendRouuter = express.Router();
const prisma = new PrismaClient();
env.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
recommendRouuter.post("/ai-recommend-tasks", async (req, res) => {
  const { title, description, endGoals, startDate, endDate, teamMembers } =
    req.body;
  const teamMembersNames = teamMembers.map((member) => member.name);
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

  async function run() {
    const chatSession = model.startChat({
      generationConfig,

      history: [
        {
          role: "user",
          parts: [
            {
              text: `Project Title: ${title}\\nDescription: ${description}\\nEnd Goals: ${endGoals}\\nStart Date: ${startDate}\\nEnd Date: ${endDate}\\nTeam Members: ${teamMembersNames.join(
                ", "
              )}\\n\\nRecommend tasks with title, description, start date, status(default not started)due dates and priorities and assignments, output should be in json\n{\n  \"title\": \"Website Redesign\",\n  \"description\": \"Redesign the corporate website to improve user experience and align with the new brand guidelines.\",\n  \"endGoals\": \"Improve website usability and accessibility, Increase visitor engagement and conversion rates, Update the visual design to reflect new brand identity\",\n  \"startDate\": \"2024-08-01\",\n  \"endDate\": \"2024-12-01\",\n  \"teamMembers\": [\"Alice Johnson\", \"Bob Smith\", \"Charlie Brown\", \"Dana White\"]\n}.`,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: '```json\n{\n  "tasks": [\n    {\n      "title": "Research & Analysis",\n      "description": "Conduct user research and competitor analysis to understand current website performance and identify areas for improvement.",\n      "startDate": "2024-08-01",\n      "dueDate": "2024-08-15",\n      "priority": "High",\n      "assignment": "Alice Johnson"\n    },\n    {\n      "title": "Wireframing & Prototyping",\n      "description": "Create wireframes and interactive prototypes to visualize the new website structure and user flow.",\n      "startDate": "2024-08-16",\n      "dueDate": "2024-09-01",\n      "priority": "High",\n      "assignment": "Bob Smith"\n    },\n    {\n      "title": "Visual Design",\n      "description": "Design the visual elements of the website, including color scheme, typography, and imagery, based on the new brand guidelines.",\n      "startDate": "2024-09-02",\n      "dueDate": "2024-09-30",\n      "priority": "High",\n      "assignment": "Charlie Brown"\n    },\n    {\n      "title": "Content Development",\n      "description": "Write and edit all website content, including copy, images, and videos, to ensure it is clear, concise, and engaging.",\n      "startDate": "2024-09-02",\n      "dueDate": "2024-10-15",\n      "priority": "High",\n      "assignment": "Dana White"\n    },\n    {\n      "title": "Development & Testing",\n      "description": "Develop the website using HTML, CSS, and JavaScript, and test its functionality across different browsers and devices.",\n      "startDate": "2024-10-16",\n      "dueDate": "2024-11-30",\n      "priority": "High",\n      "assignment": "Bob Smith"\n    },\n    {\n      "title": "Content Upload & QA",\n      "description": "Upload all website content and conduct thorough quality assurance testing to ensure everything is functioning correctly.",\n      "startDate": "2024-12-01",\n      "dueDate": "2024-12-15",\n      "priority": "High",\n      "assignment": "Alice Johnson"\n    },\n    {\n      "title": "Launch & Monitoring",\n      "description": "Launch the new website and monitor its performance using analytics tools. Make adjustments as needed to improve user experience and achieve project goals.",\n      "startDate": "2024-12-16",\n      "dueDate": "2024-12-31",\n      "priority": "High",\n      "assignment": "Charlie Brown"\n    }\n  ]\n}\n``` \n',
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: 'Project Title: ${title}\\nDescription: ${description}\\nEnd Goals: ${endGoals}\\nStart Date: ${startDate}\\nEnd Date: ${endDate}\\nTeam Members: ${teamMembers.join(\', \')}\\n\\nRecommend tasks with title, description, start date, status(default not started)due dates and priorities and assignments, output should be in json\n{\n"title": "Website Redesign",\n"description": "Redesign the corporate website to improve user experience and align with the new brand guidelines.",\n"endGoals": "Improve website usability and accessibility, Increase visitor engagement and conversion rates, Update the visual design to reflect new brand identity",\n"startDate": "2024-08-01",\n"endDate": "2024-12-01",\n"teamMembers": ["Alice Johnson", "Bob Smith", "Charlie Brown", "Dana White"]\n}.\n',
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: '```json\n{\n  "tasks": [\n    {\n      "title": "Project Kickoff Meeting",\n      "description": "Gather the team to discuss project goals, timelines, and responsibilities.",\n      "startDate": "2024-08-01",\n      "dueDate": "2024-08-02",\n      "priority": "High",\n      "assignment": "Alice Johnson",\n      "status": "Not Started" \n    },\n    {\n      "title": "Research & Analysis",\n      "description": "Conduct user research and competitor analysis to understand current website performance and identify areas for improvement.",\n      "startDate": "2024-08-02",\n      "dueDate": "2024-08-15",\n      "priority": "High",\n      "assignment": "Alice Johnson",\n      "status": "Not Started" \n    },\n    {\n      "title": "Brand Guideline Review",\n      "description": "Review the updated brand guidelines and ensure the design team understands the new brand identity.",\n      "startDate": "2024-08-02",\n      "dueDate": "2024-08-08",\n      "priority": "High",\n      "assignment": "Charlie Brown",\n      "status": "Not Started" \n    },\n    {\n      "title": "Wireframing & Prototyping",\n      "description": "Create wireframes and interactive prototypes to visualize the new website structure and user flow.",\n      "startDate": "2024-08-16",\n      "dueDate": "2024-09-01",\n      "priority": "High",\n      "assignment": "Bob Smith",\n      "status": "Not Started" \n    },\n    {\n      "title": "Visual Design",\n      "description": "Design the visual elements of the website, including color scheme, typography, and imagery, based on the new brand guidelines.",\n      "startDate": "2024-09-02",\n      "dueDate": "2024-09-30",\n      "priority": "High",\n      "assignment": "Charlie Brown",\n      "status": "Not Started" \n    },\n    {\n      "title": "Content Audit",\n      "description": "Review existing website content and identify areas for updates or removal.",\n      "startDate": "2024-09-02",\n      "dueDate": "2024-09-15",\n      "priority": "Medium",\n      "assignment": "Dana White",\n      "status": "Not Started" \n    },\n    {\n      "title": "Content Development",\n      "description": "Write and edit all website content, including copy, images, and videos, to ensure it is clear, concise, and engaging.",\n      "startDate": "2024-09-16",\n      "dueDate": "2024-10-15",\n      "priority": "High",\n      "assignment": "Dana White",\n      "status": "Not Started" \n    },\n    {\n      "title": "Development & Testing",\n      "description": "Develop the website using HTML, CSS, and JavaScript, and test its functionality across different browsers and devices.",\n      "startDate": "2024-10-16",\n      "dueDate": "2024-11-30",\n      "priority": "High",\n      "assignment": "Bob Smith",\n      "status": "Not Started" \n    },\n    {\n      "title": "Content Upload & QA",\n      "description": "Upload all website content and conduct thorough quality assurance testing to ensure everything is functioning correctly.",\n      "startDate": "2024-12-01",\n      "dueDate": "2024-12-15",\n      "priority": "High",\n      "assignment": "Alice Johnson",\n      "status": "Not Started" \n    },\n    {\n      "title": "Launch & Monitoring",\n      "description": "Launch the new website and monitor its performance using analytics tools. Make adjustments as needed to improve user experience and achieve project goals.",\n      "startDate": "2024-12-16",\n      "dueDate": "2024-12-31",\n      "priority": "High",\n      "assignment": "Charlie Brown",\n      "status": "Not Started" \n    }\n  ]\n}\n``` \n',
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(
      `Project Title: ${title}\\nDescription: ${description}\\nEnd Goals: ${endGoals}\\nStart Date: ${startDate}\\nEnd Date: ${endDate}\\nTeam Members: ${teamMembersNames}\\n\\nRecommend tasks with title, description, start date, status(default todo)due dates and priorities and assignments to the team members provided, output should be in json`
    );

    const recommendedTask = JSON.parse(result.response.text());

    res.json(recommendedTask);
  }

  run();
});

function getPriority(priority) {
  if (priority === "Low") {
    return "LOW";
  } else if (priority === "Medium") {
    return "MEDIUM";
  } else if (priority === "High") {
    return "HIGH";
  }
}

recommendRouuter.post("/api/store-project", async (req, res) => {
  try {
    const { title, description, startDate, endDate, teamMembers, tasks, user } =
      req.body;
    const teamMembersNames = teamMembers.map((member) => member.name);

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
                  teamMembers.find((member) => member.name === task.assignment)
                    .id
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
