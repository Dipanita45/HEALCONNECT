// pages/signup.js
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { UserContext } from "@lib/context";
import Link from "next/link";

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
    gender: "male"
  });
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize dark mode
  useEffect(() => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        setDarkMode(true);
        document.documentElement.classList.add("dark");
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
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
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
      // Get existing users from localStorage (client-side only)
      if (typeof window === 'undefined') {
        throw new Error("Signup is only available on client side");
      }
      
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Check if username or email already exists
      const userExists = existingUsers.some(user => 
        user.username === formData.username || user.email === formData.email
      );

      if (userExists) {
        setErrors({
          submit: "Username or email already exists. Please use different credentials."
        });
        setIsSubmitting(false);
        return;
      }

      // Create new user object
      const newUser = {
        id: Date.now().toString(),
        username: formData.username,
        email: formData.email,
        password: formData.password, // In production, this should be hashed
        role: formData.role,
        fullName: formData.fullName,
        phone: formData.phone,
        age: formData.age,
        gender: formData.gender,
        createdAt: new Date().toISOString()
      };

      // Save to localStorage (in production, this would be saved to a database)
      existingUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

      // Auto-login after successful signup
      localStorage.setItem('userType', newUser.role);
      localStorage.setItem('username', newUser.username);
      
      // Update React state for immediate UI update
      setUser({ uid: newUser.id });
      setUserRole(newUser.role);
      setCurrentUser({ 
        name: newUser.username,
        role: newUser.role,
        fullName: newUser.fullName
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
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: darkMode ? "#0d1b2a" : "#f8f9fa",
      padding: "10px 20px",
      marginTop: "10px",
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

      {/* Main Container */}
      <div style={{
        width: "100%",
        maxWidth: "450px",
        background: darkMode ? "#1b263b" : "white",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        overflow: "hidden",
        border: darkMode ? "1px solid #2d3748" : "1px solid #e9ecef",
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
                marginBottom: "6px",
                color: darkMode ? "#e2e8f0" : "#4a5568",
                fontSize: "13px",
                fontWeight: "600",
              }}>
                SIGN UP AS
              </label>
              <div style={{
                display: "flex",
                gap: "8px",
              }}>
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
                    gap: "6px",
                  }}
                >
                  <span>👨‍⚕️</span> DOCTOR
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
                    gap: "6px",
                  }}
                >
                  <span>👤</span> PATIENT
                </button>
              </div>
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
