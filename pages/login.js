// pages/login.js
import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@lib/firebase";
import { UserContext } from "@lib/context";
import { updateUserState } from "@lib/authUtils";
import { useTheme } from "@/context/ThemeContext";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setUserRole, setCurrentUser } = useContext(UserContext);
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === 'dark';

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid credentials. Please try again.");
        return;
      }

      const userData = data.user;
      const userRole = userData.role || 'patient';

      // Update React Context
      updateUserState(setUser, setUserRole, setCurrentUser, userRole, {
        uid: userData.id,
        email: userData.email,
        ...userData,
      });

      // Navigate to the appropriate dashboard
      router.push(`/${userRole}/dashboard`);
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setForgotMessage("");
    if (!forgotEmail.trim()) {
      setForgotMessage("Please enter your email address");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
      setForgotMessage("Please enter a valid email address");
      return;
    }
    // In a real implementation, you would call sendPasswordResetEmail here.
    setForgotMessage(`If an account exists for ${forgotEmail}, a password reset link has been sent.`);
    setTimeout(() => setForgotEmail(""), 3000);
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 80px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: darkMode ? "#0d1b2a" : "#f8f9fa",
      padding: "20px",
      marginTop: "0px",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Animated background elements */}
      <div className={styles.backgroundElements}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={styles.circleElement} style={{
            background: darkMode
              ? "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)"
              : "linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)"
          }}></div>
        ))}
      </div>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleTheme}
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

      {/* Main Container */}
      <div style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: "380px",
        background: darkMode ? "#1b263b" : "linear-gradient(135deg, rgba(219, 234, 254, 0.8) 0%, rgba(191, 219, 254, 0.8) 100%)",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        overflow: "hidden",
        border: darkMode ? "1px solid #2d3748" : "1px solid rgba(37, 99, 235, 0.2)",
      }}>
        {/* Form */}
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
            {/* Email */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                marginBottom: "6px",
                color: darkMode ? "#e2e8f0" : "#4a5568",
                fontSize: "13px",
                fontWeight: "600",
              }}>
                EMAIL
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
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
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
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
                    position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: darkMode ? "#a0aec0" : "#718096", padding: "4px", borderRadius: "4px",
                    display: "flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px",
                  }}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "12px",
                background: loading ? "#718096" : (darkMode ? "#1565c0" : "#1976d2"),
                color: "white", border: "none", borderRadius: "6px", cursor: loading ? "not-allowed" : "pointer",
                fontSize: "15px", fontWeight: "600", marginBottom: "12px",
              }}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>

            {/* Forgot Password Link */}
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                style={{
                  background: "none", border: "none", color: darkMode ? "#63b3ed" : "#1976d2",
                  textDecoration: "none", fontWeight: "600", cursor: "pointer", padding: "0", fontSize: "13px",
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Signup Link */}
            <div style={{ textAlign: "center", fontSize: "14px", color: darkMode ? "#a0aec0" : "#718096" }}>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => router.push('/signup')}
                style={{
                  background: "none", border: "none", color: darkMode ? "#63b3ed" : "#1976d2",
                  textDecoration: "none", fontWeight: "600", cursor: "pointer", padding: "0", fontSize: "14px",
                }}
              >
                Sign up here
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000,
        }}>
          <div style={{
            width: "100%", maxWidth: "400px",
            background: darkMode ? "#1b263b" : "white", borderRadius: "10px", padding: "24px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)", border: darkMode ? "1px solid #2d3748" : "1px solid #e9ecef",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: darkMode ? "#ffffff" : "#2d3748" }}>Reset Password</h3>
              <button onClick={() => { setShowForgotPassword(false); setForgotEmail(""); setForgotMessage(""); }}
                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: darkMode ? "#a0aec0" : "#718096" }}>×</button>
            </div>
            <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: darkMode ? "#a0aec0" : "#718096", lineHeight: "1.5" }}>
              Enter your email address and we&apos;ll send you instructions to reset your password.
            </p>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", color: darkMode ? "#e2e8f0" : "#4a5568", fontSize: "13px", fontWeight: "600" }}>EMAIL ADDRESS</label>
              <input
                type="email" placeholder="Enter your email" value={forgotEmail}
                onChange={(e) => { setForgotEmail(e.target.value); setForgotMessage(""); }}
                style={{
                  width: "100%", padding: "10px", border: darkMode ? "1px solid #4a5568" : "1px solid #e2e8f0",
                  borderRadius: "6px", background: darkMode ? "#2d3748" : "#f7fafc", color: darkMode ? "#ffffff" : "#2d3748",
                  fontSize: "14px", outline: "none",
                }}
              />
            </div>
            {forgotMessage && (
              <div style={{
                marginBottom: "16px", padding: "12px", borderRadius: "6px", fontSize: "13px", lineHeight: "1.4",
                background: forgotMessage.includes("sent") ? (darkMode ? "#2d5a3d" : "#d4edda") : (darkMode ? "#742a2a" : "#fed7d7"),
                border: forgotMessage.includes("sent") ? (darkMode ? "1px solid #38a169" : "1px solid #c3e6cb") : (darkMode ? "1px solid #e53e3e" : "1px solid #feb2b2"),
                color: forgotMessage.includes("sent") ? (darkMode ? "#fff5f5" : "#155724") : (darkMode ? "#fff5f5" : "#c53030"),
              }}>{forgotMessage}</div>
            )}
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={handleForgotPassword} style={{ flex: 1, padding: "10px", background: darkMode ? "#1565c0" : "#1976d2", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>Send Reset Link</button>
              <button onClick={() => { setShowForgotPassword(false); setForgotEmail(""); setForgotMessage(""); }} style={{ flex: 1, padding: "10px", background: darkMode ? "#2d3748" : "#f7fafc", color: darkMode ? "#e2e8f0" : "#4a5568", border: darkMode ? "1px solid #4a5568" : "1px solid #e2e8f0", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
