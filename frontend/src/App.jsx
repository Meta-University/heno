import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";
import ProjectList from "./Components/ProjectList/ProjectList";
import { UserContext } from "./UserContext";
import HomePage from "./Components/HomePage/HomePage";
import TaskList from "./Components/TaskList/TaskList";
import EditForm from "./Components/EditForm/EditForm";
import ProjectDetails from "./Components/ProjectDetails/ProjectDetails";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser === null ? null : JSON.parse(storedUser);
  });
  const [projectId, setProjectId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function handleSetProjects(projects) {
    setProjects(projects);
  }

  function toogleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  function handleSetProjectId(id) {
    setProjectId(id);
  }

  function updateUser(newUser) {
    setUser(newUser);
  }

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <div className="App">
      <UserContext.Provider value={{ user, updateUser }}>
        <Router>
          {user && (
            <Sidebar isOpen={isSidebarOpen} toogleSidebar={toogleSidebar} />
          )}
          <div
            className={`main-content ${
              user ? (isSidebarOpen ? "with-sidebar" : "without-sidebar") : ""
            }`}
          >
            <Routes>
              <Route path="/" element={user ? <HomePage /> : <Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/home" element={user && <HomePage />} />

              <Route
                path="/projects"
                element={
                  user ? (
                    <ProjectList
                      handleSetProjectId={handleSetProjectId}
                      projectId={projectId}
                      handleSetProjects={handleSetProjects}
                      projects={projects}
                    />
                  ) : (
                    <Login />
                  )
                }
              />

              <Route path="/tasks" element={user ? <TaskList /> : <Login />} />
              <Route
                path="/projects/:id"
                element={user ? <ProjectDetails /> : <Login />}
              />
            </Routes>
          </div>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
