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
import TaskDetails from "./Components/TaskDetails/TaskDetails";
import EditTaskForm from "./Components/EditTaskForm/EditTaskForm";
import ScheduleDiff from "./Components/ScheduleDiff/ScheduleDiff";
import Notifications from "./Components/Notifications/Notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Recommendation from "./Components/Recommendation/Recommendation";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser === null ? null : JSON.parse(storedUser);
  });
  const [projectId, setProjectId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState([]);
  const [aiSuggestedSchedyle, setAiSuggestedSchedule] = useState([]);
  const [changesMade, setChangesMade] = useState([]);

  function handleSetScheduleDetails(current, aiSuggested, changes) {
    setCurrentSchedule(current);
    setAiSuggestedSchedule(aiSuggested);
    setChangesMade(changes);
    console.log(currentSchedule);
  }

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
            <Navbar isOpen={isSidebarOpen} toogleSidebar={toogleSidebar} />
          )}
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
                      isSidebarOpen={isSidebarOpen}
                      handleSetProjects={handleSetProjects}
                      projects={projects}
                    />
                  ) : (
                    <Login />
                  )
                }
              />
              <Route
                path="/projects/:id"
                element={
                  user ? (
                    <ProjectDetails
                      handleSetScheduleDetails={handleSetScheduleDetails}
                    />
                  ) : (
                    <Login />
                  )
                }
              />
              <Route
                path="/projects/:id/diff"
                element={
                  user ? (
                    <ScheduleDiff
                      currentSchedule={currentSchedule}
                      aiSuggestedSchedule={aiSuggestedSchedyle}
                      changes={changesMade}
                      refreshProject={projects}
                    />
                  ) : (
                    <Login />
                  )
                }
              />

              <Route path="/tasks" element={user ? <TaskList /> : <Login />} />
              <Route
                path="/tasks/:id"
                element={user ? <TaskDetails /> : <Login />}
              />
              <Route path="/tasks/:id/edit" element={<EditTaskForm />} />
              <Route
                path="/notifications"
                element={user ? <Notifications /> : <Login />}
              />
              <Route
                path="/ai-recommend-tasks"
                element={user ? <Recommendation /> : <Login />}
              />
            </Routes>
          </div>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
