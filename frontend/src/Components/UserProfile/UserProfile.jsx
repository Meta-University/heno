import { UserContext } from "../../UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";

function UserProfile() {
  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  function handleLogout() {
    updateUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="profile">
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default UserProfile;
