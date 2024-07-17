import { useParams } from "react-router-dom";
import ComplexBarChart from "./ComplexBarChart";
import MultiLineChart from "./MultiLineChart";
import { useState, useEffect } from "react";

function ProjectChart() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [progress, seProgress] = useState(0);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(`http://localhost:3000/projects/${id}`);
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
      <h3>Project Progress Chart</h3>
      {tasks.length > 0 ? (
        <>
          <ComplexBarChart tasks={tasks} width={600} height={400} />
          <MultiLineChart tasks={tasks} width={600} height={400} />
        </>
      ) : (
        <p>Loading tasks...</p>
      )}
      <button>Generate Report</button>
    </div>
  );
}

export default ProjectChart;
