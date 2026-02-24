import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../UserContext";
import "./CreateTaskForm.css";

function CreateTaskForm(props) {
  const { user } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const projectId = props.projectId;
  const isPersonalTask = !projectId && (!props.teamMembers || props.teamMembers.length === 0);

  useEffect(() => {
    if (isPersonalTask && user) {
      setAssigneeId(user.id.toString());
    }
  }, [isPersonalTask, user]);

  async function handleCreateTask(e) {
    e.preventDefault();
    const newTask = {
      title,
      description,
      assigneeId: parseInt(assigneeId),
      status,
      priority,
      due_date: dueDate,
      start_date: startDate,
    };

    if (projectId) {
      newTask.projectId = projectId;
    }

    try {
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
        credentials: "include",
      });
      const data = await response.json();
      if (props.addTask) {
        props.addTask(data);
      }
      if (props.onTaskCreated) {
        props.onTaskCreated(data);
      }
    } catch (error) {
      console.error("Error creating task", error);
    }
    props.displayForm();
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" id="create-task-form">
        <div className="create-close-task">
          <h2>Create a New Task</h2>
          <i className="fa-solid fa-xmark" onClick={props.displayForm}></i>
        </div>

        <form onSubmit={handleCreateTask} className="task-form">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
          <label>Start date</label>
          <input
            type="date"
            placeholder="Task Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <label>Due date</label>
          <input
            type="date"
            value={dueDate}
            placeholder="Task Due Date"
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          {isPersonalTask ? (
            <input
              type="text"
              value={user?.name || ""}
              disabled
              className="assignee-display"
            />
          ) : (
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              required
            >
              <option value="">Select team member</option>
              {props.teamMembers && props.teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          )}

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Set Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="">Set Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <div className="buttons">
            <button type="submit" className="create">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskForm;
