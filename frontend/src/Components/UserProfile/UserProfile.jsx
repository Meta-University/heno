import { UserContext } from "../../UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";
import { capitalizeFirstLetters } from "../../capitalizeFirstLetters";

function UserProfile() {
  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const nameParts = user.name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
  const initials = `${firstName.charAt(0).toUpperCase()}${lastName
    .charAt(0)
    .toUpperCase()}`;

  function handleLogout() {
    updateUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  }

  function setRole(role) {
    if (role === "TM") {
      return "Team Member";
    } else if (role === "PM") {
      return "Project Manager";
    }
  }

  return (
    <div className="profile">
      <div className="user-initials">
        <h3>{initials}</h3>
      </div>
      <p>
        <strong>Name: </strong>
        {capitalizeFirstLetters(user.name)}
      </p>
      <p>
        <strong>Email: </strong> {user.email}
      </p>
      <p>
        <strong>Role: </strong> {setRole(user.role)}
      </p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default UserProfile;
