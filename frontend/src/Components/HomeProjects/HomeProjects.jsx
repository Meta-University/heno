import "./HomeProjects.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateProjectButton from "../CreateProjectButton/CreateProjectButton";
import CreateForm from "../CreateForm/CreateForm";
import { capitalizeFirstLetters } from "../../capitalizeFirstLetters";

function HomeProjects() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [displayForm, setDisplayForm] = useState(false);

  function handleDisplayForm() {
    setDisplayForm(!displayForm);
  }

  async function receiveProjectList() {
    try {
      const response = await fetch("http://localhost:3000/projects", {
        method: "GET",
        credentials: "include",
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

  function handleNavigateToProjectDetail(id) {
    navigate(`/projects/${id}`);
  }

  return (
    <div className="projects">
      <div className="project-create">
        <h3>Projects</h3>
        <CreateProjectButton displayForm={handleDisplayForm} />
      </div>
      {displayForm && (
        <CreateForm
          refreshProjects={receiveProjectList}
          displayForm={handleDisplayForm}
        />
      )}
      <div className="home-projects">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="project"
            onClick={() => handleNavigateToProjectDetail(project.id)}
          >
            <i className="fa-solid fa-list"></i>
            <p>{capitalizeFirstLetters(project.title)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomeProjects;
