import "./Navbar.css";
import { PiSidebarDuotone } from "react-icons/pi";
import UserProfile from "../UserProfile/UserProfile";
import { useState } from "react";

function Navbar(props) {
  const [showProfile, setShowProfile] = useState(false);

  function handleProfileDisplay() {
    setShowProfile(!showProfile);
  }
  return (
    <div className="navbar">
      <div onClick={props.toogleSidebar} className="toogle-btn">
        <PiSidebarDuotone />
      </div>
      <div className="navbar-title">
        <h1>Heno</h1>
      </div>
      {showProfile && <UserProfile />}
      <div className="user-profile">
        <i onClick={handleProfileDisplay} className="fa-solid fa-user"></i>
      </div>
    </div>
  );
}

export default Navbar;
