import { useState } from "react";
import "./Recommendation.css";
import RecommendedTaskForm from "../RecommendedTaskForm/RecommendedTaskForm";
import RecommendationTable from "../RecommendationTable/RecommendationTable";

function Recommendation() {
  const [displayForm, setDisplayForm] = useState(false);
  const [recommendedTasks, setRecommendedTasks] = useState([]);
  const [projectInfo, setProjectInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

      setIsLoading(false);
      setDisplayForm(false);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function displayRecommendProjectForm() {
    setDisplayForm(!displayForm);
  }

  return (
    <div>
      {displayForm && (
        <RecommendedTaskForm
          displayForm={displayRecommendProjectForm}
          handleRecommendation={handleSubmit}
        />
      )}

      {isLoading && <p>Loading...</p>}

      {!isLoading && recommendedTasks.length > 0 ? (
        <RecommendationTable
          projectInfo={projectInfo}
          tasks={recommendedTasks}
        />
      ) : (
        <>
          <div>
            <h3>Welcome to AI help me recommend</h3>
            <p>
              Recommend tasks according to your project description, end goal,
              start ad due date, and help assign to team members provided by
              you.
            </p>
          </div>
          <button onClick={displayRecommendProjectForm}>Click to Start</button>
        </>
      )}
    </div>
  );
}

export default Recommendation;
