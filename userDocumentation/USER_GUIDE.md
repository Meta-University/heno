# Screenshots for User Documentation

This folder is for **screenshots of key features** used in the User Guide (`USER_GUIDE.md`). Add PNG (or JPG) images with the filenames below so the guide can reference them.

<img width="1440" height="780" alt="Screenshot 2026-03-01 at 7 44 15 PM" src="https://github.com/user-attachments/assets/90e47257-a566-47ed-99ff-ccb6ad5c5d14" />
<img width="1440" height="779" alt="Screenshot 2026-03-01 at 7 44 30 PM" src="https://github.com/user-attachments/assets/81690c61-9666-45cc-a31b-6eae254af282" />
<img width="1440" height="777" alt="Screenshot 2026-03-01 at 7 42 51 PM" src="https://github.com/user-attachments/assets/c76200a9-87ae-42da-9b0f-a8dd2727a7b2" />
<img width="1440" height="780" alt="Screenshot 2026-03-01 at 7 43 10 PM" src="https://github.com/user-attachments/assets/3ed02ef4-78e7-44fb-a5b4-6cfb53fc3cfd" />
<img width="1440" height="777" alt="Screenshot 2026-03-01 at 7 43 23 PM" src="https://github.com/user-attachments/assets/d25d5c36-62ba-4483-b5a7-e0579179d01a" />
<img width="1440" height="773" alt="Screenshot 2026-03-01 at 7 43 39 PM" src="https://github.com/user-attachments/assets/9a671b65-9220-4fd8-911b-90d27156ab3f" />


## Tips

- Use a **consistent browser and window size** (e.g. 1280×720 or 1920×1080) for a uniform look.
- **Hide or blur** any real personal data (emails, names) if screenshots are shared publicly; use test accounts when possible.
- **PNG** is preferred for clarity; JPG is fine if you need smaller file size.
- After adding screenshots, you can reference them in `USER_GUIDE.md` with relative paths, e.g. `![Login](screenshots/01-login.png)`.

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

### AI Recommendation is slow or fails

- **Long wait** – AI recommendations can take 30 seconds or more. Stay on the loading page until it finishes.
- **Error or timeout** – Check your internet connection. If the server is busy, try again later. Ensure the AI service is configured on the server.

### Notifications don't appear or don't update

- **Real-time connection** – Notifications use a live connection (WebSocket). Strict firewalls or proxies may block it.
- **Badge count wrong** – Open the Notifications page to mark them as read; the count should update.

### Calendar doesn't show my tasks

- **No tasks with dates** – Only tasks with start or due dates appear. Edit tasks and set dates if needed.
- **Wrong month** – Use the calendar controls to move to the correct month.

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
