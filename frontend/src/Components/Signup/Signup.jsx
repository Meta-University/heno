import "./Signup.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const { updateUser } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSignup(event) {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
          role,
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        const loggedInUser = data.user;
        updateUser(loggedInUser);
        navigate("/home");
      } else {
        setError("Login failed");
      }

      if (data.error) {
        alert(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function navigateToLogin() {
    navigate("/login");
  }

  function tooglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  function toogleConfirmPasswordVisibility() {
    setShowConfirmPassword(!showConfirmPassword);
  }

  return (
    <div className="signup-page">
      <div className="signup">
        <h1>Welcome to Heno</h1>
        <p className="create-account-text">Create an account</p>
        <form onSubmit={handleSignup}>
          <div className="input-container">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i
              className={
                showPassword ? `fa-solid fa-eye-slash` : `fa-solid fa-eye`
              }
              onClick={tooglePasswordVisibility}
            ></i>
          </div>

          <div className="password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <i
              className={
                showConfirmPassword
                  ? `fa-solid fa-eye-slash`
                  : `fa-solid fa-eye`
              }
              onClick={toogleConfirmPasswordVisibility}
            ></i>
          </div>

          <select
            className="select-signup"
            name="role"
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="public">Select Role</option>
            <option value="PM">Project Manager</option>
            <option value="TM">Team Member</option>
          </select>

          <p>
            Already have an account?{" "}
            <a className="login-link" onClick={navigateToLogin}>
              Login
            </a>
          </p>
          <button>Get Started</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
