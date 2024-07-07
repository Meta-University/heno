import "./Navbar.css";
import { PiSidebarDuotone } from "react-icons/pi";
import UserProfile from "../UserProfile/UserProfile";
import { useState, useContext } from "react";
import { UserContext } from "../../UserContext";

function Navbar(props) {
  const [showProfile, setShowProfile] = useState(false);
  const { user, updateUser } = useContext(UserContext);
  const nameParts = user.name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
  const initials = `${firstName.charAt(0).toUpperCase()}${lastName
    .charAt(0)
    .toUpperCase()}`;

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
        {/* <p onClick={handleProfileDisplay}>{initials}</p> */}
        <i onClick={handleProfileDisplay} className="fa-solid fa-user"></i>
      </div>
    </div>
  );
}

export default Navbar;
