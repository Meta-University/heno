import { useState } from "react";
import "./Recommendation.css";
import RecommendedTaskForm from "../RecommendedTaskForm/RecommendedTaskForm";
import RecommendationTable from "../RecommendationTable/RecommendationTable";
import { useNavigate } from "react-router-dom";

function Recommendation(props) {
  const [displayForm, setDisplayForm] = useState(false);
  const [recommendedTasks, setRecommendedTasks] = useState([]);
  const [projectInfo, setProjectInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(
    e,
    title,
    description,
    endGoals,
    startDate,
    endDate,
    teamMembers
  ) {
    e.preventDefault();

    setIsLoading(true);
    navigate("/loading");

    try {
      const response = await fetch("http://localhost:3000/ai-recommend-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          endGoals,
          startDate,
          endDate,
          teamMembers,
        }),
      });
      setDisplayForm(false);

      if (!response.ok) {
        throw new Error("Failed to get recommended tasks");
      }

      const data = await response.json();
      setProjectInfo({
        title,
        description,
        endGoals,
        startDate,
        endDate,
        teamMembers,
      });
      setRecommendedTasks(data.tasks);
      props.recommendationInfo(
        {
          title,
          description,
          endGoals,
          startDate,
          endDate,
          teamMembers,
        },
        data.tasks,
        isLoading
      );
      navigate("/ai-recommend-tasks");

      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function displayRecommendProjectForm() {
    setDisplayForm(!displayForm);
  }

  return (
    <div className="recommendation-container">
      {displayForm && (
        <RecommendedTaskForm
          displayForm={displayRecommendProjectForm}
          handleRecommendation={handleSubmit}
        />
      )}

      <div>
        <h3>Welcome to AI help me recommend</h3>
        <p>
          Recommend tasks according to your project description, end goal, start
          ad due date, and help assign to team members provided by you.
        </p>
      </div>
      <button
        className="recommendation-btn"
        onClick={displayRecommendProjectForm}
      >
        Click to Start
      </button>

      {/* {isLoading && <p>Loading...</p>}

      {!isLoading && recommendedTasks.length > 0 ? (
        <RecommendationTable
          isLoading={isLoading}
          projectInfo={projectInfo}
          tasks={recommendedTasks}
        />
      ) : (

      )} */}
    </div>
  );
}

export default Recommendation;
