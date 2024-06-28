import { useNavigate, Link } from "react-router-dom";
import "./ProjectCard.css";
import { useState } from "react";

function ProjectCard({ project, deleteProject, projectId }) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  function handleDisplayProjectDetails() {
    setShowDetails(!showDetails);
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
          <strong>Description:</strong> {project.description}
        </p>
        <p>
          <strong>Manager:</strong> {project.manager}
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

      {/* {showDetails && (
        <div className="project-details">
          <div className="edit-icon" onClick={(e) => e.stopPropagation()}>
            <i className="fa-solid fa-pen"></i>
          </div>
          <p>
            <strong>Description:</strong> {project.description}
          </p>
          <p>
            <strong>Manager:</strong> {project.manager}
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
          <p>
            <strong>Team members:</strong> {[]}
          </p>
          <div className="tasks">
            <h4>Tasks</h4>
            <table>
              <thead>
                <tr>
                  <th>Task Name</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {project.tasks.map((task, index) => (
                  <tr key={index}>
                    <td>{task.name}</td>
                    <td>{task.assignedTo}</td>
                    <td>{task.status}</td>
                    <td>{task.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default ProjectCard;
