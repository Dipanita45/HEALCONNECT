"use client";
import { useState } from "react";
import Link from "next/link";

export default function SignupForm() {
  const [darkMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    age: "",
    gender: "male",
    password: "",
    confirmPassword: "",
    role: "patient",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, "")))
      newErrors.phone = "Phone must be 10 digits";
    if (!formData.age) newErrors.age = "Age is required";
    if (formData.age < 18 || formData.age > 120)
      newErrors.age = "Age must be between 18 and 120";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted:", formData);
    } catch (error) {
      setErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: "100px", // Add top padding to account for navbar
        paddingBottom: "40px",
        background: darkMode
          ? "linear-gradient(135deg, #0f172a 0%, #1a202c 100%)"
          : "#f8f9fa",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          background: darkMode ? "#1b263b" : "white",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
          border: darkMode ? "1px solid #2d3748" : "1px solid #e9ecef",
          margin: "0 20px", // Add horizontal margin for mobile responsiveness
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px",
            background: darkMode ? "#1565c0" : "#1976d2",
            color: "white",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            Create Account
          </h2>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: "14px",
              opacity: 0.9,
            }}
          >
            Join HEALCONNECT today
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: "24px" }}>
          <form onSubmit={handleSignup}>
            {/* Full Name */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  color: darkMode ? "#e2e8f0" : "#4a5568",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
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
                  border: errors.fullName
                    ? "1px solid #e53e3e"
                    : darkMode
                      ? "1px solid #4a5568"
                      : "1px solid #e2e8f0",
                  borderRadius: "6px",
                  background: darkMode ? "#2d3748" : "#f7fafc",
                  color: darkMode ? "#ffffff" : "#2d3748",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
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
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  color: darkMode ? "#e2e8f0" : "#4a5568",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
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
                  border: errors.username
                    ? "1px solid #e53e3e"
                    : darkMode
                      ? "1px solid #4a5568"
                      : "1px solid #e2e8f0",
                  borderRadius: "6px",
                  background: darkMode ? "#2d3748" : "#f7fafc",
                  color: darkMode ? "#ffffff" : "#2d3748",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
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
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  color: darkMode ? "#e2e8f0" : "#4a5568",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
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
                  border: errors.email
                    ? "1px solid #e53e3e"
                    : darkMode
                      ? "1px solid #4a5568"
                      : "1px solid #e2e8f0",
                  borderRadius: "6px",
                  background: darkMode ? "#2d3748" : "#f7fafc",
                  color: darkMode ? "#ffffff" : "#2d3748",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
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
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  color: darkMode ? "#e2e8f0" : "#4a5568",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
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
                  border: errors.phone
                    ? "1px solid #e53e3e"
                    : darkMode
                      ? "1px solid #4a5568"
                      : "1px solid #e2e8f0",
                  borderRadius: "6px",
                  background: darkMode ? "#2d3748" : "#f7fafc",
                  color: darkMode ? "#ffffff" : "#2d3748",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
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
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    color: darkMode ? "#e2e8f0" : "#4a5568",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
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
                    border: errors.age
                      ? "1px solid #e53e3e"
                      : darkMode
                        ? "1px solid #4a5568"
                        : "1px solid #e2e8f0",
                    borderRadius: "6px",
                    background: darkMode ? "#2d3748" : "#f7fafc",
                    color: darkMode ? "#ffffff" : "#2d3748",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
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
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    color: darkMode ? "#e2e8f0" : "#4a5568",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
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
                    boxSizing: "border-box",
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
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  color: darkMode ? "#e2e8f0" : "#4a5568",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
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
                    border: errors.password
                      ? "1px solid #e53e3e"
                      : darkMode
                        ? "1px solid #4a5568"
                        : "1px solid #e2e8f0",
                    borderRadius: "6px",
                    background: darkMode ? "#2d3748" : "#f7fafc",
                    color: darkMode ? "#ffffff" : "#2d3748",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
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
                    e.target.style.background = darkMode
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = darkMode ? "#a0aec0" : "#718096";
                    e.target.style.background = "none";
                  }}
                >
                  {showPassword ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
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
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  color: darkMode ? "#e2e8f0" : "#4a5568",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
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
                    border: errors.confirmPassword
                      ? "1px solid #e53e3e"
                      : darkMode
                        ? "1px solid #4a5568"
                        : "1px solid #e2e8f0",
                    borderRadius: "6px",
                    background: darkMode ? "#2d3748" : "#f7fafc",
                    color: darkMode ? "#ffffff" : "#2d3748",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
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
                    e.target.style.background = darkMode
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = darkMode ? "#a0aec0" : "#718096";
                    e.target.style.background = "none";
                  }}
                >
                  {showConfirmPassword ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
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
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  color: darkMode ? "#e2e8f0" : "#4a5568",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                SIGN UP AS
              </label>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: "doctor" }))}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background:
                      formData.role === "doctor"
                        ? darkMode
                          ? "#1565c0"
                          : "#1976d2"
                        : darkMode
                          ? "#2d3748"
                          : "#f7fafc",
                    color:
                      formData.role === "doctor"
                        ? "white"
                        : darkMode
                          ? "#e2e8f0"
                          : "#4a5568",
                    border:
                      formData.role === "doctor"
                        ? "none"
                        : darkMode
                          ? "1px solid #4a5568"
                          : "1px solid #e2e8f0",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: formData.role === "doctor" ? "600" : "500",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>👨‍⚕️</span> DOCTOR
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: "patient" }))}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background:
                      formData.role === "patient"
                        ? darkMode
                          ? "#1565c0"
                          : "#1976d2"
                        : darkMode
                          ? "#2d3748"
                          : "#f7fafc",
                    color:
                      formData.role === "patient"
                        ? "white"
                        : darkMode
                          ? "#e2e8f0"
                          : "#4a5568",
                    border:
                      formData.role === "patient"
                        ? "none"
                        : darkMode
                          ? "1px solid #4a5568"
                          : "1px solid #e2e8f0",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: formData.role === "patient" ? "600" : "500",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>👤</span> PATIENT
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div
                style={{
                  marginBottom: "16px",
                  padding: "12px",
                  background: "#fed7d7",
                  border: "1px solid #feb2b2",
                  borderRadius: "6px",
                  color: "#c53030",
                  fontSize: "14px",
                }}
              >
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
                background: isSubmitting
                  ? "#a0aec0"
                  : darkMode
                    ? "#1565c0"
                    : "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontSize: "15px",
                fontWeight: "600",
                marginBottom: "16px",
                opacity: isSubmitting ? 0.7 : 1,
                transition: "all 0.2s ease",
              }}
            >
              {isSubmitting ? "Creating Account..." : "SIGN UP"}
            </button>

            {/* Login Link */}
            <div
              style={{
                textAlign: "center",
                fontSize: "14px",
                color: darkMode ? "#a0aec0" : "#718096",
              }}
            >
              Already have an account?{" "}
              <Link href="/login">
                <span
                  style={{
                    color: darkMode ? "#63b3ed" : "#1976d2",
                    textDecoration: "none",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
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