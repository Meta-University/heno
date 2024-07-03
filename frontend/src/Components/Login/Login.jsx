import "./Login.css";
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../UserContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        const loggedInUser = data.user;
        updateUser(loggedInUser);
        navigate("/projects");
      } else {
        setError("Login failed");
      }
    } catch (error) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  function tooglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  return (
    <div className="login-page">
      <div className="login">
        <>
          <h1>Log In</h1>
        </>
        <form onSubmit={handleLogin}>
          <div className="inputs">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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
          </div>
          {error && <div className="error">{error}</div>}
          <p>
            Do not have an account?{" "}
            <Link to="/signup" className="signup-link">
              Sign up
            </Link>
          </p>
          <button
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
