// pages/login.js
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { UserContext } from "@lib/context";
import { updateUserState } from "@lib/authUtils";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setUserRole, setCurrentUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor");
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      alert("Please enter both username and password");
      return;
    }
    
    // Update state immediately for navbar UI update
    updateUserState(setUser, setUserRole, setCurrentUser, role, username);
    
    // Small delay to ensure state updates before navigation
    setTimeout(() => {
      router.push(`/${role}/dashboard`);
    }, 100);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: darkMode ? "#0d1b2a" : "#f8f9fa",
      padding: "10px 20px",
      marginTop: "10px", // Very small top margin
    }}>
      {/* Dark Mode Toggle */}
      <button 
        onClick={toggleDarkMode}
        style={{
          position: "fixed",
          top: "15px",
          right: "15px",
          padding: "6px 12px",
          background: darkMode ? "#1b263b" : "#e9ecef",
          color: darkMode ? "#ffffff" : "#495057",
          border: "none",
          borderRadius: "20px",
          cursor: "pointer",
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          zIndex: 100,
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      {/* Main Container - Compact */}
      <div style={{
        width: "100%",
        maxWidth: "380px",
        background: darkMode ? "#1b263b" : "white",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        overflow: "hidden",
        border: darkMode ? "1px solid #2d3748" : "1px solid #e9ecef",
      }}>
        {/* Form - Compact */}
        <div style={{ padding: "20px" }}>
          <form onSubmit={handleLogin}>
            {/* Username */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                marginBottom: "6px",
                color: darkMode ? "#e2e8f0" : "#4a5568",
                fontSize: "13px",
                fontWeight: "600",
              }}>
                USERNAME
              </label>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: darkMode ? "1px solid #4a5568" : "1px solid #e2e8f0",
                  borderRadius: "6px",
                  background: darkMode ? "#2d3748" : "#f7fafc",
                  color: darkMode ? "#ffffff" : "#2d3748",
                  fontSize: "14px",
                  outline: "none",
                }}
                required
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                marginBottom: "6px",
                color: darkMode ? "#e2e8f0" : "#4a5568",
                fontSize: "13px",
                fontWeight: "600",
              }}>
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: darkMode ? "1px solid #4a5568" : "1px solid #e2e8f0",
                  borderRadius: "6px",
                  background: darkMode ? "#2d3748" : "#f7fafc",
                  color: darkMode ? "#ffffff" : "#2d3748",
                  fontSize: "14px",
                  outline: "none",
                }}
                required
              />
            </div>

            {/* Role Selection - Compact */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                marginBottom: "6px",
                color: darkMode ? "#e2e8f0" : "#4a5568",
                fontSize: "13px",
                fontWeight: "600",
              }}>
                LOGIN AS
              </label>
              <div style={{
                display: "flex",
                gap: "8px",
              }}>
                <button
                  type="button"
                  onClick={() => setRole("doctor")}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: role === "doctor" 
                      ? (darkMode ? "#1565c0" : "#1976d2") 
                      : (darkMode ? "#2d3748" : "#f7fafc"),
                    color: role === "doctor" 
                      ? "white" 
                      : (darkMode ? "#e2e8f0" : "#4a5568"),
                    border: role === "doctor" 
                      ? "none" 
                      : (darkMode ? "1px solid #4a5568" : "1px solid #e2e8f0"),
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: role === "doctor" ? "600" : "500",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <span>👨‍⚕️</span> DOCTOR
                </button>
                <button
                  type="button"
                  onClick={() => setRole("patient")}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: role === "patient" 
                      ? (darkMode ? "#1565c0" : "#1976d2") 
                      : (darkMode ? "#2d3748" : "#f7fafc"),
                    color: role === "patient" 
                      ? "white" 
                      : (darkMode ? "#e2e8f0" : "#4a5568"),
                    border: role === "patient" 
                      ? "none" 
                      : (darkMode ? "1px solid #4a5568" : "1px solid #e2e8f0"),
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: role === "patient" ? "600" : "500",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <span>👤</span> PATIENT
                </button>
              </div>
            </div>

            {/* Login Button - Compact */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                background: darkMode ? "#1565c0" : "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "600",
                marginBottom: "10px",
              }}
            >
              LOGIN
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}