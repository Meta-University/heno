import React, { useEffect, useRef } from "react";
import "./Chart.css";

function MultiLineChart({ tasks, width, height }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, width, height);

    const colors = ["red", "blue", "green"];
    const padding = 50;

    const startDates = tasks.map((task) => new Date(task.start_date).getTime());
    const endDates = tasks.map((task) => new Date(task.due_date).getTime());
    const minDate = Math.min(...startDates);
    const maxDate = Math.max(...endDates);

    tasks.forEach((task, index) => {
      const startX =
        padding +
        ((new Date(task.start_date).getTime() - minDate) /
          (maxDate - minDate)) *
          (width - 2 * padding);
      const endX =
        padding +
        ((new Date(task.due_date).getTime() - minDate) / (maxDate - minDate)) *
          (width - 2 * padding);
      const y = padding + (index * (height - 2 * padding)) / tasks.length;

      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.strokeStyle = colors[index % colors.length];
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = colors[index % colors.length];
      ctx.fillText(task.title, endX + 5, y + 5);
    });

    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#000";
    ctx.fillText("Tasks", padding - 30, padding - 10);
    ctx.fillText("Time", width - padding + 10, height - padding + 10);
  }, [tasks, width, height]);

  return <canvas ref={canvasRef} width={width} height={height}></canvas>;
}

export default MultiLineChart;
