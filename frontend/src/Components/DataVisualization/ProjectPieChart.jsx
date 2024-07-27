import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useParams } from "react-router-dom";

function ProjectPieChart() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [taskStatusCounts, setTaskStatusCounts] = useState({
    TODO: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
  });

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
        calculateTaskStatusCounts(data.project.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }

    fetchTasks();
  }, [id]);

  function calculateTaskStatusCounts(tasks) {
    const statusCounts = tasks.reduce(
      (acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      },
      { TODO: 0, IN_PROGRESS: 0, COMPLETED: 0 }
    );
    setTaskStatusCounts(statusCounts);
  }

  const data = [
    ["Task Status", "Count"],
    ["Not Started", taskStatusCounts.TODO],
    ["In Progress", taskStatusCounts.IN_PROGRESS],
    ["Completed", taskStatusCounts.COMPLETED],
  ];

  const options = {
    title: "Task Status Overview",
    pieHole: 0.4,
  };

  return (
    <div className="project-pie-chart-container">
      <h3>Project Task Status</h3>
      <Chart
        chartType="PieChart"
        width="80%"
        height="400px"
        data={data}
        options={options}
      />
    </div>
  );
}

export default ProjectPieChart;
