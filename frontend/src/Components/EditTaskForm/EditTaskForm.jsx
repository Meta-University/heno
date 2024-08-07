import "./EditTaskForm.css";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CustomAlert from "../CustomAlert/CustomAlert";
import io from "socket.io-client";
import { UserContext } from "../../UserContext";

const socket = io("http://localhost:3000");

function EditTaskForm(props) {
  const { id } = useParams();
  const [task, setTask] = useState();
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [displayAlert, setDisplayAlert] = useState(false);
  const [lockedFields, setLockedFields] = useState([]);
  const [notify, setNotify] = useState("");
  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function fetchTask() {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`);
      const data = await response.json();
      setTask(data);
      setIsLoading(false);
      if (data.project) {
        setTeamMembers(data.project.teamMembers);
      }
    } catch (error) {
      console.error("Error fetching task:", error);
      setError("Error fetching task");
    }
  }

  useEffect(() => {
    fetchTask();
    socket.emit("joinTask", id);
    socket.emit("joinUserRoom", user.id);

    socket.on("taskUpdateError", ({ taskId, error }) => {
      if (taskId === id) {
        setError(error);
      }
    });

    socket.on("lockReleased", ({ taskId, message }) => {
      if (taskId === id) {
        setLockedFields((prev) => prev.filter((f) => f !== field));
        setNotify(message);
        setDisplayAlert(true);
      }
    });

    return () => {
      socket.emit("leaveTask", id);
      socket.off("taskUpdateError");
    };
  }, [id, user.id]);

  function handleDisplayAlert() {
    setDisplayAlert(false);
  }

  async function handleEditTask(event) {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        props.displayEditForm();
        props.refreshTask();
      } else {
        setDisplayAlert(true);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Error updating task");
    }
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="task-edit-form-container">
      <div>
        <i className="fa-solid fa-xmark" onClick={props.displayEditForm}></i>
        <h1>Edit Task</h1>
      </div>

      {error && displayAlert && (
        <CustomAlert message={error} onClose={handleDisplayAlert} />
      )}

      {notify && displayAlert && (
        <CustomAlert message={notify} onClose={handleDisplayAlert} />
      )}

      <form onSubmit={handleEditTask}>
        <input
          type="text"
          placeholder="Task Title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Task Description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          required
        ></textarea>
        <input
          type="date"
          placeholder="Task Start Date"
          value={task.start_date.split("T")[0]}
          onChange={(e) => setTask({ ...task, start_date: e.target.value })}
          required
        />
        <input
          type="date"
          value={task.due_date.split("T")[0]}
          placeholder="Task Due Date"
          onChange={(e) => setTask({ ...task, due_date: e.target.value })}
          required
        />
        <select
          value={task.assignee_id}
          onChange={(e) => setTask({ ...task, assignee_id: e.target.value })}
          required
        >
          <option value="">Select team member</option>
          {teamMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>

        <select
          value={task.status}
          onChange={(e) => setTask({ ...task, status: e.target.value })}
          required
        >
          <option value="">Set Status</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <select
          value={task.priority}
          onChange={(e) => setTask({ ...task, priority: e.target.value })}
          required
        >
          <option value="">Set Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        <div className="buttons">
          <button type="submit" className="create">
            Edit Task
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTaskForm;
