import { useNavigate, Link } from "react-router-dom";
import "./ProjectCard.css";
import { useState } from "react";

function ProjectCard({ project, deleteProject, projectId }) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  function handleDisplayProjectDetails() {
    setShowDetails(!showDetails);
  }

  console.log(project);
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
          <strong>Description:</strong> {project.description}
        </p>
        <p>
          <strong>Manager:</strong>{" "}
          {project.manager ? project.manager.name : "N/A"}
        </p>
        <p>
          <strong>Status:</strong> {project.status}
        </p>
        <p>
          <strong>Priority:</strong> {project.priority}
        </p>
        <p>
          <strong>Due Date:</strong> {project.due_date}
        </p>
      </div>
    </div>
  );
}

export default ProjectCard;
