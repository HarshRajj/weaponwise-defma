import React, { useState } from "react";
import './adminloginPage1.css';

import { useNavigate } from "react-router-dom";

function LoginPage() {

  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    if(username === "harsh" && password === "password"){
      setError(""); // Clear any previous error
      alert("Login successful!");
      navigate("/homepage1");

    }
    
    else {
      setError("Incorrect username or password. Please try again.");
    }
  };

  return (
    <div id="main">
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
    </div>
  );
}

export default LoginPage;
