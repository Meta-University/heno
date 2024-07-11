import "./Sidebar.css";
import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../UserContext";
import UserProfile from "../UserProfile/UserProfile";
import { PiSidebarDuotone } from "react-icons/pi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Sidebar(props) {
  const { user, updateUser } = useContext(UserContext);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  function handleProfileDisplay() {
    setShowProfile(!showProfile);
  }

  function handleItemClick(item) {
    setSelectedItem(item);
  }

  return (
    <div className={`sidebar ${props.isOpen ? "open" : ""}`}>
      <div className="sidebar-items">
        <ul>
          <li
            className={selectedItem === "home" ? "selected" : ""}
            onClick={() => handleItemClick("home")}
          >
            <Link to="/home">
              <i className="fa-solid fa-house"></i>
              <p>Home</p>
            </Link>
          </li>
          <li
            className={selectedItem === "projects" ? "selected" : ""}
            onClick={() => handleItemClick("projects")}
          >
            <Link to="/projects">
              <i className="fa-solid fa-folder"></i>
              <p>Projects</p>
            </Link>
          </li>
          <li
            className={selectedItem === "tasks" ? "selected" : ""}
            onClick={() => handleItemClick("tasks")}
          >
            <Link to="/tasks">
              <i className="fa-solid fa-circle-check"></i>
              <p>Tasks</p>
            </Link>
          </li>

          <li
            className={selectedItem === "notifications" ? "selected" : ""}
            onClick={() => handleItemClick("notifications")}
          >
            <Link to="/notifications">
              <i className="fa-solid fa-bell"></i>
              <p>Notifications</p>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
