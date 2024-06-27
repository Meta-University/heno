import "./ProjectList.css";
import React, { useState } from "react";
import CreateForm from "../CreateForm/CreateForm";
import Project from "../Project/Project";

function ProjectList() {
  const [displayCreateProjectForm, setDisplayCreateProjectForm] =
    useState(false);

  function handleDisplayCreateProjectForm() {
    setDisplayCreateProjectForm(!displayCreateProjectForm);
  }

  return (
    <div className="project-list">
      {displayCreateProjectForm && (
        <CreateForm displayForm={handleDisplayCreateProjectForm} />
      )}
      <div className="project-header">
        <h1>My Projects</h1>
        <button
          className="create-button"
          onClick={handleDisplayCreateProjectForm}
        >
          New Project
        </button>
      </div>
      <table className="projects-table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Status</th>
            <th>Manager</th>
            <th>Due date</th>
          </tr>
        </thead>

        <tbody></tbody>

        <Project />
      </table>
    </div>
  );
}

export default ProjectList;
