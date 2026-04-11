import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./TaskList.css";
import { capitalizeFirstLetters } from "../../capitalizeFirstLetters";
import { API_BASE } from "../../config";

function TaskList(props) {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  async function fetchTasks() {
    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        credentials: "include",
      });
      if (response.status === 401) {
        navigate("/login");
        return;
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  function formatText(text) {
    return text
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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

  return (
    <div className="task-view-container">
      <div className="task-view-header">
        <h1>My Tasks</h1>
      </div>

      <div className="task-table-wrapper">
        <table className="task-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Project</th>
              <th>Assignee</th>
              <th>Due</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>#{task.id}</td>
                <td>{capitalizeFirstLetters(task.title)}</td>
                <td className={getStatusClass(task.status)}>
                  {formatText(task.status)}
                </td>
                <td>{task.project ? capitalizeFirstLetters(task.project.title) : "Personal"}</td>
                <td>
                  {task.assignee
                    ? capitalizeFirstLetters(task.assignee.name)
                    : "Unaasigned"}
                </td>
                <td>{new Date(task.due_date).toLocaleDateString()}</td>
                <td>
                  <Link to={`/tasks/${task.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskList;
