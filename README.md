# Project Name: Heno

Intern: Joy Itodo  
Intern Manager: Shulin Zhao  
Intern Director: Cesar Barraza  

Category: Productivity/Professional Services  
Description: A project management tool that helps teams create and plan projects and tasks, with real-time updates and effective communication

## User roles
1. Project manager: a user who creates projects, assigns tasks to team members and tracks their progress.
2. Team members: a user who can view a task assigned to them, and can update and track their progress

## User stories:
1. As a project manager, I want to create a project, so I can group related tasks and monitor my team’s work.
2. As a project manager, I want to create a task, so I can break down my project into a smaller step and assign it to a team member
3. As a project manager, I want to be able to update a project, so I can change the requirements, description and status
4. As a project manager, I want to update a task, so I can change description and status of a task
5. As a project manager, I want to assign a task to a team member, so I can know who is responsible for a task
6. As a team member, I want to view my task(s), so I can know the description of my task(s) and be aware of the timeline
7. As a team member, I want to update the status of my task, so I can keep my team informed on my progress
8. As a team member, I want to view comments, so I can see others feedbacks or thoughts on my task
9. As a team member, I want to comment on a task, so I can  effectively collaborate with my team 
10. As a team member, I want to receive notifications about my task updates, so I can stay informed on any important update

## User personas:
#### Project Manager
- Name: Klaus Michaelson
- Background: Experienced project manager. Currently manages a team of 10 developers working on multiple projects.
- Motivation:
  - Organise project planning and task assignment.
  - Ensure clear communication across all team members.
  - Monitor project progress and status.
- Pain Points:
  - Struggles with using multiple communication tools (email, google chat) that lead to missed updates.
  - Difficulty maintaining a clear overview of multiple projects and their timelines.
  - Wants a way to easily track individual task progress and team member workloads.
- Heno Usage:
  - Klaus heavily relies on Heno's project creation and task assignment features. He uses the real-time updates to stay informed and adjust plans as needed. He values the ability to leave comments and feedback directly on tasks to keep everyone aligned.

#### Team Member
- Name: Marcel Gerard
- Background: Junior frontend developer with 2 years of experience. Excited to contribute to the team's success.
- Motivation:
  - Understand task requirements clearly.
  - Stay on top of deadlines and communicate progress effectively.
  - Collaborate smoothly with other team members.
- Pain Points:
  - Sometimes feels overwhelmed by a lot of information coming from different sources.
  - Worries about missing important task updates or changes.
  - Wants to easily provide updates on his progress without having to send separate emails or messages.
- Heno Usage:
  - Marcel checks Heno regularly to view his assigned tasks and the project timeline. He uses the status updates to let his manager know how things are going. He finds the notification feature very helpful in keeping him informed.

## Server Endpoints
| HTTP Verb | Name           | Description                             | User stories|
|-----------|----------------|-----------------------------------------|-------------|
| POST      | user           |Add a new user to the users collection   | 2           |
| GET       | user/id        |Fetch a user from the users collection   | 2           |
| PUT       | user/id        |Update a user’s profile                  | 2           |
| DELETE    | user/id        |Remove a user from the user collection   | 2           |
| POST      | project        |Add a project to the project collection  | 1           |
| GET       | projects/user/user_id | Fetch the list of a user’s project | 1           |
| DELETE    | projects/id | Remove a project from the project collection | 1           |
| PUT    | projects/id | Update a project’s information | 1           |
| POST    | projects/id/tasks | Add a new task to the task collection | 1           |
| GET    | projects/id/tasks | Fetch the list of tasks for a particular project | 2           |
| GET    | tasks/users/user_id | Fetch the list of a user’s tasks | 2           |
| GET    | tasks/id/users/user_id | Fetch a task from the user’s task collection | 2           |
| DELETE    | tasks/id | Remove a task from the task collection | 1           |
| PUT    | tasks/id | Update a task’s information | 2           |


