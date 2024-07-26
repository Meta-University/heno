# Project Name: Heno

<b>Project Plan:</b> [PROJECTPLAN.md](PROJECTPLAN.md)

<b>Intern:</b> Joy Itodo

<b>Intern Manager:</b> Shulin Zhao

<b>Intern Director:</b> Cesar Barraza

<b>Peer Mentors: </b> Yiming Wang and Haibo Zhang

<b>Category:</b> Productivity/Professional Services

## Description
Heno is a project management tool built using React and Node.js. It helps teams create and plan projects and tasks, with real-time updates and effective communication

## MVP features
- [x] User Authentication
  - [x] User can log in
  - [x]  User can create an account

- [x] Project Management
  - [x] User can create a project
  - [x] User can add team members to a project
  - [x] User can update a project
  - [x] User can delete a project

- [x] Task Management
  - [x] User can create a task
  - [x] User can update a task
  - [x] User can delete a task
  - [x] User can assign tasks to team members

- [x] Concurrency Control
  - [x] TC1: Lock-based concurrency for editing tasks

- [x] AI-Empowered Schedule Reorganization
  - [x] TC2: AI-suggested reorganization of task schedules

- [x] Task Interaction
  - [x] Users can comment on a task


### Stretch Features
- [x] Notifications
  - [x] Real-time notifications for task updates and comments
  - [x] Email notifications

- [x] AI Recommended Tasks
   - [x] AI-driven task recommendations based on project details

- [x] Data Visualization
  - [x] Visualization of project progress using charts and graphs


### How to run
- Install Node.js (with nodemon)
- Clone heno repo

- Run backend
  ```
   cd backend
   npm init -y
   npm i
   nodemon index.js
  ```

- Run frontend
   ```
    cd frontend
    npm i
    npm run dev
   ```
   Note: After running frontend, you will be provided a link to the localhost, copy that and put in your browser.
