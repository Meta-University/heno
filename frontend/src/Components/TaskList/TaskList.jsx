import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./TaskList.css";

function TaskList(props) {
  const [tasks, setTasks] = useState([]);

  async function fetchTasks() {
    try {
      const response = await fetch("http://localhost:3000/tasks");
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
              <td>{task.title}</td>
              <td>{formatText(task.status)}</td>
              <td>{task.project.title}</td>
              <td>{task.assignee ? task.assignee.name : "Unaasigned"}</td>
              <td>{new Date(task.due_date).toDateString()}</td>
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
