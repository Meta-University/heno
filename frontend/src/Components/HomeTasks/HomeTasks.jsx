import CreateTaskForm from "../CreateTaskForm/CreateTaskForm";
import TaskModal from "../TaskModal/TaskModal";
import "./HomeTasks.css";
import { useState, useEffect } from "react";
import CreateButton from "../CreateButton/CreateButton";
import { useNavigate } from "react-router-dom";
import { capitalizeFirstLetters } from "../../capitalizeFirstLetters";

function HomeTasks() {
  const [tasks, setTasks] = useState([]);
  const [displayTaskModal, setDisplayTaskModal] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [count, setCount] = useState(0);
  const [displayForm, setDisplayForm] = useState(false);
  const [taskId, setTaskId] = useState();
  const navigate = useNavigate();

  function handleDisplayForm() {
    setDisplayForm(!displayForm);
  }

  function handleAddCount() {
    setCount(count + 1);
  }

  function handleTabChange(tab) {
    setActiveTab(tab);
  }

  async function fetchTasks() {
    try {
      const response = await fetch("http://localhost:3000/tasks", {
        credentials: "include",
      });
      if (response.status === 401) {
        navigate("/login");
        return;
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  function formatText(text) {
    return text
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const today = new Date().toISOString().split("T")[0];

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "upcoming") {
      return task.due_date > today && task.status !== "COMPLETED";
    } else if (activeTab === "overdue") {
      return task.due_date < today && task.status !== "COMPLETED";
    } else if (activeTab === "completed") {
      return task.status === "COMPLETED";
    } else {
      return false;
    }
  });

  function toogleModal() {
    setDisplayTaskModal(!displayTaskModal);
  }

  function navigateToTaskDetail(id) {
    navigate(`/tasks/${id}`);
  }

  return (
    <div className="upcoming-tasks">
      <div className="task-create">
        <h3>My tasks</h3>
        <CreateButton buttonName="tasks" displayForm={handleDisplayForm} />
      </div>
      {displayForm && (
        <CreateTaskForm
          displayForm={handleDisplayForm}
          onTaskCreated={(newTask) => {
            setTasks([...tasks, newTask]);
          }}
        />
      )}
      <div className="tabs">
        <button
          onClick={() => handleTabChange("upcoming")}
          className={activeTab === "upcoming" ? "active" : ""}
        >
          Upcoming
        </button>
        <button
          onClick={() => handleTabChange("overdue")}
          className={activeTab === "overdue" ? "active" : ""}
        >
          Overdue
        </button>
        <button
          onClick={() => handleTabChange("completed")}
          className={activeTab === "completed" ? "active" : ""}
        >
          Completed
        </button>
      </div>

      <div key={count} className="home-tasks">
        {activeTab === "overdue"
          ? filteredTasks.length === 0 && (
              <p>You don't have any overdue tasks. Nice!</p>
            )
          : ""}

        {activeTab === "completed"
          ? filteredTasks.length === 0 && (
              <p>
                Your completed tasks will appear here so you can refeerence it
              </p>
            )
          : ""}

        {filteredTasks.map((task, index) => (
          <>
            <div
              key={index}
              className="task"
              onClick={() => navigateToTaskDetail(task.id)}
            >
              <div className="task-project-title">
                <i className="fa-regular fa-circle-check"></i>
                <p>
                  {capitalizeFirstLetters(task.title)};{" "}
                  {task.project && capitalizeFirstLetters(task.project.title)}
                </p>
              </div>

              <div className="status-due-date">
                <p>{new Date(task.due_date).toLocaleDateString()}</p>
              </div>
            </div>

            {displayTaskModal && (
              <TaskModal key={task.id} task={task} onClose={toogleModal} />
            )}
          </>
        ))}
      </div>
    </div>
  );
}

export default HomeTasks;
