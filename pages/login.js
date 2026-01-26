// pages/login.js
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { UserContext } from "@lib/context";
import { updateUserState } from "@lib/authUtils";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setUserRole, setCurrentUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

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
    setError(""); // Clear previous errors
    
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }
    
    // Get registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Find user by username
    const user = registeredUsers.find(u => u.username === username);
    
    if (!user) {
      setError("User not found. Please sign up first.");
      return;
    }
    
    // Check password
    if (user.password !== password) {
      setError("Incorrect password. Please try again.");
      return;
    }
    
    // Update state immediately for navbar UI update
    updateUserState(setUser, setUserRole, setCurrentUser, user.role, username);
    
    // Store additional user info
    const currentUserData = {
      id: user.id,
      name: user.fullName, // Map fullName to name for dashboard
      email: user.email,
      number: user.phone, // Map phone to number for dashboard
      phone: user.phone,
      fullName: user.fullName,
      age: user.age,
      gender: user.gender,
      role: user.role,
      username: user.username
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUserData));
    
    // Update React state with proper field mapping
    setCurrentUser(currentUserData);
    
    // Small delay to ensure state updates before navigation
    setTimeout(() => {
      router.push(`/${user.role}/dashboard`);
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
          {/* Error Message */}
          {error && (
            <div style={{
              marginBottom: "16px",
              padding: "12px",
              background: darkMode ? "#742a2a" : "#fed7d7",
              border: darkMode ? "1px solid #e53e3e" : "1px solid #feb2b2",
              borderRadius: "6px",
              color: darkMode ? "#fff5f5" : "#c53030",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}
          
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
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(""); // Clear error when user starts typing
                }}
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
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(""); // Clear error when user starts typing
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 40px 10px 10px",
                    border: darkMode ? "1px solid #4a5568" : "1px solid #e2e8f0",
                    borderRadius: "6px",
                    background: darkMode ? "#2d3748" : "#f7fafc",
                    color: darkMode ? "#ffffff" : "#2d3748",
                    fontSize: "14px",
                    outline: "none",
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: darkMode ? "#a0aec0" : "#718096",
                    padding: "4px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "24px",
                    height: "24px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = darkMode ? "#e2e8f0" : "#4a5568";
                    e.target.style.background = darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = darkMode ? "#a0aec0" : "#718096";
                    e.target.style.background = "none";
                  }}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
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
                marginBottom: "16px",
              }}
            >
              LOGIN
            </button>

            {/* Signup Link */}
            <div style={{
              textAlign: "center",
              fontSize: "14px",
              color: darkMode ? "#a0aec0" : "#718096",
            }}>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => {
                  // Navigate to signup page
                  router.push('/signup');
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: darkMode ? "#63b3ed" : "#1976d2",
                  textDecoration: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: "0",
                  fontSize: "14px",
                }}
              >
                Sign up here
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}