import { useNavigate, Link } from "react-router-dom";
import "./ProjectCard.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { createClient } from "pexels";

function ProjectCard({ project, deleteProject, projectId }) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  async function fetchImages() {
    try {
      const response = await axios.get("http://localhost:3000/api/images", {
        params: {
          query: "sky",
        },
      });
      console.log(response);
      setImageUrl(response.photos[0]?.src?.original || "");
    } catch (error) {
      console.error("Error fetching image: ", error);
    }
  }

  useEffect(() => {
    fetchImages();
  }, []);

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
        {imageUrl && <img src={imageUrl} />}
        <h3>{project.title}</h3>
        {/* <Link to={`/projects/${projectId}`} className="details-button">
          View Details
        </Link> */}
      </div>

      {/* <div className="project-det">
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
        </p> */}
      {/* </div> */}
    </div>
  );
}

export default ProjectCard;
