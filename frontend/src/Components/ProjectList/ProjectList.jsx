import "./ProjectList.css";
import React, { useState, useEffect } from "react";
import CreateForm from "../CreateForm/CreateForm";
import ProjectCard from "../ProjectCard/ProjectCard";

function ProjectList(props) {
  const [displayCreateProjectForm, setDisplayCreateProjectForm] =
    useState(false);
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState();

  function handleSetProjectId(id) {
    setProjectId(id);
  }

  function handleDisplayCreateProjectForm() {
    setDisplayCreateProjectForm(!displayCreateProjectForm);
  }

  async function receiveProjectList() {
    try {
      const response = await fetch("http://localhost:3000/projects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    receiveProjectList();
  }, []);

  return (
    <div className="project-list">
      <div className="project-header">
        <h1>My Projects</h1>
        <button
          className="create-project-button"
          onClick={handleDisplayCreateProjectForm}
        >
          New Project
        </button>
      </div>
      {displayCreateProjectForm && (
        <CreateForm
          displayForm={handleDisplayCreateProjectForm}
          refreshProjects={receiveProjectList}
        />
      )}
      {projects.map((project, index) => (
        <ProjectCard
          key={index}
          refreshProjects={receiveProjectList}
          project={project}
          projectId={project.id}
        />
      ))}
    </div>
  );
}

export default ProjectList;
