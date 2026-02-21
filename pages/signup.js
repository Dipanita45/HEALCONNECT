// pages/signup.js
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { UserContext } from "@lib/context";
// import { hashPassword } from "@lib/authUtils"; // REMOVED
import Link from "next/link";
import styles from "./signup.module.css";

export default function SignupPage() {
  const router = useRouter();
  const { setUser, setUserRole, setCurrentUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
    fullName: "",
    phone: "",
    age: "",
    gender: "male",
    adminCode: ""
  });
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: "", color: "" });

  // Initialize dark mode
  useEffect(() => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("theme");
      const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

      // Default to light mode unless explicitly saved as dark
      if (savedTheme === "dark") {
        setDarkMode(true);
        document.documentElement.classList.add("dark");
      } else {
        setDarkMode(false);
        document.documentElement.classList.remove("dark");
        // Ensure light theme is saved if not already set
        if (!savedTheme) {
          localStorage.setItem("theme", "light");
        }
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      if (typeof window !== 'undefined') {
        localStorage.setItem("theme", "dark");
      }
    } else {
      document.documentElement.classList.remove("dark");
      if (typeof window !== 'undefined') {
        localStorage.setItem("theme", "light");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check password strength when password changes
    if (name === 'password') {
      checkPasswordStrength(value);
    }

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    let message = "";
    let color = "";

    if (!password) {
      setPasswordStrength({ score: 0, message: "", color: "" });
      return;
    }

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Complexity checks
    if (/[a-z]/.test(password)) score += 1; // lowercase
    if (/[A-Z]/.test(password)) score += 1; // uppercase
    if (/[0-9]/.test(password)) score += 1; // numbers
    if (/[^a-zA-Z0-9]/.test(password)) score += 1; // special characters

    // Determine strength message and color
    if (score <= 2) {
      message = "Weak password";
      color = "#e53e3e"; // red
    } else if (score <= 4) {
      message = "Fair password";
      color = "#dd6b20"; // orange
    } else if (score <= 5) {
      message = "Good password";
      color = "#38a169"; // green
    } else {
      message = "Strong password";
      color = "#2b6cb0"; // blue
    }

    setPasswordStrength({ score, message, color });
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.age || formData.age < 1 || formData.age > 120) {
      newErrors.age = "Please enter a valid age";
    }

    // Admin code validation
    if (formData.role === "admin") {
      if (!formData.adminCode.trim()) {
        newErrors.adminCode = "Admin code is required for admin registration";
      }
      // Note: Admin code value validation is handled securely on the backend
      // to prevent exposure in the frontend bundle.
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          submit: data.message || "Registration failed. Please try again."
        });
        setIsSubmitting(false);
        return;
      }

      const newUser = data.user;

      // Update React state for immediate UI update
      setUser({ uid: newUser.id });
      setUserRole(newUser.role);
      setCurrentUser({
        name: newUser.fullName, // Use fullName instead of username
        email: newUser.email,
        number: formData.phone, // Map phone to number
        role: newUser.role,
        username: newUser.username,
        fullName: newUser.fullName,
        phone: formData.phone,
        age: formData.age,
        gender: formData.gender,
        adminCode: formData.adminCode,
        id: newUser.id
      });

      // Show success message and redirect
      setTimeout(() => {
        router.push(`/${newUser.role}/dashboard`);
      }, 500);

    } catch (error) {
      console.error('Signup error:', error);
      setErrors({
        submit: "An error occurred during signup. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
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
        <div className={styles.circleElement} style={{
          background: darkMode
            ? "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)"
            : "linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)"
        }}></div>
        <div className={styles.circleElement} style={{
          background: darkMode
            ? "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)"
            : "linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)"
        }}></div>
        <div className={styles.circleElement} style={{
          background: darkMode
            ? "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)"
            : "linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)"
        }}></div>
        <div className={styles.circleElement} style={{
          background: darkMode
            ? "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)"
            : "linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)"
        }}></div>
        <div className={styles.circleElement} style={{
          background: darkMode
            ? "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)"
            : "linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)"
        }}></div>
      </div>

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

      {/* Main Container */}
      <div style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: "450px",
        background: darkMode ? "#1b263b" : "linear-gradient(135deg, rgba(219, 234, 254, 0.8) 0%, rgba(191, 219, 254, 0.8) 100%)",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        overflow: "hidden",
        border: darkMode ? "1px solid #2d3748" : "1px solid rgba(37, 99, 235, 0.2)",
      }}>
        {/* Header */}
        <div style={{
          padding: "24px",
          background: darkMode ? "#1565c0" : "#1976d2",
          color: "white",
          textAlign: "center",
        }}>
          <h2 style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: "600",
          }}>
            Create Account
          </h2>
          <p style={{
            margin: "8px 0 0",
            fontSize: "14px",
            opacity: 0.9,
          }}>
            Join HEALCONNECT today
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: "24px" }}>
          <form onSubmit={handleSignup}>
            {/* Full Name */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                marginBottom: "6px",
                color: darkMode ? "#e2e8f0" : "#4a5568",
                fontSize: "13px",
                fontWeight: "600",
              }}>
                FULL NAME
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: errors.fullName ? "1px solid #e53e3e" : (darkMode ? "1px solid #4a5568" : "1px solid #e2e8f0"),
                  borderRadius: "6px",
                  background: darkMode ? "#2d3748" : "#f7fafc",
                  color: darkMode ? "#ffffff" : "#2d3748",
                  fontSize: "14px",
                  outline: "none",
                }}
                required
              />
              {errors.fullName && (
                <div style={{ color: "#e53e3e", fontSize: "12px", marginTop: "4px" }}>
                  {errors.fullName}
                </div>
              )}
            </div>

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
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: errors.username ? "1px solid #e53e3e" : (darkMode ? "1px solid #4a5568" : "1px solid #e2e8f0"),
                  borderRadius: "6px",
                  background: darkMode ? "#2d3748" : "#f7fafc",
                  color: darkMode ? "#ffffff" : "#2d3748",
                  fontSize: "14px",
                  outline: "none",
                }}
                required
              />
              {errors.username && (
                <div style={{ color: "#e53e3e", fontSize: "12px", marginTop: "4px" }}>
                  {errors.username}
                </div>
              )}
            </div>

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
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: errors.email ? "1px solid #e53e3e" : (darkMode ? "1px solid #4a5568" : "1px solid #e2e8f0"),
                  borderRadius: "6px",
                  background: darkMode ? "#2d3748" : "#f7fafc",
                  color: darkMode ? "#ffffff" : "#2d3748",
                  fontSize: "14px",
                  outline: "none",
                }}
                required
              />
              {errors.email && (
                <div style={{ color: "#e53e3e", fontSize: "12px", marginTop: "4px" }}>
                  {errors.email}
                </div>
              )}
            </div>

            {/* Phone */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                marginBottom: "6px",
                color: darkMode ? "#e2e8f0" : "#4a5568",
                fontSize: "13px",
                fontWeight: "600",
              }}>
                PHONE NUMBER
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter 10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: errors.phone ? "1px solid #e53e3e" : (darkMode ? "1px solid #4a5568" : "1px solid #e2e8f0"),
                  borderRadius: "6px",
                  background: darkMode ? "#2d3748" : "#f7fafc",
                  color: darkMode ? "#ffffff" : "#2d3748",
                  fontSize: "14px",
                  outline: "none",
                }}
                required
              />
              {errors.phone && (
                <div style={{ color: "#e53e3e", fontSize: "12px", marginTop: "4px" }}>
                  {errors.phone}
                </div>
              )}
            </div>

            {/* Age and Gender */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  color: darkMode ? "#e2e8f0" : "#4a5568",
                  fontSize: "13px",
                  fontWeight: "600",
                }}>
                  AGE
                </label>
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: errors.age ? "1px solid #e53e3e" : (darkMode ? "1px solid #4a5568" : "1px solid #e2e8f0"),
                    borderRadius: "6px",
                    background: darkMode ? "#2d3748" : "#f7fafc",
                    color: darkMode ? "#ffffff" : "#2d3748",
                    fontSize: "14px",
                    outline: "none",
                  }}
                  required
                />
                {errors.age && (
                  <div style={{ color: "#e53e3e", fontSize: "12px", marginTop: "4px" }}>
                    {errors.age}
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  color: darkMode ? "#e2e8f0" : "#4a5568",
                  fontSize: "13px",
                  fontWeight: "600",
                }}>
                  GENDER
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
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
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
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
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 40px 10px 10px",
                    border: errors.password ? "1px solid #e53e3e" : (darkMode ? "1px solid #4a5568" : "1px solid #e2e8f0"),
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
              {errors.password && (
                <div style={{ color: "#e53e3e", fontSize: "12px", marginTop: "4px" }}>
                  {errors.password}
                </div>
              )}

              {/* Password Strength Indicator */}
              {formData.password && (
                <div style={{ marginTop: "8px" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "4px"
                  }}>
                    <span style={{
                      fontSize: "11px",
                      color: darkMode ? "#a0aec0" : "#718096"
                    }}>
                      Password Strength:
                    </span>
                    <span style={{
                      fontSize: "11px",
                      color: passwordStrength.color,
                      fontWeight: "600"
                    }}>
                      {passwordStrength.message}
                    </span>
                  </div>
                  <div style={{
                    width: "100%",
                    height: "4px",
                    backgroundColor: darkMode ? "#2d3748" : "#e2e8f0",
                    borderRadius: "2px",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${(passwordStrength.score / 6) * 100}%`,
                      height: "100%",
                      backgroundColor: passwordStrength.color,
                      transition: "width 0.3s ease, background-color 0.3s ease"
                    }} />
                  </div>
                  <div style={{
                    fontSize: "10px",
                    color: darkMode ? "#a0aec0" : "#718096",
                    marginTop: "4px",
                    lineHeight: "1.3"
                  }}>
                    Use 8+ characters with uppercase, lowercase, numbers, and symbols
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                marginBottom: "6px",
                color: darkMode ? "#e2e8f0" : "#4a5568",
                fontSize: "13px",
                fontWeight: "600",
              }}>
                CONFIRM PASSWORD
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 40px 10px 10px",
                    border: errors.confirmPassword ? "1px solid #e53e3e" : (darkMode ? "1px solid #4a5568" : "1px solid #e2e8f0"),
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  {showConfirmPassword ? (
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
              {errors.confirmPassword && (
                <div style={{ color: "#e53e3e", fontSize: "12px", marginTop: "4px" }}>
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* Role Selection */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                color: darkMode ? "#e2e8f0" : "#4a5568",
                fontSize: "13px",
                fontWeight: "600",
              }}>
                SELECT YOUR ROLE
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: "doctor" }))}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: formData.role === "doctor"
                      ? (darkMode ? "#1565c0" : "#1976d2")
                      : (darkMode ? "#2d3748" : "#f7fafc"),
                    color: formData.role === "doctor"
                      ? "white"
                      : (darkMode ? "#e2e8f0" : "#4a5568"),
                    border: formData.role === "doctor"
                      ? "none"
                      : (darkMode ? "1px solid #4a5568" : "1px solid #e2e8f0"),
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: formData.role === "doctor" ? "600" : "500",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (formData.role !== "doctor") {
                      e.target.style.background = darkMode ? "#4a5568" : "#edf2f7";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (formData.role !== "doctor") {
                      e.target.style.background = darkMode ? "#2d3748" : "#f7fafc";
                    }
                  }}
                >
                  Doctor
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: "patient" }))}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: formData.role === "patient"
                      ? (darkMode ? "#1565c0" : "#1976d2")
                      : (darkMode ? "#2d3748" : "#f7fafc"),
                    color: formData.role === "patient"
                      ? "white"
                      : (darkMode ? "#e2e8f0" : "#4a5568"),
                    border: formData.role === "patient"
                      ? "none"
                      : (darkMode ? "1px solid #4a5568" : "1px solid #e2e8f0"),
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: formData.role === "patient" ? "600" : "500",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (formData.role !== "patient") {
                      e.target.style.background = darkMode ? "#4a5568" : "#edf2f7";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (formData.role !== "patient") {
                      e.target.style.background = darkMode ? "#2d3748" : "#f7fafc";
                    }
                  }}
                >
                  Patient
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: "admin" }))}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: formData.role === "admin"
                      ? (darkMode ? "#b91c1c" : "#dc2626")
                      : (darkMode ? "#2d3748" : "#f7fafc"),
                    color: formData.role === "admin"
                      ? "white"
                      : (darkMode ? "#e2e8f0" : "#4a5568"),
                    border: formData.role === "admin"
                      ? "none"
                      : (darkMode ? "1px solid #4a5568" : "1px solid #e2e8f0"),
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: formData.role === "admin" ? "600" : "500",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (formData.role !== "admin") {
                      e.target.style.background = darkMode ? "#4a5568" : "#edf2f7";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (formData.role !== "admin") {
                      e.target.style.background = darkMode ? "#2d3748" : "#f7fafc";
                    }
                  }}
                >
                  Admin
                </button>
              </div>
              {formData.role === "admin" && (
                <div style={{
                  marginTop: "8px",
                  padding: "8px 12px",
                  background: darkMode ? "#7f1d1d" : "#fef2f2",
                  border: `1px solid ${darkMode ? "#991b1b" : "#fecaca"}`,
                  borderRadius: "6px",
                  fontSize: "11px",
                  color: darkMode ? "#fca5a5" : "#991b1b",
                  lineHeight: "1.4",
                }}>
                  Admin access provides full system control including user management,
                  support system oversight, and platform settings.
                </div>
              )}

              {/* Admin Code Field - Only shown for admin role */}
              {formData.role === "admin" && (
                <div style={{ marginBottom: "16px" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "6px",
                    color: darkMode ? "#e2e8f0" : "#4a5568",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}>
                    ADMIN CODE
                  </label>
                  <input
                    type="password"
                    name="adminCode"
                    placeholder="Enter admin authorization code"
                    value={formData.adminCode}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: errors.adminCode ? "1px solid #e53e3e" : (darkMode ? "1px solid #4a5568" : "1px solid #e2e8f0"),
                      borderRadius: "6px",
                      background: darkMode ? "#2d3748" : "#f7fafc",
                      color: darkMode ? "#ffffff" : "#2d3748",
                      fontSize: "14px",
                      outline: "none",
                    }}
                    required
                  />
                  {errors.adminCode && (
                    <div style={{ color: "#e53e3e", fontSize: "12px", marginTop: "4px" }}>
                      {errors.adminCode}
                    </div>
                  )}
                  <div style={{
                    marginTop: "4px",
                    fontSize: "11px",
                    color: darkMode ? "#a0aec0" : "#718096",
                  }}>
                    Contact system administrator for the admin code
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div style={{
                marginBottom: "16px",
                padding: "12px",
                background: "#fed7d7",
                border: "1px solid #feb2b2",
                borderRadius: "6px",
                color: "#c53030",
                fontSize: "14px",
              }}>
                {errors.submit}
              </div>
            )}

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "12px",
                background: isSubmitting ? "#a0aec0" : (darkMode ? "#1565c0" : "#1976d2"),
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontSize: "15px",
                fontWeight: "600",
                marginBottom: "16px",
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? "Creating Account..." : "SIGN UP"}
            </button>

            {/* Login Link */}
            <div style={{
              textAlign: "center",
              fontSize: "14px",
              color: darkMode ? "#a0aec0" : "#718096",
            }}>
              Already have an account?{" "}
              <Link href="/login">
                <span style={{
                  color: darkMode ? "#63b3ed" : "#1976d2",
                  textDecoration: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                }}>
                  Login here
                </span>
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
