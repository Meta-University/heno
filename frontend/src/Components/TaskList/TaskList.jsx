import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./TaskList.css";
import { capitalizeFirstLetters } from "../../capitalizeFirstLetters";

function TaskList(props) {
  const [tasks, setTasks] = useState([]);

  async function fetchTasks() {
    try {
      const response = await fetch("http://localhost:3000/tasks", {
        credentials: "include",
      });
      const data = await response.json();
      setTasks(data);
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
              <td>{capitalizeFirstLetters(task.project.title)}</td>
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
  );
}

export default TaskList;
