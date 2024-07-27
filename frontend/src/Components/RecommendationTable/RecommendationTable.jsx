import React, { useContext } from "react";
import "./RecommendationTable.css";
import { capitalizeFirstLetters } from "../../capitalizeFirstLetters";
import { UserContext } from "../../UserContext";
import { useNavigate } from "react-router-dom";

function RecommendationTable({ projectInfo, tasks, loading }) {
  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function handleApprove() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/store-project`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...projectInfo, tasks, user }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to store project");
      }

      const data = await response.json();

      navigate("/ai-recommendation");
    } catch (error) {
      console.error("Error storing project:", error);
    }
  }

  async function handleDisapprove() {
    navigate("/ai-recommendation");
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

  function formatText(text) {
    return text
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="recommendation-table-container">
        <div className="project-details-header">
          <div className="overview">
            <i className="fa-solid fa-list"></i>
            <h3>AI Recommended Tasks</h3>
          </div>
        </div>
        <div className="project-details">
          <div className="detail-row">
            <div className="detail">
              <p className="project-key">Project</p>
              <p className="project-value">
                {projectInfo.title && capitalizeFirstLetters(projectInfo.title)}
              </p>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail">
              <p className="project-key">Start Date</p>
              <p className="project-value">
                {new Date(projectInfo.startDate).toLocaleDateString()}
              </p>
            </div>
            <div className="detail">
              <p className="project-key">Due date</p>
              <p className="project-value">
                {new Date(projectInfo.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail">
              <p className="project-key">Priority</p>
              <p className={`project-value ${getPriorityClass("MEDIUM")}`}>
                {formatText("MEDIUM")}
              </p>
            </div>
            <div className="detail">
              <p className="project-key">Status</p>
              <p className={`project-value ${getStatusClass("NOT_STARTED")}`}>
                {formatText("NOT_STARTED")}
              </p>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail">
              <p className="project-key">Manager</p>
              <p className="project-value">
                {capitalizeFirstLetters(user.name)}
              </p>
            </div>
            <div className="detail">
              <p className="project-key">Team</p>
              <p className="project-value">
                {projectInfo.teamMembers && projectInfo.teamMembers.length > 0
                  ? projectInfo.teamMembers
                      .map((member) => member.name)
                      .join(", ")
                  : "No team members"}
              </p>
            </div>
          </div>
          <div className="detail-row">
            <div className="detail">
              <p className="project-key">Description</p>
              <p className="project-value">{projectInfo.description}</p>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Assignee</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr key={index}>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{task.status}</td>
                    <td>{new Date(task.startDate).toLocaleDateString()}</td>
                    <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                    <td>{task.assignment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="buttons">
            <button className="approve-button" onClick={handleApprove}>
              Approve
            </button>
            <button className="disapprove-button" onClick={handleDisapprove}>
              Disapprove
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecommendationTable;
