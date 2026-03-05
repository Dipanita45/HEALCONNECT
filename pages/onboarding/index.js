import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useTheme } from "@/context/ThemeContext";
import styles from "../login.module.css";

export default function OnboardingPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const { theme } = useTheme();
    const darkMode = theme === 'dark';

    const [role, setRole] = useState("patient");
    const [adminCode, setAdminCode] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // If user is not logged in at all, redirect to signup
    useEffect(() => {
        if (isLoaded && !user) {
            router.push("/signup");
        }

        // If they already have a role set in metadata, redirect them to their dashboard
        if (isLoaded && user && user.publicMetadata?.role) {
            const userRole = user.publicMetadata.role;

            // Sync legacy state for background consistency
            if (typeof window !== "undefined") {
                localStorage.setItem("userType", userRole);
                localStorage.setItem("userId", user.id);
                localStorage.setItem(
                    "username",
                    user.username || user.primaryEmailAddress?.emailAddress?.split("@")[0] || "User"
                );
            }

            router.replace(`/${userRole}`);
        }
    }, [isLoaded, user, router]);

    const handleRoleSelect = async (selectedRole) => {
        setRole(selectedRole);

        // If admin, we just set the role and wait for them to enter the code and click continue
        if (selectedRole === 'admin') {
            return;
        }

        // For patient/doctor, submit instantly
        await submitRole(selectedRole, "");
    };

    const submitRole = async (selectedRole, code) => {
        if (!user) return;

        setError("");
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/auth/onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    role: selectedRole,
                    adminCode: code
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Something went wrong.");
                setIsSubmitting(false);
                return;
            }

            // Sync to localStorage for legacy components to work immediately after redirect
            if (typeof window !== "undefined") {
                localStorage.setItem("userType", selectedRole);
                localStorage.setItem("userId", user.id);
                localStorage.setItem(
                    "username",
                    user.username || user.primaryEmailAddress?.emailAddress?.split("@")[0] || "User"
                );
            }

            // Force clerk to reload the token so publicMetadata is available immediately
            try {
                await user.reload();
                // Add a small artificial delay to ensure Clerk's internal state catch up
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (reloadErr) {
                console.error("User reload failed:", reloadErr);
            }

            // Use window.location as a fallback to ensure absolute clean state if router fails
            router.push(`/${selectedRole}`);
        } catch (err) {
            console.error("Onboarding error:", err);
            setError("An error occurred saving your profile. Please try again.");
            setIsSubmitting(false);
        }
    };

    const handleCompleteOnboarding = async (e) => {
        e.preventDefault();

        if (role === 'admin' && !adminCode) {
            setError("Admin Code required for administrator role.");
            return;
        }

        await submitRole(role, adminCode);
    };

    if (!isLoaded || !user) return null;

    return (
        <div style={{
            minHeight: "calc(100vh - 80px)",
            display: "flex", justifyContent: "center", alignItems: "center",
            background: darkMode ? "#0d1b2a" : "#f8f9fa",
            padding: "20px", marginTop: "0px",
            overflow: "hidden", position: "relative",
        }}>
            {/* Background Match */}
            <div className={styles.backgroundElements}>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className={styles.circleElement} style={{
                        background: darkMode
                            ? "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)"
                            : "linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)"
                    }}></div>
                ))}
            </div>

            <div style={{
                position: "relative", zIndex: 1, width: "100%", maxWidth: "450px",
                background: darkMode ? "#1b263b" : "linear-gradient(135deg, rgba(219, 234, 254, 0.8) 0%, rgba(191, 219, 254, 0.8) 100%)",
                borderRadius: "12px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                overflow: "hidden", border: darkMode ? "1px solid #2d3748" : "1px solid rgba(37, 99, 235, 0.2)",
            }}>
                <div style={{
                    padding: "24px", background: darkMode ? "#1565c0" : "#1976d2", color: "white", textAlign: "center",
                }}>
                    <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>Complete Your Profile</h2>
                    <p style={{ margin: "8px 0 0", fontSize: "14px", opacity: 0.9 }}>Select your account type</p>
                </div>

                <div style={{ padding: "24px" }}>
                    <form onSubmit={handleCompleteOnboarding}>
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                display: "block", marginBottom: "8px", color: darkMode ? "#e2e8f0" : "#4a5568", fontSize: "14px", fontWeight: "600",
                            }}>
                                SELECT YOUR ROLE
                            </label>
                            <div style={{ display: "flex", gap: "8px", flexWrap: 'wrap' }}>
                                <button
                                    type="button"
                                    onClick={() => handleRoleSelect("patient")}
                                    disabled={isSubmitting}
                                    style={{
                                        flex: 1, minWidth: '100px', padding: "12px",
                                        background: role === "patient" ? (darkMode ? "#1565c0" : "#1976d2") : (darkMode ? "#2d3748" : "#f7fafc"),
                                        color: role === "patient" ? "white" : (darkMode ? "#e2e8f0" : "#4a5568"),
                                        border: role === "patient" ? "none" : (darkMode ? "1px solid #4a5568" : "1px solid #e2e8f0"),
                                        borderRadius: "6px", cursor: isSubmitting ? "not-allowed" : "pointer", fontSize: "14px", fontWeight: role === "patient" ? "600" : "500",
                                        opacity: isSubmitting && role !== "patient" ? 0.5 : 1
                                    }}
                                >
                                    {isSubmitting && role === "patient" ? "Saving..." : "Patient"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRoleSelect("doctor")}
                                    disabled={isSubmitting}
                                    style={{
                                        flex: 1, minWidth: '100px', padding: "12px",
                                        background: role === "doctor" ? (darkMode ? "#1565c0" : "#1976d2") : (darkMode ? "#2d3748" : "#f7fafc"),
                                        color: role === "doctor" ? "white" : (darkMode ? "#e2e8f0" : "#4a5568"),
                                        border: role === "doctor" ? "none" : (darkMode ? "1px solid #4a5568" : "1px solid #e2e8f0"),
                                        borderRadius: "6px", cursor: isSubmitting ? "not-allowed" : "pointer", fontSize: "14px", fontWeight: role === "doctor" ? "600" : "500",
                                        opacity: isSubmitting && role !== "doctor" ? 0.5 : 1
                                    }}
                                >
                                    {isSubmitting && role === "doctor" ? "Saving..." : "Doctor"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRoleSelect("admin")}
                                    disabled={isSubmitting}
                                    style={{
                                        flex: 1, minWidth: '100px', padding: "12px",
                                        background: role === "admin" ? (darkMode ? "#b91c1c" : "#dc2626") : (darkMode ? "#2d3748" : "#f7fafc"),
                                        color: role === "admin" ? "white" : (darkMode ? "#e2e8f0" : "#4a5568"),
                                        border: role === "admin" ? "none" : (darkMode ? "1px solid #4a5568" : "1px solid #e2e8f0"),
                                        borderRadius: "6px", cursor: isSubmitting ? "not-allowed" : "pointer", fontSize: "14px", fontWeight: role === "admin" ? "600" : "500",
                                        opacity: isSubmitting && role !== "admin" ? 0.5 : 1
                                    }}
                                >
                                    Admin
                                </button>
                            </div>
                        </div>

                        {role === "admin" && (
                            <div style={{ marginBottom: "16px" }}>
                                <label style={{
                                    display: "block", marginBottom: "6px", color: darkMode ? "#e2e8f0" : "#4a5568", fontSize: "13px", fontWeight: "600",
                                }}>
                                    ADMIN CODE
                                </label>
                                <input
                                    type="password"
                                    value={adminCode}
                                    onChange={(e) => { setAdminCode(e.target.value); setError(""); }}
                                    style={{
                                        width: "100%", padding: "10px",
                                        border: darkMode ? "1px solid #4a5568" : "1px solid #e2e8f0",
                                        borderRadius: "6px", background: darkMode ? "#2d3748" : "#f7fafc",
                                        color: darkMode ? "#ffffff" : "#2d3748", fontSize: "14px", outline: "none",
                                    }}
                                    required
                                />
                            </div>
                        )}

                        {error && (
                            <div style={{ padding: "12px", background: "#fed7d7", border: "1px solid #feb2b2", borderRadius: "6px", color: "#c53030", fontSize: "14px", marginBottom: "16px" }}>
                                {error}
                            </div>
                        )}

                        {role === "admin" && (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                    width: "100%", padding: "14px",
                                    background: isSubmitting ? "#a0aec0" : (darkMode ? "#1565c0" : "#1976d2"),
                                    color: "white", border: "none", borderRadius: "6px", cursor: isSubmitting ? "not-allowed" : "pointer",
                                    fontSize: "15px", fontWeight: "600",
                                }}
                            >
                                {isSubmitting ? "Saving..." : "Continue"}
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
