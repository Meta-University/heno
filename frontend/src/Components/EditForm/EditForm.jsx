import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditForm.css";
import { IoMdClose } from "react-icons/io";

function EditForm(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [due_date, setDueDate] = useState("");
  const [start_date, setStartDate] = useState("");
  const [priority, setPriority] = useState("");

  async function fetchProject() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/projects/${id}`
      );
      if (response.ok) {
        const project = await response.json();
        setProject(project);
        setTitle(project.title);
        setDescription(project.description);
        setStatus(project.status);
        setDueDate(project.due_date);
        setStartDate(project.start_date);
        setPriority(project.priority);
      } else {
        console.error("Failed to fetch project");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProject();
  }, []);

  async function handleUpdate(event) {
    event.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/projects/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            status,
            start_date,
            due_date,
            priority,
          }),
          credentials: "include",
        }
      );

      if (response.ok) {
        const updatedProject = await response.json();
        console.log("Project updated: ", updatedProject);
        props.refreshProject();
        navigate(`/projects/${id}`);
      } else {
        console.error("Failed to update project");
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (!project) return <div>Loading....</div>;

  return (
    <div className="edit-project-form">
      <div>
        <div onClick={props.displayEditForm}>
          <IoMdClose />
        </div>

        <h1>Edit Project</h1>
      </div>

      <form
        onSubmit={(e) => {
          handleUpdate(e);
          props.displayEditForm();
        }}
      >
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <input
          type="date"
          placeholder="Project Start Date"
          value={start_date}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Project Due Date"
          value={due_date}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="">Set Status</option>
          <option value="NOT_STARTED">Not Started</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="ON_HOLD">On Hold</option>
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          required
        >
          <option value="">Set Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        <button type="submit" className="update">
          Update Project
        </button>
      </form>
    </div>
  );
}

export default EditForm;
