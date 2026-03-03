import React from "react";
import { SignIn } from "@clerk/nextjs";
import { useTheme } from "@/context/ThemeContext";
import styles from "./login.module.css";
import LoadingButton from "@/components/ui/LoadingButton";

export default function LoginPage() {
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === 'dark';

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: darkMode ? "#0d1b2a" : "#f8f9fa",
      padding: "20px",
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

      {/* Main Container for Clerk */}
      <div style={{
        position: "relative",
        zIndex: 1,
      }}>
        <SignIn
          routing="hash"
          fallbackRedirectUrl="/onboarding"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: darkMode ? "bg-[#1b263b] text-white border border-[#2d3748] shadow-lg" : "shadow-lg border border-gray-100",
              headerTitle: darkMode ? "text-white" : "text-gray-900",
              headerSubtitle: darkMode ? "text-gray-300" : "text-gray-500",
              socialButtonsBlockButton: darkMode ? "border-gray-600 hover:bg-gray-800 text-white" : "",
              socialButtonsBlockButtonText: darkMode ? "text-white" : "text-gray-600",
              socialButtonsBlockButtonArrow: darkMode ? "text-white" : "text-gray-600",
              dividerLine: darkMode ? "bg-gray-600" : "bg-gray-200",
              dividerText: darkMode ? "text-gray-400" : "text-gray-500",
              formFieldLabel: darkMode ? "text-gray-200" : "text-gray-700",
              formFieldInput: darkMode ? "bg-[#2d3748] border-gray-600 text-white focus:border-blue-500" : "focus:border-blue-500",
              footerActionText: darkMode ? "text-gray-300" : "text-gray-600",
              footerActionLink: "text-blue-500 hover:text-blue-600"
            }
          }}
        />
      </div>
    </div>
  );
}
