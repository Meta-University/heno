import "./ProjectInfoPage.css";
import ProjectDetails from "../ProjectDetails/ProjectDetails";
import ProjectChart from "../DataVisualization/ProjectChart";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProjectInfoPage({ handleSetScheduleDetails }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [displayEditForm, setDisplayEditForm] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

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

  return (
    <div className="project-details-container ">
      <div className="project-details-header">
        <div className="title-icons">
          <div className="overview">
            <i className="fa-solid fa-list"></i>
            <h3>Project Overview</h3>
          </div>
          <div className="delete-edit-icon">
            <i className="fa-solid fa-pen" onClick={handleEditClick}></i>
            <i className="fa-solid fa-trash" onClick={handleDeleteProject}></i>
          </div>
        </div>

        <div className="tabs">
          <button
            className={activeTab === "info" ? "active" : ""}
            onClick={() => handleTabClick("info")}
          >
            Info
          </button>
          <button
            className={activeTab === "visualization" ? "active" : ""}
            onClick={() => handleTabClick("visualization")}
          >
            Data Visualization
          </button>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === "info" ? (
          <ProjectDetails
            handleSetScheduleDetails={handleSetScheduleDetails}
            edit={displayEditForm}
            editClick={handleEditClick}
          />
        ) : (
          <ProjectChart />
        )}
      </div>
    </div>
  );
}

export default ProjectInfoPage;
