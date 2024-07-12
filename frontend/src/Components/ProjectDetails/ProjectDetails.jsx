import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./ProjectDetails.css";
import EditForm from "../EditForm/EditForm";
import CreateTaskForm from "../CreateTaskForm/CreateTaskForm";
import { capitalizeFirstLetters } from "../../capitalizeFirstLetters";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";

function ProjectDetails(props) {
  const { id } = useParams();
  const [project, setProject] = useState([]);
  const [displayEditForm, setDisplayEditForm] = useState(false);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchProject() {
    try {
      const response = await fetch(`http://localhost:3000/projects/${id}`);
      const data = await response.json();
      setProject(data);
      setCurrentSchedule(data);
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

  function formatText(text) {
    return text
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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

  function getStatusClass(status) {
    if (status == "NOT_STARTED") {
      return "not-started";
    } else if (status === "TODO") {
      return "todo";
    } else if (status === "IN_PROGRESS") {
      return "in-progress";
    } else if (status === "COMPLETED") {
      return "completed";
    } else if (status === "ON_HOLD") {
      return "on-hold";
    }
  }

  function getPriorityClass(priority) {
    if (priority === "LOW") {
      return "low";
    } else if (priority === "MEDIUM") {
      return "medium";
    } else if (priority === "HIGH") {
      return "high";
    }
  }

  async function reorganiseButtonClick() {
    try {
      navigate(`/projects/${id}/diff`);
    } catch (error) {
      console.error("Error reorganising schedule: ", error);
    } finally {
      setLoading(false);
    }
  }

  if (!project) return <SkeletonLoader />;

  if (loading) return <SkeletonLoader />;

  return (
    <div className="project-details-container ">
      <div className="project-details-header">
        <div className="overview">
          <i className="fa-solid fa-list"></i>
          <h3>Project Overview</h3>
        </div>
        <div className="delete-edit-icon">
          <i className="fa-solid fa-pen" onClick={handleEditClick}></i>
          <i className="fa-solid fa-trash" onClick={handleDeleteProject}></i>
        </div>
      </div>

      <div className="project-details">
        <div className="detail-row">
          <div className="detail">
            <p className="project-key">Project</p>
            <p className="project-value">
              {project.title && capitalizeFirstLetters(project.title)}
            </p>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail">
            <p className="project-key">Start Date</p>
            <p className="project-value">
              {new Date(project.start_date).toLocaleDateString()}
            </p>
          </div>
          <div className="detail">
            <p className="project-key">Due date</p>
            <p className="project-value">
              {new Date(project.due_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail">
            <p className="project-key">Priority</p>
            <p
              className={`project-value ${getPriorityClass(project.priority)}`}
            >
              {project.priority && formatText(project.priority)}
            </p>
          </div>
          <div className="detail">
            <p className="project-key">Status</p>
            <p className={`project-value ${getStatusClass(project.status)}`}>
              {project.status && formatText(project.status)}
            </p>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail">
            <p className="project-key">Manager</p>
            <p className="project-value">
              {project.manager
                ? capitalizeFirstLetters(project.manager.name)
                : "N/A"}
            </p>
          </div>
          <div className="detail">
            <p className="project-key">Team</p>
            <p className="project-value">
              {project.teamMembers && project.teamMembers.length > 0
                ? project.teamMembers.map((member) => member.name).join(", ")
                : "No team members"}
            </p>
          </div>
        </div>
        <div className="detail-row">
          <div className="detail">
            <p className="project-key">Description</p>
            <p className="project-value">{project.description}</p>
          </div>
        </div>
        <button className="reorganise-btn" onClick={reorganiseButtonClick}>
          AI please help me reorganise
        </button>

        <div className="tasks">
          <button className="add-task-btn" onClick={toogleTaskForm}>
            Add Task
          </button>

          {showTaskForm && (
            <CreateTaskForm
              addTask={addTask}
              teamMembers={project.teamMembers}
              projectId={project.id}
              displayForm={toogleTaskForm}
            />
          )}

          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Assignee</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={index}>
                  <td>
                    <Link to={`/tasks/${task.id}`}>
                      {capitalizeFirstLetters(task.title)}
                    </Link>
                  </td>
                  <td>{task.assignee ? task.assignee.name : "Unassigned"}</td>
                  <td className={`${getStatusClass(task.status)}`}>
                    {formatText(task.status)}
                  </td>
                  <td>{new Date(task.due_date).toDateString()}</td>
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
