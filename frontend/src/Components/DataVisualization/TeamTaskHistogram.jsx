import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useParams } from "react-router-dom";

const TeamTasksHistogram = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    async function fetchProjectData() {
      try {
        const response = await fetch(`http://localhost:3000/projects/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project data");
        }
        const data = await response.json();
        setTasks(data.project.tasks);

        setTeamMembers(data.project.teamMembers);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    }

    fetchProjectData();
  }, [id]);

  const taskCountByMember = teamMembers.map((member) => {
    const taskCount = tasks.filter(
      (task) => task.assignee_id === member.id
    ).length;
    return [member.name, taskCount];
  });

  const data = [["Team Member", "Number of Tasks"], ...taskCountByMember];

  const options = {
    title: "Number of Tasks Assigned to Team Members",
    legend: { position: "none" },
    hAxis: { title: "Team Member" },
    vAxis: { title: "Number of Tasks" },
    chartArea: { width: "70%", height: "70%" },
  };

  return (
    <div className="team-tasks-histogram-container">
      <h3>Team Tasks Histogram</h3>
      <Chart
        chartType="ColumnChart"
        width="80%"
        height="400px"
        data={data}
        options={options}
      />
    </div>
  );
};

export default TeamTasksHistogram;
