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
import SkeletonLoader from "./Components/SkeletonLoader/SkeletonLoader";
import RecommendationTable from "./Components/RecommendationTable/RecommendationTable";
import RecommendationLoader from "./Components/RecommendationLoader/RecommendationLoader";
import ProjectChart from "./Components/DataVisualization/ProjectChart";
import ProjectInfoPage from "./Components/ProjectInfoPage/ProjectInfoPage";
import TaskCalendar from "./Components/TaskCalendar/TaskCalendar";
import io from "socket.io-client";
import { subscribeToNotifications } from "./subscribeToNotifications";

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
  const [recommendedProjectInfo, setRecommendedProjectInfo] = useState([]);
  const [recommendedTasks, setRecommendedTasks] = useState([]);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

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

  function handleSetRecommendationData(projectInfo, tasks, loading) {
    setRecommendedProjectInfo(projectInfo);
    setRecommendedTasks(tasks);
    setRecommendationLoading(loading);
  }

  function handleNotificationsRead() {
    setUnreadNotifications(0);
  }

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));

    const socket = io("http://localhost:3000", {
      withCredentials: true,
    });

    if (user) {
      subscribeToNotifications(user.id, (notification) => {
        setUnreadNotifications((prev) => prev + 1);
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <div className="App">
      <UserContext.Provider value={{ user, updateUser }}>
        <Router>
          {user && (
            <Navbar isOpen={isSidebarOpen} toogleSidebar={toogleSidebar} />
          )}
          {user && (
            <Sidebar
              isOpen={isSidebarOpen}
              toogleSidebar={toogleSidebar}
              notificationCount={unreadNotifications}
            />
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
                    <ProjectInfoPage
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
                element={
                  user ? (
                    <Notifications
                      onNotificationsRead={handleNotificationsRead}
                    />
                  ) : (
                    <Login />
                  )
                }
              />
              <Route
                path="/ai-recommendation"
                element={
                  user ? (
                    <Recommendation
                      recommendationInfo={handleSetRecommendationData}
                    />
                  ) : (
                    <Login />
                  )
                }
              />
              <Route
                path="/ai-recommend-tasks"
                element={
                  user ? (
                    <RecommendationTable
                      projectInfo={recommendedProjectInfo}
                      tasks={recommendedTasks}
                      loading={recommendationLoading}
                    />
                  ) : (
                    <Login />
                  )
                }
              />

              <Route
                path="/loading"
                element={user ? <RecommendationLoader /> : <Login />}
              />
              <Route
                path="/visualization/:id"
                element={user ? <ProjectChart /> : <Login />}
              />
              <Route
                path="/calender"
                element={user ? <TaskCalendar /> : <Login />}
              />
            </Routes>
          </div>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
