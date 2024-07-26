import "./RecommendedTaskForm.css";
import { useState } from "react";
import AddTeamMembers from "../AddTeamMembers/AddTeamMembers";

function RecommendedTaskForm(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endGoals, setEndGoals] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [recommendedTasks, setRecommendedTasks] = useState([]);

  function handleTeamMemberAdded(member) {
    setTeamMembers([...teamMembers, member]);
  }

  async function handleSubmit(e) {
    e.preventDefault();

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
      setRecommendedTasks(data.recommendedTasks);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  return (
    <div className="modal-overlay">
      <div className="modal-content" id="recommendation-form-container">
        <div className="create-close-task">
          <h2>AI Recommend Tasks</h2>
          <i className="fa-solid fa-xmark" onClick={props.displayForm}></i>
        </div>

        <form
          id="recommendation-form"
          onSubmit={(e) => {
            props.handleRecommendation(
              e,
              title,
              description,
              endGoals,
              startDate,
              endDate,
              teamMembers
            );
          }}
        >
          <div className="form-group">
            <label>Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Project Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>End Goals</label>
            <textarea
              type="text"
              value={endGoals}
              onChange={(e) => setEndGoals(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Team Members</label>
            <AddTeamMembers onTeamMemberAdded={handleTeamMemberAdded} />
          </div>
          <button className="submit-button" type="submit">
            Get AI Recommended Tasks
          </button>
        </form>
      </div>
    </div>
  );
}

export default RecommendedTaskForm;
