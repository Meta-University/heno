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

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

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
          <Routes>
            <Route path="/" element={user ? <HomePage /> : <Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/home"
              element={
                <>
                  <Sidebar />
                  <HomePage />
                </>
              }
            />
            <Route
              path="/projects"
              element={
                <>
                  <Sidebar />
                  <ProjectList />
                </>
              }
            />

            <Route
              path="/tasks"
              element={
                <>
                  <Sidebar />
                  <TaskList />
                </>
              }
            />
          </Routes>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
