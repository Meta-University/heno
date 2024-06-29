import React, { useState } from "react";
import "./CreateForm.css";
import AddTeamMembers from "../AddTeamMembers/AddTeamMembers";

function CreateForm(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [priority, setPriority] = useState("");
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  async function handleCreateProject(event) {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          status,
          startDate,
          dueDate,
          priority,
          teamMembers,
        }),
        credentials: "include",
      });
      const data = await response.json();
      setProjects([...projects, data]);
      props.refreshProjects();
    } catch (error) {
      console.log(error);
    }
    props.displayForm();
  }

  function handleTeamMemberAdded(member) {
    setTeamMembers([...teamMembers, member]);
  }

  return (
    <div className="create-project-form">
      <h1>Create a New Project</h1>
      <form onSubmit={handleCreateProject}>
        <input
          type="text"
          placeholder="Project Title"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Project Description"
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <input
          type="date"
          placeholder="Project Start Date"
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Project Due Date"
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="">Set Status</option>
          <option value="NOT_STARTED">Not Started</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="ON_HOLD">On Hold</option>
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
        <AddTeamMembers onTeamMemberAdded={handleTeamMemberAdded} />
        <div className="buttons">
          <button type="submit" className="create">
            Create Project
          </button>
          <button type="button" className="cancel" onClick={props.displayForm}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateForm;
