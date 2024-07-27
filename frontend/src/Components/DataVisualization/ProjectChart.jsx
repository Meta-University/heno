import { useParams } from "react-router-dom";
import ComplexBarChart from "./ComplexBarChart";
import MultiLineChart from "./MultiLineChart";
import { useState, useEffect } from "react";
import ProjectPieChart from "./ProjectPieChart";
import TaskTimelineChart from "./TaskTimelineChart";
import TeamTasksHistogram from "./TeamTaskHistogram";

function ProjectChart() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [progress, seProgress] = useState(0);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/projects/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();

        setTasks(data.project.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }

    fetchTasks();
  }, [id]);

  return (
    <div className="project-chart-container">
      {tasks.length > 0 ? (
        <>
          <ProjectPieChart />
          <TaskTimelineChart />
          <TeamTasksHistogram />
        </>
      ) : (
        <p>Loading tasks...</p>
      )}
      <button>Generate Report</button>
    </div>
  );
}

export default ProjectChart;
