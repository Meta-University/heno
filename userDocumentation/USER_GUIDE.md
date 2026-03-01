# Screenshots for User Documentation

This folder is for **screenshots of key features** used in the User Guide (`USER_GUIDE.md`). Add PNG (or JPG) images with the filenames below so the guide can reference them.

## Checklist: Screenshots to Capture

Capture these from a running instance of Heno (with sample data if helpful):

| # | Filename | What to capture |
|---|----------|-----------------|
| 1 | `01-login.png` | Login page: email and password fields, Login button |
| 2 | `02-home.png` | Home page: welcome message, Home Tasks, Home Projects sections |
| 3 | `03-projects-list.png` | Projects page: "My Projects" header, project cards, create button |
| 4 | `04-project-details.png` | A single project open: project info, tabs/actions (e.g. Kanban, team) |
| 5 | `05-kanban-board.png` | Kanban view: columns (e.g. TODO, In Progress, Completed) with tasks, drag-and-drop visible |
| 6 | `06-task-list.png` | Tasks page: list of tasks with key info (title, status, dates, etc.) |
| 7 | `07-task-details.png` | One task open: full details, comments section, edit option |
| 8 | `08-notifications.png` | Notifications page: list of notifications, read/unread state |
| 9 | `09-ai-recommendation.png` | AI Recommendation: either the input form or the results table (or both in one screenshot) |
| 10 | `10-calendar.png` | Calendar page: month view with tasks on the calendar |
| 11 | `11-schedule-diff.png` | Schedule diff view: current vs AI-suggested schedule comparison |
| 12 | `12-visualization.png` | Project visualization: charts/timeline for a project |

## Tips

- Use a **consistent browser and window size** (e.g. 1280×720 or 1920×1080) for a uniform look.
- **Hide or blur** any real personal data (emails, names) if screenshots are shared publicly; use test accounts when possible.
- **PNG** is preferred for clarity; JPG is fine if you need smaller file size.
- After adding screenshots, you can reference them in `USER_GUIDE.md` with relative paths, e.g. `![Login](screenshots/01-login.png)`.

## Referencing in USER_GUIDE.md

To show a screenshot in the User Guide, add a line like:

```markdown
![Login screen](screenshots/01-login.png)
```

Place it in the relevant "Key Features" or "Screenshots" section in `USER_GUIDE.md`.

---

## Troubleshooting Common Issues

### I can't log in

- **Wrong password** – Check that Caps Lock is off and retype your password. Use "Forgot password" if available.
- **Account doesn't exist** – Make sure you've signed up first. Try signing up with your email if you're unsure.
- **Page doesn't load or blank screen** – Refresh the page, clear your browser cache, or try another browser. Check that you're using the correct app URL.

### I'm logged out unexpectedly

- **Session expiry** – Log in again. Sessions may expire after a long period or after a server restart.
- **Cookies disabled** – The app uses cookies for login. Enable cookies for the app's domain in your browser settings.
- **Different browser or device** – You need to log in separately on each browser or device.

### Projects or tasks don't load

- **No internet or server down** – Check your connection and try again. If you're self-hosting, ensure the backend server is running.
- **Wrong or outdated URL** – Confirm you're on the correct app address (e.g. no typo in the URL).
- **Refresh** – Reload the page. If it persists, log out and log back in.

### Kanban drag-and-drop doesn't update status

- **No change after drop** – Make sure you dropped the task in a different column (e.g. from TODO to In Progress). Refresh and try again.
- **Error message** – Check your internet connection. If you see an error in the app, try again later or contact support.

### AI Recommendation is slow or fails

- **Long wait** – AI recommendations can take 30 seconds or more. Stay on the loading page until it finishes.
- **Error or timeout** – Check your internet connection. If the server is busy, try again later. Ensure the AI service is configured on the server.

### Notifications don't appear or don't update

- **Real-time connection** – Notifications use a live connection (WebSocket). Strict firewalls or proxies may block it.
- **Badge count wrong** – Open the Notifications page to mark them as read; the count should update.

### Calendar doesn't show my tasks

- **No tasks with dates** – Only tasks with start or due dates appear. Edit tasks and set dates if needed.
- **Wrong month** – Use the calendar controls to move to the correct month.

### Schedule diff or visualization is empty or wrong

- **No schedule data** – Schedule diff and visualizations need project and task data. Create tasks with dates and status first.
- **Stale data** – Refresh the project page or re-open the diff/visualization after updating tasks.

### General "something went wrong" or blank pages

- **Browser** – Use an up-to-date browser (e.g. Chrome, Firefox, Safari, Edge).
- **Cache** – Hard refresh (e.g. Ctrl+F5 or Cmd+Shift+R) or clear site data for the app.
- **URL** – Make sure you're not on an old or invalid URL (e.g. a broken link).

---

## FAQ

**Q: What is Heno?**  
A: Heno is a project and task management app. You can create projects, add tasks, use a Kanban board, get AI task recommendations, view a calendar, and see charts and schedule comparisons.

**Q: How do I create a project?**  
A: Go to **Projects** → click the create/new project button → fill in the form (title, description, dates, etc.) → submit.

**Q: How do I add tasks to a project?**  
A: Open the project, then add tasks from the project view (e.g. "Add task" or similar). You can also create or edit tasks from the **Tasks** page and link them to a project.

**Q: What is the Kanban board?**  
A: It's a board with columns (e.g. TODO, In Progress, Completed). You drag tasks between columns to change their status.

**Q: What is AI Recommendation?**  
A: You describe a project (title, description, goals, dates, team). The app suggests a list of tasks for that project. You can then add those tasks to a real project.

**Q: Where do I see notifications?**  
A: Use **Notifications** in the sidebar. The bell icon shows an unread count when you have new notifications.

**Q: Can I use Heno on mobile?**  
A: The app runs in a browser, so you can use it on a phone or tablet. For the best experience, use a desktop or laptop when possible.

**Q: My data is missing. Is it saved?**  
A: Data is stored on the server. If you don't see it, check that you're logged in with the correct account and that the server is reachable. Contact your administrator if the problem continues.

**Q: Who do I contact for help?**  
A: For bugs or account issues, contact your system administrator or the support contact provided by your organization.
