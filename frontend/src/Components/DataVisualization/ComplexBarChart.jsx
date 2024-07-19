import React, { useEffect, useRef, useState } from "react";
import "./Chart.css";

function ComplexBarChart({ tasks, width, height }) {
  const canvasRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const data = {
    labels: ["Not Started", "In Progress", "Completed"],
    datasets: [
      {
        label: "Task Status Overview",
        data: [
          tasks.filter((task) => task.status === "NOT_STARTED").length,
          tasks.filter((task) => task.status === "IN_PROGRESS").length,
          tasks.filter((task) => task.status === "COMPLETED").length,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawChart = () => {
      ctx.clearRect(0, 0, width, height);
      const dataset = data.datasets[0];
      const barWidth = width / dataset.data.length;

      dataset.data.forEach((value, index) => {
        const barHeight = (value / Math.max(...dataset.data)) * height;
        const barX = index * barWidth;
        const barY = height - barHeight;

        ctx.fillStyle = dataset.backgroundColor[index];
        ctx.fillRect(barX, barY, barWidth, barHeight);
        ctx.strokeStyle = dataset.borderColor[index];
        ctx.strokeRect(barX, barY, barWidth, barHeight);
      });
    };

    drawChart();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let closest = { distance: Infinity, data: null };

      const barWidth = width / data.datasets[0].data.length;
      data.datasets[0].data.forEach((value, index) => {
        const barHeight = (value / Math.max(...data.datasets[0].data)) * height;
        const barX = index * barWidth;
        const barY = height - barHeight;

        if (x >= barX && x <= barX + barWidth && y >= barY && y <= height) {
          const distance = Math.sqrt(
            (barX + barWidth / 2 - x) ** 2 + (barY + barHeight / 2 - y) ** 2
          );
          if (distance < closest.distance) {
            closest = {
              distance,
              data: { x: barX + barWidth / 2, y: barY + barHeight / 2, value },
            };
          }
        }
      });

      if (closest.distance < 10) {
        setTooltip({
          x: closest.data.x,
          y: closest.data.y,
          value: closest.data.value,
        });
      } else {
        setTooltip(null);
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [data, width, height]);

  return (
    <>
      <canvas ref={canvasRef} width={width} height={height}></canvas>
      {tooltip && (
        <div
          className="tooltip"
          style={{
            left: tooltip.x + "px",
            top: tooltip.y - 30 + "px",
          }}
        >
          {tooltip.value}
        </div>
      )}
    </>
  );
}

export default ComplexBarChart;
