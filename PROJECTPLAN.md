# Project Name: Heno
For full details including timelies, wireframes, designs, see: [Project Plan Document](https://docs.google.com/document/d/1NOvkJmvaQqjIpZoUuXl-t2kShQjH4kAj3lvV5Kzetzg/edit?usp=sharing)


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

### Technical Challenge #1 

#### What
<b>Concurrent Writing:</b> There is a possibility that multiple users (either manager + one team member, or multiple team members) are attempting to update the same task item. This is a “popular” challenge in almost every domain in computer science, eg, cache coherence and consistency, data consistency in distributed systems, etc. Solving the concurrent writes problem in this project would be beneficial to understanding MESI cache protocol, lock-based concurrency control, etc.

#### How

- [P0]: Lock-based Concurrency Control (Coarse-granularity, non-blocking)
Maintain a “giant” lock for each task, and require to obtain the lock prior to attempting the update request. Pseudo code looks like:


  ```
  If !is_updating:
    update()
  Else:
    # Failing this request immediately
    notify("other(s) is updating now, please try another time")
    return
  ```

- [P1]: Lock-based Concurrency Control (Fine-granularity, non-blocking)
A stretch is, instead of maintaining a lock for all items in a task, each item in this task could have its own lock: the locks are finer hence the update failure rate will be reduced.

- [P1]: Lock-based Concurrency Control (Fine-granularity,  blocking with timeout)
Another stretch is allowing a `timeout` awaiting tolerance before failing the update request.



### Technical Challenge #2

#### What
<b>AI-empowered Schedule Reorganisation:</b>
 The admin/manager could be overwhelmed with creating and assigning numeral tasks to members, and the schedule (start_time, end_time, assignee) could be imbalanced. To address this, we could take advantage of public LLAMA (e.g. ChatGPT) interfaces to help reorganise the task schedule to be more efficient and better balanced.

#### How

1. A button available to manager, "AI help me reorganise please"
2. Collect the snapshot of current status
3. Construct a LLAMA request, and send out
4. Receive and parse the response
5. Based on the response, generate a "diff" screenshot comparing "now" vs "AI-suggested"
6. If manager agrees on the change, click "OK" to apply the changes; if not, rollback


## Database Integration
I am using Prisma to interact with Postgresql for database storage.

## External APIs
The project will make use of the Gemini API to reorganize tasks schedules and make it more efficient for the manager.

## Authentication
Users can create an account, their information will be stored in the database (passwords will be hashed). If user information is correct when logging in, they will be authenticated.
I am implementing cooking/session management with the “express-session” module, cookies will expire 1 year after the user has logged in unless they log out from their account.


## Visuals and Interactions

- Interesting Cursor Interaction: When hovering on an item that is clickable, it changes the cursor to a pointer
- UI Component with Custom Visual Styling: Making use of font awesome icons.
- Loading State: Making use of the react useState hook to monitor when a user is fetching data or performing an asynchronous operation. If this state is true, a loading component screen will be displayed.
