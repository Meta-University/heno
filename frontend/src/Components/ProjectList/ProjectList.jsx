import "./ProjectList.css";
import React, { useState, useEffect } from "react";
import CreateForm from "../CreateForm/CreateForm";
import ProjectCard from "../ProjectCard/ProjectCard";
import CreateProjectButton from "../CreateProjectButton/CreateProjectButton";

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
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/projects`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
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
        <CreateProjectButton displayForm={handleDisplayCreateProjectForm} />
      </div>
      {displayCreateProjectForm && (
        <CreateForm
          displayForm={handleDisplayCreateProjectForm}
          refreshProjects={receiveProjectList}
          displayCreateProjectForm={displayCreateProjectForm}
        />
      )}
      <div className="project-cards">
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            refreshProjects={receiveProjectList}
            project={project}
            projectId={project.id}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectList;
