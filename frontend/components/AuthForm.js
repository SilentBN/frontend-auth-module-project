import React, { useState } from "react";
import axios from "axios"; // Import axios
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // handleSubmit Function
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      if (isLogin) {
        // Handle login
        const response = await axios.post(
          "http://localhost:3003/api/auth/login",
          { username, password }
        );
        localStorage.setItem("token", response.data.token);
        navigate("/stars");
      } else {
        // Handle registration
        const response = await axios.post(
          "http://localhost:3003/api/auth/register",
          { username, password }
        );
        setMessage(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  const toggleFormMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setMessage("");
  };
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div className="container">
      <div aria-live="polite">{message}</div>
      <div aria-live="assertive" style={{ color: "red" }}>
        {error}
      </div>
      <h3>
        {isLogin ? "Login" : "Register"}
        <button onClick={toggleFormMode}>
          Switch to {isLogin ? "Register" : "Login"}
        </button>
      </h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>
    </div>
  );
}
