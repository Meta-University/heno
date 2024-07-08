import "./TaskDetails.css";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import EditTaskForm from "../EditTaskForm/EditTaskForm";
import { capitalizeFirstLetters } from "../../capitalizeFirstLetters";
import CustomAlert from "../CustomAlert/CustomAlert";

function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const navigate = useNavigate();
  const [displayEditForm, setDisplayEditForm] = useState(false);
  const [error, setError] = useState("");

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

  function handleSetErrorMessage(message) {
    setError(message);
  }

  function handleDisplayTaskList() {
    navigate("/tasks");
  }

  function handleEditClick() {
    setDisplayEditForm(!displayEditForm);
  }

  function getStatusClass(status) {
    if (status == "NOT_STARTED") {
      return "not-started";
    } else if (status === "TODO") {
      return "todo";
    } else if (status === "IN_PROGRESS") {
      return "in-progress";
    } else if (status === "COMPLETED") {
      return "completed";
    } else if (status === "ON_HOLD") {
      return "on-hold";
    }
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
  if (error) return <CustomAlert message={"error"} onClose={setError("")} />;

  return (
    <div className="task-details-container">
      <div className="task-header">
        <div className="title-back-icon">
          <i
            className="fa-solid fa-arrow-left"
            onClick={handleDisplayTaskList}
          ></i>
          <h1>{capitalizeFirstLetters(task.title)}</h1>
        </div>

        <div className="delete-edit-icon">
          <i className="fa-solid fa-pen" onClick={handleEditClick}></i>
          <i className="fa-solid fa-trash" onClick={handleDeleteTask}></i>
        </div>
      </div>
      <div className="assignee-table">
        <p className="detail-title">
          Assigned to{" "}
          {task.assignee
            ? capitalizeFirstLetters(task.assignee.name)
            : "unassigned"}
        </p>
      </div>

      <div className="task-details">
        <h4>Details</h4>
        <div className="detail">
          <p className="detail-title">Status</p>
          <p className={`task ${getStatusClass(task.status)}`}>
            {formatText(task.status)}
          </p>
        </div>

        <div className="detail">
          <p className="detail-title">Created</p>
          <p>{new Date(task.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="detail">
          <p className="detail-title">Updated</p>
          <p>{new Date(task.updatedAt).toLocaleDateString()}</p>
        </div>
        <div className="detail">
          <p className="detail-title">Due date</p>
          <p>{new Date(task.due_date).toLocaleDateString()}</p>
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
          <input placeholder="Add a comment" />
          <button>Send</button>
        </div>
      </div>
      <div className={`edit-form-container ${displayEditForm && "visible"}`}>
        <EditTaskForm
          task={task}
          displayEditForm={handleEditClick}
          refreshTask={fetchTask}
          handleError={handleSetErrorMessage}
        />
      </div>
    </div>
  );
}

export default TaskDetails;
