import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });

    if (res.data.token) {
      // Save both token and user details
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Navigate to dashboard
      navigate("/dashboard");
    } else {
      setError("Login failed. No token received.");
    }
  } catch (err) {
    setError("Invalid email or password");
  }
};


  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br/>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br/>
        <button type="submit">Login</button>
      </form>
      <p>
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          style={{ color: "blue", cursor: "pointer" }}
        >
          Sign up
        </span>
      </p>
    </div>
  );
};

export default Login;
