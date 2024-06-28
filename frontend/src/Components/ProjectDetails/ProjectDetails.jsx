import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./ProjectDetails.css";
import EditForm from "../EditForm/EditForm";

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState([]);
  const [displayEditForm, setDisplayEditForm] = useState(false);
  const navigate = useNavigate();

  function handleEditClick() {
    setDisplayEditForm(!displayEditForm);
  }
  async function fetchProject() {
    try {
      const resonse = await fetch(`http://localhost:3000/projects/${id}`);
      const data = await resonse.json();
      setProject(data);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  }

  async function handleDeleteProject() {
    try {
      const response = await fetch(`http://localhost:3000/projects/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        navigate("/projects");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProject();
  }, [id]);

  function handleDisplayProjectsList() {
    navigate("/projects");
  }

  if (!project) return <div>Loading...</div>;

  return (
    <div className="project-details-container">
      <div className="project-details-header">
        <i
          className="fa-solid fa-arrow-left"
          onClick={handleDisplayProjectsList}
        ></i>
        <div className="delete-edit-icon">
          <i className="fa-solid fa-pen" onClick={handleEditClick}></i>
          <i className="fa-solid fa-trash" onClick={handleDeleteProject}></i>
        </div>
      </div>
      <div className="project-details">
        <h1>{project.title}</h1>
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
            {/* <tbody>
              {project.tasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.name}</td>
                  <td>{task.assignedTo}</td>
                  <td>{task.status}</td>
                  <td>{task.dueDate}</td>
                </tr>
              ))}
            </tbody> */}
          </table>
        </div>
      </div>
      <div className={`edit-form-container ${displayEditForm && "visible"}`}>
        <EditForm
          project={project}
          displayEditForm={handleEditClick}
          refreshProject={fetchProject}
        />
      </div>
    </div>
  );
}

export default ProjectDetails;
