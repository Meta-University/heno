import { useNavigate, Link } from "react-router-dom";
import "./ProjectCard.css";
import { useState } from "react";

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

  return (
    <div
      className="project-card"
      onClick={() => {
        handleDisplayProjectDetails();
      }}
    >
      <div className="project-title-and-view-icon">
        <h3>{project.title}</h3>
        <Link to={`/projects/${projectId}`} className="details-button">
          View Details
        </Link>
      </div>

      <div className="project-det">
        <p>
          <strong>Manager:</strong>{" "}
          {project.manager ? project.manager.name : "N/A"}
        </p>
        <p>
          <strong>Status:</strong> {formatText(project.status)}
        </p>
        <p>
          <strong>Priority:</strong> {formatText(project.priority)}
        </p>
        <p>
          <strong>Due Date:</strong> {project.due_date}
        </p>
      </div>
    </div>
  );
}

export default ProjectCard;
