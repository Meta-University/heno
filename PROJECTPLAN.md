# Project Name: Heno
https://docs.google.com/document/d/1NOvkJmvaQqjIpZoUuXl-t2kShQjH4kAj3lvV5Kzetzg/edit?usp=sharing

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

## Screen Archetypes

1. Login
2. Register
3. Project Dashboard
4. Task Dashboard
5. Project creation
6. Task creation
7. Project update
8. Task update
9. Project view
10. Task view
11. User’s profile





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



## Data Model

### Users
| Column name | Type          | Description                             |
|-------------|---------------|-----------------------------------------|
| id      |INT           | Primary key  |
| name      |VARCHAR           | Full name of user  |
| email      |VARCHAR           | User’s email  |
| password      |VARCHAR           | User’s password  |
| role      |ENUM           | User’s role (Project manager or Team member)  |
| created_at      |TIMESTAMP           | The time and date a user created the account  |
| updated_at      |TIMESTAMP           | The time and date a user updated their account  |

### Projects
| Column name | Type          | Description                             |
|-------------|---------------|-----------------------------------------|
| id      |INT           | Primary key  |
| name      |VARCHAR           | Project name  |
| description     |TEXT           | Project description  |
| start_date      | DATE           | Project start date  |
| due_date      | DATE           | Project end/due date |
| status      |INT          | Project status (pending, in progress, completed)  |
| manager_id      |ENUM           | Foreign key (references User)  |
| created_at      |TIMESTAMP           | Time the project was created  |
| updated_at      |TIMESTAMP           | Time project was updated |

### Tasks
| Column name | Type          | Description                             |
|-------------|---------------|-----------------------------------------|
| id      |INT           | Primary key  |
| name      |VARCHAR           | Task name  |
| description     |TEXT           | Task description  |
| start_date      | DATE           | Task start date  |
| due_date      | DATE           | Task end/due date |
| status      |INT          | Task status (pending, in progress, completed)  |
| project_id     |INT          | Foreign key (references Projects)  |
| assignee_id      |ENUM           | Foreign key (references User)  |
| created_at      |TIMESTAMP           | Time the task was created  |
| updated_at      |TIMESTAMP           | Time task was updated |

### Comments
| Column name | Type          | Description                             |
|-------------|---------------|-----------------------------------------|
| id      |INT           | Primary key  |
| content     | TEXT          | TComment content  |
| task_id    |INT          | Foreign key (references Task)  |
| user_id      | INT           | Foreign key (references User)  |
| created_at      |TIMESTAMP           | Time the comment was created  |
| updated_at      |TIMESTAMP           | Time comment was updated |

## Technical Challenges

For your project, you should demonstrate that you can apply what you’ve learned so far and expand on that knowledge to write code and implement features that go beyond the scope of the projects you worked on during CodePath.

Based on the general idea and direction of your project requirements, your intern manager will create at least two (2) Technical Challenges for you. This section is all about explaining what they are and how you’re planning to tackle them - you’ll work together with your manager to fill it out.

### Technical Challenge #1 - [Name/Small Description]
What
What problem are you solving, and what parts go beyond what you learned in CodePath?
How
Explain in words how you’ll solve this problem.

You’re encouraged to expand on this section with pseudo-code, links to external frameworks, architecture / design diagrams, anything that you can use to explain this to others!
Technical Challenge #2
What
How

## Database Integration
I am using Postgres (PgAdmin)
