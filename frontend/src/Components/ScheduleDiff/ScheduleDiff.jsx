import "./ScheduleDiff.css";
import { useParams, useNavigate } from "react-router-dom";
import { capitalizeFirstLetters } from "../../capitalizeFirstLetters";

function ScheduleDiff({ currentSchedule, aiSuggestedSchedule }) {
  const navigate = useNavigate();
  const { id } = useParams();

  function formatText(text) {
    return text
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function getDifferences(current, suggested) {
    return current.tasks.map((task, index) => {
      console.log(current.tasks);
      console.log(suggested);
      const suggestedTask = suggested[index];
      return {
        ...task,
        differences: {
          title: task.title !== suggestedTask.title,
          description: task.description !== suggestedTask.description,
          status: task.status !== suggestedTask.status,
          start_date: task.start_date !== suggestedTask.start_date,
          due_date: task.due_date !== suggestedTask.due_date,
          assignee: task.assignee_id !== suggestedTask.assignee_id,
        },
      };
    });
  }

  function handleRollBack() {
    navigate(`/projects/${id}`);
  }

  function handleUpdateProjectDetails() {}

  const differences = getDifferences(
    currentSchedule,
    aiSuggestedSchedule.tasks
  );

  return (
    <div className="schedule-diff">
      <h3>Schedule Comparison</h3>
      <div className="diff-tables">
        <div className="diff-table">
          <h4>Current Schedule</h4>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>Due Date</th>
                <th>Assignee</th>
              </tr>
            </thead>
            <tbody>
              {currentSchedule.tasks.map((task, index) => (
                <tr key={task.id} className="diff-row">
                  <td
                    className={`diff-item ${
                      differences[index].differences.title ? "diff" : ""
                    }`}
                  >
                    {capitalizeFirstLetters(task.title)}
                  </td>
                  <td
                    className={`diff-item ${
                      differences[index].differences.description ? "diff" : ""
                    }`}
                  >
                    {task.description}
                  </td>
                  <td
                    className={`diff-item ${
                      differences[index].differences.status ? "diff" : ""
                    }`}
                  >
                    {formatText(task.status)}
                  </td>
                  <td
                    className={`diff-item ${
                      differences[index].differences.start_date ? "diff" : ""
                    }`}
                  >
                    {new Date(task.start_date).toLocaleDateString()}
                  </td>
                  <td
                    className={`diff-item ${
                      differences[index].differences.due_date ? "diff" : ""
                    }`}
                  >
                    {new Date(task.due_date).toLocaleDateString()}
                  </td>
                  <td
                    className={`diff-item ${
                      differences[index].differences.assignee ? "diff" : ""
                    }`}
                  >
                    {task.assignee.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="diff-table">
          <h4>AI Suggested Schedule</h4>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>Due Date</th>
                <th>Assignee</th>
              </tr>
            </thead>
            <tbody>
              {aiSuggestedSchedule.tasks.map((task, index) => (
                <tr key={task.id} className="diff-row">
                  <td
                    className={`diff-item ${
                      differences[index].differences.title
                        ? "suggested-diff"
                        : ""
                    }`}
                  >
                    {capitalizeFirstLetters(task.title)}
                  </td>
                  <td
                    className={`diff-item ${
                      differences[index].differences.description
                        ? "suggested-diff"
                        : ""
                    }`}
                  >
                    {task.description}
                  </td>
                  <td
                    className={`diff-item ${
                      differences[index].differences.status
                        ? "suggested-diff"
                        : ""
                    }`}
                  >
                    {formatText(task.status)}
                  </td>
                  <td
                    className={`diff-item ${
                      differences[index].differences.start_date
                        ? "suggested-diff"
                        : ""
                    }`}
                  >
                    {new Date(task.start_date).toLocaleDateString()}
                  </td>
                  <td
                    className={`diff-item ${
                      differences[index].differences.due_date
                        ? "suggested-diff"
                        : ""
                    }`}
                  >
                    {new Date(task.due_date).toLocaleDateString()}
                  </td>
                  <td
                    className={`diff-item ${
                      differences[index].differences.assignee
                        ? "suggested-diff"
                        : ""
                    }`}
                  >
                    {task.assignee.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="ok-rollback-btn">
        <button className="ok-btn" onClick={handleUpdateProjectDetails}>
          Ok
        </button>
        <button className="rollback-btn" onClick={handleRollBack}>
          Rollback
        </button>
      </div>
    </div>
  );
}

export default ScheduleDiff;
