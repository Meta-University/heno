import "./TaskDetails.css";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import EditTaskForm from "../EditTaskForm/EditTaskForm";

function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const navigate = useNavigate();
  const [displayEditForm, setDisplayEditForm] = useState(false);

  async function fetchTask() {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`);
      const data = await response.json();
      setTask(data);
    } catch (error) {
      console.error("Error fetching task", error);
    }
  }

  useEffect(() => {
    fetchTask();
  }, [id]);

  function formatText(text) {
    return text
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function handleDisplayTaskList() {
    navigate("/tasks");
  }

  function handleEditClick() {
    setDisplayEditForm(!displayEditForm);
  }

  async function handleDeleteTask() {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        navigate("/tasks");
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (!task) return <div>Loading...</div>;

  return (
    <div className="task-details-container">
      <div className="task-header">
        <div className="title-back-icon">
          <i
            className="fa-solid fa-arrow-left"
            onClick={handleDisplayTaskList}
          ></i>
          <h1>{task.title}</h1>
        </div>

        <div className="delete-edit-icon">
          <i className="fa-solid fa-pen" onClick={handleEditClick}></i>
          <i className="fa-solid fa-trash" onClick={handleDeleteTask}></i>
        </div>
      </div>
      <div className="assignee-table">
        <p className="detail-title">
          Assigned to {task.assignee ? task.assignee.name : "unassigned"}
        </p>
      </div>

      <div className="task-details">
        <h4>Details</h4>
        <div className="detail">
          <p className="detail-title">Status</p>
          <p>{formatText(task.status)}</p>
        </div>
        <div className="detail">
          <p className="detail-title">Due date</p>
          <p>{new Date(task.due_date).toDateString()}</p>
        </div>
        <div className="detail">
          <p className="detail-title">Created</p>
          <p>{new Date(task.createdAt).toDateString()}</p>
        </div>
        <div className="detail">
          <p className="detail-title">Updated</p>
          <p>{new Date(task.updatedAt).toDateString()}</p>
        </div>

        <h4>Description</h4>
        <p>{task.description}</p>

        <div className="file-upload">
          <h3>Upload file</h3>
          <input type="file" />
        </div>

        <div className="comment-section">
          <h3>Comments</h3>
          <ul></ul>
          <textarea placeholder="Add a comment" />
          <button>Send</button>
        </div>
      </div>
      <div className={`edit-form-container ${displayEditForm && "visible"}`}>
        <EditTaskForm
          task={task}
          displayEditForm={handleEditClick}
          refreshTask={fetchTask}
        />
      </div>
    </div>
  );
}

export default TaskDetails;
