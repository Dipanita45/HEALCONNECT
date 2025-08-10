// pages/login.jsx
import React, { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor"); // default: doctor

  const handleLogin = (e) => {
    e.preventDefault();

    // Basic mock authentication — replace with real API later
    if (username.trim() === "" || password.trim() === "") {
      alert("Please enter both username and password");
      return;
    }

    // Store data in localStorage
    localStorage.setItem("userType", role);
    localStorage.setItem("username", username);

    // Redirect to correct dashboard
    router.push(`/${role}/dashboard`);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f4f4",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          width: "300px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "1rem",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "1rem",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "1.5rem",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
        </select>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.5rem",
            background: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
