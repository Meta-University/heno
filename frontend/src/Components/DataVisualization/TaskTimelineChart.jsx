import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useParams } from "react-router-dom";

function TaskTimelineChart() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);

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

  function formatText(text) {
    return text
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const data = [
    [
      { type: "string", id: "Task" },
      { type: "string", id: "Status" },
      { type: "date", id: "Start Date" },
      { type: "date", id: "End Date" },
    ],
    ...tasks.map((task) => [
      task.title,
      formatText(task.status),
      new Date(task.start_date),
      new Date(task.due_date),
    ]),
  ];

  const options = {
    timeline: {
      showRowLabels: true,
      showBarLabels: false,
      colorByRowLabel: true,
    },
    title: "Task Timeline",
    explorer: {
      actions: ["dragToZoom", "rightClickToReset"],
      axis: "horizontal",
      keepInBounds: true,
      maxZoomIn: 0.01,
    },
    isStacked: true,
    height: 600,
    chartArea: {
      height: 300,
      top: 100,
    },
    hAxis: {
      title: "Time",
      format: "MM/dd/yyyy",
      direction: -1,
      gridlines: { count: 10 },
      slantedText: true,
      slantedTextAngle: 90,
    },
    vAxis: {
      title: "Tasks",
      textPosition: "out",
    },
  };

  return (
    <div className="task-timeline-chart-container">
      <h3>Project Task Timeline</h3>
      <Chart
        chartType="Timeline"
        width="80%"
        height="400px"
        data={data}
        options={options}
      />
    </div>
  );
}

export default TaskTimelineChart;
