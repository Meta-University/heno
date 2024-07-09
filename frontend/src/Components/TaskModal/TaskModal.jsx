import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./TaskModal.css";

function TaskModal({ task, onClose }) {
  const [editableTask, setEditableTask] = useState({ ...task });
  const [isEditing, setIsEditing] = useState({
    title: false,
    description: false,
    status: false,
    assignee_id: false,
    dueDate: false,
    priority: false,
  });

  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  console.log(editableTask);
  function handleChange(e) {
    const { name, value } = e.target;
    setEditableTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  }

  function formatText(text) {
    return text
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function handleEdit(field) {
    setIsEditing((prevEditing) => ({
      ...prevEditing,
      [field]: true,
    }));
  }

  function handleBlur(field) {
    setIsEditing((prevEditing) => ({
      ...prevEditing,
      [field]: false,
    }));
  }

  function handleSave() {
    onSave(editableTask);
  }

  async function handleEditTask(event) {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        navigate(`/tasks/${id}`);
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Error updating task");
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="task-icons">
          <i className="fa-solid fa-paperclip"></i>
          <i className="fa-solid fa-trash"></i>
          <i className="fa-solid fa-xmark" onClick={onClose}></i>
        </div>
        {error && <div>{error}</div>}

        <div className="task-title">
          {isEditing.title ? (
            <input
              type="text"
              name="title"
              value={editableTask.title}
              onChange={handleChange}
              onBlur={() => handleBlur("title")}
              autoFocus
            />
          ) : (
            <span onClick={() => handleEdit("title")}>
              {editableTask.title}
            </span>
          )}
        </div>

        <label>
          Assignee:
          {isEditing.assignee_id ? (
            <select
              name="assignee_id"
              value={editableTask.assignee_id}
              onChange={handleChange}
              onBlur={() => handleBlur("assignee_id")}
              autoFocus
            >
              {editableTask.project.teamMembers.map((assignee, index) => (
                <option key={index} value={assignee.id}>
                  {assignee.name}
                </option>
              ))}
            </select>
          ) : (
            <span onClick={() => handleEdit("assignee_id")}>
              {editableTask.assignee.name}
            </span>
          )}
        </label>

        <label>
          Status:
          {isEditing.status ? (
            <select
              name="status"
              value={editableTask.status}
              onChange={handleChange}
              onBlur={() => handleBlur("status")}
              autoFocus
            >
              <option value="">Set Status</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          ) : (
            <span onClick={() => handleEdit("status")}>
              {editableTask.status && formatText(editableTask.status)}
            </span>
          )}
        </label>
        <label>
          Due Date:
          {isEditing.dueDate ? (
            <input
              type="date"
              name="dueDate"
              value={editableTask.due_date}
              onChange={handleChange}
              onBlur={() => handleBlur("dueDate")}
              autoFocus
            />
          ) : (
            <span onClick={() => handleEdit("dueDate")}>
              {new Date(editableTask.due_date).toDateString()}
            </span>
          )}
        </label>

        <label>
          Description:
          {isEditing.description ? (
            <textarea
              name="description"
              value={editableTask.description}
              onChange={handleChange}
              onBlur={() => handleBlur("description")}
              autoFocus
            />
          ) : (
            <span
              className="description-span"
              onClick={() => handleEdit("description")}
            >
              {editableTask.description}
            </span>
          )}
        </label>
        <div className="modal-buttons">
          <button onClick={handleEditTask}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
