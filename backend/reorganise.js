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

reorganiseRouuter.post("/reorganise-schedule", async (req, res) => {
  const schedule = req.body.schedule;
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

    async function run() {
      const chatSession = model.startChat({
        generationConfig,

        history: [
          {
            role: "user",
            parts: [
              {
                text: "Reorganize the following project  schedule to be more efficient and balanced:\n  ${JSON.stringify(schedule)}\n  Provide the reorganized schedule in the same format.{\n  id: 3,\n  title: 'Project Beta',\n  description: 'My second project',\n  status: 'IN_PROGRESS',\n  start_date: '2024-07-04T00:00:00.000Z',\n  due_date: '2024-07-11T00:00:00.000Z',\n  priority: 'LOW',\n  manager_id: 1,\n  createdAt: '2024-07-03T22:02:36.494Z',\n  updatedAt: '2024-07-04T21:31:43.347Z',\n  tasks: [\n    {\n      id: 2,\n      title: 'task 1',\n      description: 'Do all P0 tasks',\n      status: 'COMPLETED',\n      start_date: '2024-07-05T00:00:00.000Z',\n      due_date: '2024-07-19T00:00:00.000Z',\n      project_id: 3,\n      assignee_id: 3,\n      title_is_updating: false,\n      description_is_updating: false,\n      status_is_updating: false,\n      due_date_is_updating: false,\n      assignee_is_updating: false,\n      title_lockTimestamp: null,\n      description_lockTimestamp: null,\n      status_lockTimestamp: null,\n      due_date_lockTimestamp: null,\n      assignee_lockTimestamp: null,\n      createdAt: '2024-07-04T21:08:06.750Z',\n      updatedAt: '2024-07-07T22:12:38.985Z',\n      assignee: [Object]\n    },\n    {\n      id: 3,\n      title: 'task 2',\n      description: 'second',\n      status: 'IN_PROGRESS',\n      start_date: '2024-07-11T00:00:00.000Z',\n      due_date: '2024-07-22T00:00:00.000Z',\n      project_id: 3,\n      assignee_id: 3,\n      title_is_updating: false,\n      description_is_updating: false,\n      status_is_updating: false,\n      due_date_is_updating: false,\n      assignee_is_updating: false,\n      title_lockTimestamp: null,\n      description_lockTimestamp: null,\n      status_lockTimestamp: null,\n      due_date_lockTimestamp: null,\n      assignee_lockTimestamp: null,\n      createdAt: '2024-07-04T21:12:11.074Z',\n      updatedAt: '2024-07-04T21:12:11.074Z',\n      assignee: [Object]\n    }\n  ],\n  manager: {\n    id: 1,\n    name: 'jane doe',\n    email: 'jane@gmail.com',\n    password: '$2b$10$LOd/ArKrMgsACwB3UX8Oau5X3VzPozuCqMflgk1gMvMpOlljvD.pK',\n    role: 'PM',\n    createdAt: '2024-07-02T21:46:17.673Z',\n    updatedAt: '2024-07-02T21:46:17.673Z'\n  },\n  teamMembers: [\n    {\n      id: 2,\n      name: 'Timothy Itodo',\n      email: 'timo@gmail.com',\n      password: '$2b$10$MSPRhJXml55xrCGNHCkLAeM16XhPsfVUbHpXsdnEc0BkqBUPZCdn6',\n      role: 'TM',\n      createdAt: '2024-07-02T21:48:18.922Z',\n      updatedAt: '2024-07-02T21:48:18.922Z'\n    },\n    {\n      id: 3,\n      name: 'Zara Duruji',\n      email: 'zara@gmail.com',\n      password: '$2b$10$Slu0FKdZ4GFvQ12IHUy/uu03ubgwa9EIkSumNiMrSEN0uGN8JgqLG',\n      role: 'TM',\n      createdAt: '2024-07-02T21:48:45.361Z',\n      updatedAt: '2024-07-02T21:48:45.361Z'\n    }\n  ]\n}",
              },
            ],
          },
          {
            role: "model",
            parts: [
              {
                text: '```json\n{\n  "id": 3,\n  "title": "Project Beta",\n  "description": "My second project",\n  "status": "IN_PROGRESS",\n  "start_date": "2024-07-04T00:00:00.000Z",\n  "due_date": "2024-07-11T00:00:00.000Z",\n  "priority": "LOW",\n  "manager_id": 1,\n  "createdAt": "2024-07-03T22:02:36.494Z",\n  "updatedAt": "2024-07-04T21:31:43.347Z",\n  "tasks": [\n    {\n      "id": 2,\n      "title": "task 1",\n      "description": "Do all P0 tasks",\n      "status": "COMPLETED",\n      "start_date": "2024-07-05T00:00:00.000Z",\n      "due_date": "2024-07-09T00:00:00.000Z",\n      "project_id": 3,\n      "assignee_id": 3,\n      "title_is_updating": false,\n      "description_is_updating": false,\n      "status_is_updating": false,\n      "due_date_is_updating": false,\n      "assignee_is_updating": false,\n      "title_lockTimestamp": null,\n      "description_lockTimestamp": null,\n      "status_lockTimestamp": null,\n      "due_date_lockTimestamp": null,\n      "assignee_lockTimestamp": null,\n      "createdAt": "2024-07-04T21:08:06.750Z",\n      "updatedAt": "2024-07-07T22:12:38.985Z",\n      "assignee": [\n        {\n          "id": 3,\n          "name": "Zara Duruji",\n          "email": "zara@gmail.com",\n          "password": "$2b$10$Slu0FKdZ4GFvQ12IHUy/uu03ubgwa9EIkSumNiMrSEN0uGN8JgqLG",\n          "role": "TM",\n          "createdAt": "2024-07-02T21:48:45.361Z",\n          "updatedAt": "2024-07-02T21:48:45.361Z"\n        }\n      ]\n    },\n    {\n      "id": 3,\n      "title": "task 2",\n      "description": "second",\n      "status": "IN_PROGRESS",\n      "start_date": "2024-07-10T00:00:00.000Z",\n      "due_date": "2024-07-11T00:00:00.000Z",\n      "project_id": 3,\n      "assignee_id": 2,\n      "title_is_updating": false,\n      "description_is_updating": false,\n      "status_is_updating": false,\n      "due_date_is_updating": false,\n      "assignee_is_updating": false,\n      "title_lockTimestamp": null,\n      "description_lockTimestamp": null,\n      "status_lockTimestamp": null,\n      "due_date_lockTimestamp": null,\n      "assignee_lockTimestamp": null,\n      "createdAt": "2024-07-04T21:12:11.074Z",\n      "updatedAt": "2024-07-04T21:12:11.074Z",\n      "assignee": [\n        {\n          "id": 2,\n          "name": "Timothy Itodo",\n          "email": "timo@gmail.com",\n          "password": "$2b$10$MSPRhJXml55xrCGNHCkLAeM16XhPsfVUbHpXsdnEc0BkqBUPZCdn6",\n          "role": "TM",\n          "createdAt": "2024-07-02T21:48:18.922Z",\n          "updatedAt": "2024-07-02T21:48:18.922Z"\n        }\n      ]\n    }\n  ],\n  "manager": {\n    "id": 1,\n    "name": "jane doe",\n    "email": "jane@gmail.com",\n    "password": "$2b$10$LOd/ArKrMgsACwB3UX8Oau5X3VzPozuCqMflgk1gMvMpOlljvD.pK",\n    "role": "PM",\n    "createdAt": "2024-07-02T21:46:17.673Z",\n    "updatedAt": "2024-07-02T21:46:17.673Z"\n  },\n  "teamMembers": [\n    {\n      "id": 2,\n      "name": "Timothy Itodo",\n      "email": "timo@gmail.com",\n      "password": "$2b$10$MSPRhJXml55xrCGNHCkLAeM16XhPsfVUbHpXsdnEc0BkqBUPZCdn6",\n      "role": "TM",\n      "createdAt": "2024-07-02T21:48:18.922Z",\n      "updatedAt": "2024-07-02T21:48:18.922Z"\n    },\n    {\n      "id": 3,\n      "name": "Zara Duruji",\n      "email": "zara@gmail.com",\n      "password": "$2b$10$Slu0FKdZ4GFvQ12IHUy/uu03ubgwa9EIkSumNiMrSEN0uGN8JgqLG",\n      "role": "TM",\n      "createdAt": "2024-07-02T21:48:45.361Z",\n      "updatedAt": "2024-07-02T21:48:45.361Z"\n    }\n  ]\n}\n```\n\n**Changes made:**\n\n* **Task 1:**\n    * Due date moved from 2024-07-19 to 2024-07-09 to ensure it\'s completed before the project\'s due date.\n* **Task 2:**\n    * Start date moved from 2024-07-11 to 2024-07-10 to distribute the workload more evenly.\n    * Assignee changed to Timothy Itodo (id: 2) for workload balancing.\n\n**Reasoning:**\n\nThe original schedule had task 1 due after the project\'s due date, which is inefficient. The reorganization ensures that both tasks are completed before the project\'s deadline, while also distributing the workload evenly among team members. \n',
              },
            ],
          },
        ],
      });

      const result = await chatSession.sendMessage(
        `Reorganize the following project  schedule to be more efficient and balanced:\n  ${JSON.stringify(
          schedule
        )}\n  Provide the reorganized schedule in the same format and do not suggest a new task`
      );
      const message = await chatSession.sendMessage(
        `Send a message on each of the changes made as a JSON.`
      );

      const reorganizedSchedule = JSON.parse(result.response.text());

      const changes = JSON.parse(message.response.text());

      res.json({ reorganizedSchedule, changes });
    }

    run();
  } catch (error) {
    console.error("Error reorganising schedule: ", error);
    res.status(500).json({ error: "Failed to reorganize schedule" });
  }
});

export default reorganiseRouuter;
