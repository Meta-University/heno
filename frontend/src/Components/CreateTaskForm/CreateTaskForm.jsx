import { useState } from "react";
import "./CreateTaskForm.css";

function CreateTaskForm(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const projectId = props.projectId;

  async function handleCreateTask(e) {
    e.preventDefault();
    const newTask = {
      title,
      description,
      assigneeId: parseInt(assigneeId),
      status,
      due_date: dueDate,
      start_date: startDate,
      projectId,
    };

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
      props.addTask(data);
    } catch (error) {
      console.error("Error creating task", task);
    }
  }

  return (
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
      <input
        type="date"
        placeholder="Task Start Date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      />
      <input
        type="date"
        value={dueDate}
        placeholder="Task Due Date"
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
      <select
        value={assigneeId}
        onChange={(e) => setAssigneeId(e.target.value)}
        required
      >
        <option value="">Select team member</option>
        {props.teamMembers.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>

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

      <div className="buttons">
        <button type="submit" className="create">
          Create Task
        </button>
      </div>
    </form>
  );
}

export default CreateTaskForm;
