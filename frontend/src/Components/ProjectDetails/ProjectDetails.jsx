import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./ProjectDetails.css";
import EditForm from "../EditForm/EditForm";
import TaskList from "../TaskList/TaskList";
import CreateTaskForm from "../CreateTaskForm/CreateTaskForm";

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState([]);
  const [displayEditForm, setDisplayEditForm] = useState(false);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);

  async function fetchProject() {
    try {
      const resonse = await fetch(`http://localhost:3000/projects/${id}`);
      const data = await resonse.json();
      setProject(data);
      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  }

  useEffect(() => {
    fetchProject();
  }, [id]);

  function addTask(task) {
    setTasks([...tasks, task]);
  }

  function toogleTaskForm() {
    setShowTaskForm(!showTaskForm);
  }

  function handleEditClick() {
    setDisplayEditForm(!displayEditForm);
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
        <p>
          <strong>Team members:</strong>
          {project.teamMembers && project.teamMembers.length > 0
            ? project.teamMembers.map((member) => member.name).join(", ")
            : "No team members"}
        </p>

        <div className="tasks">
          <div
            className={`create-task-card ${showTaskForm ? "expanded" : ""}`}
            onClick={toogleTaskForm}
          >
            <div className="card-header">
              {showTaskForm ? "Cancel" : "Create Task"}
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              {showTaskForm && (
                <CreateTaskForm
                  addTask={addTask}
                  teamMembers={project.teamMembers}
                  projectId={project.id}
                />
              )}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.title}</td>
                  <td>{task.assignee ? task.assignee.name : "Unassigned"}</td>
                  <td>{task.status}</td>
                  <td>{task.due_date}</td>
                </tr>
              ))}
            </tbody>
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
