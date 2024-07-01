import "./TaskDetails.css";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const navigate = useNavigate();

  async function fetchtask() {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`);
      const data = await response.json();
      setTask(data);
    } catch (error) {
      console.error("Error fetching task", error);
    }
  }

  useEffect(() => {
    fetchtask();
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

  function handleEditClick() {}

  function handleDeleteTask() {}

  if (!task) return <div>Loading...</div>;

  return (
    <div className="task-details-container">
      <div className="task-header">
        <div>
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
      </div>
    </div>
  );
}

export default TaskDetails;
