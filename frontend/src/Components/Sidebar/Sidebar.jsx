import "./Sidebar.css";
import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-title">
        <i className="fa-solid fa-user"></i>
        <h1>HENO</h1>
      </div>

      <div className="sidebar-items">
        <div className="icon">
          <i className="fa-solid fa-house"></i>
          <Link to="/home">Home</Link>
        </div>

        <div className="icon">
          <i className="fa-solid fa-folder"></i>
          <Link to="/projects">Projects</Link>
        </div>

        <div className="icon">
          <i className="fa-regular fa-square-check"></i>
          <Link to="/tasks">Tasks</Link>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
