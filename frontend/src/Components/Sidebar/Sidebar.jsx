import "./Sidebar.css";
import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../UserContext";
import UserProfile from "../UserProfile/UserProfile";
import { PiSidebarDuotone } from "react-icons/pi";

function Sidebar(props) {
  const { user, updateUser } = useContext(UserContext);
  const [showProfile, setShowProfile] = useState(false);

  function handleProfileDisplay() {
    setShowProfile(!showProfile);
  }

  return (
    <div className={`sidebar-container ${props.isOpen ? "open" : ""}`}>
      <div className={`sidebar ${props.isOpen ? "open" : ""}`}>
        <div className="sidebar-title">
          <div className="profile-title">
            <i onClick={handleProfileDisplay} className="fa-solid fa-user"></i>
            <h1>HENO</h1>
          </div>

          <PiSidebarDuotone
            className="close-icon"
            onClick={props.toogleSidebar}
          />
        </div>

        {showProfile && <UserProfile />}

        <div className="sidebar-items">
          <div className="icon">
            <i className="fa-solid fa-house"></i>
            <Link to="/home">
              <p>Home</p>
            </Link>
          </div>

          <div className="icon">
            <i className="fa-solid fa-folder"></i>
            <Link to="/projects">
              <p>Projects</p>
            </Link>
          </div>

          <div className="icon">
            <i className="fa-solid fa-square-check"></i>
            <Link to="/tasks">
              <p>Tasks</p>
            </Link>
          </div>
        </div>
      </div>
      {!props.isOpen && (
        <div className="sidebar-toogle">
          <PiSidebarDuotone
            className="menu-icon"
            onClick={props.toogleSidebar}
          />
        </div>
      )}
    </div>
  );
}

export default Sidebar;
