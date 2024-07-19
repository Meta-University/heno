import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./TaskCalendar.css";

const localizer = momentLocalizer(moment);

function TaskCalendar() {
  const [tasks, setTasks] = useState([]);

  async function fetchTasks() {
    try {
      const response = await fetch("http://localhost:3000/tasks", {
        credentials: "include",
      });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  const events = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    start: new Date(task.start_date),
    end: new Date(task.due_date),
    status: task.status,
  }));

  function eventStyleGetter(event) {
    let backgroundColor = "";
    switch (event.status) {
      case "COMPLETED":
        backgroundColor = "green";
        break;
      case "IN_PROGRESS":
        backgroundColor = "blue";
        break;
      case "TODO":
        backgroundColor = "red";
        break;
      default:
        backgroundColor = "gray";
    }
    return {
      style: {
        backgroundColor,
      },
    };
  }

  return (
    <div className="full-calendar">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100vh" }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
}

export default TaskCalendar;
