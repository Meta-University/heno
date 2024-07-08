import { useNavigate, Link } from "react-router-dom";
import "./ProjectCard.css";
import { useState, useEffect } from "react";
import { capitalizeFirstLetters } from "../../capitalizeFirstLetters";

function ProjectCard({ project, deleteProject, projectId }) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  function handleDisplayProjectDetails() {
    setShowDetails(!showDetails);
  }

  function formatText(text) {
    return text
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function navigateToProjectDetails(id) {
    navigate(`/projects/${id}`);
  }

  return (
    <div
      className="project-card"
      onClick={() => {
        handleDisplayProjectDetails();
      }}
    >
      <div
        onClick={() => navigateToProjectDetails(project.id)}
        className="project-title-and-view-icon"
      >
        <p>{capitalizeFirstLetters(project.title)}</p>
      </div>
    </div>
  );
}

export default ProjectCard;
