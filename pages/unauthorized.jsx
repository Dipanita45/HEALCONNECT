import React from 'react';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

export default function UnauthorizedPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  const role = user?.publicMetadata?.role;

  const getDashboardPath = (userRole) => {
    switch (userRole) {
      case 'admin':
        return '/admin/';
      case 'doctor':
        return '/doctor/';
      case 'patient':
        return '/patient/';
      default:
        return '/';
    }
  };

  const handleGoToDashboard = () => {
    if (role) {
      router.push(getDashboardPath(role));
    } else {
      router.push('/onboarding/');
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
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background shapes */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: "none"
      }}>
        <div style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: darkMode ? "rgba(239, 68, 68, 0.05)" : "rgba(239, 68, 68, 0.08)",
          filter: "blur(60px)",
        }} />
        <div style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: darkMode ? "rgba(37, 99, 235, 0.05)" : "rgba(37, 99, 235, 0.08)",
          filter: "blur(80px)",
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "480px",
          background: darkMode ? "rgba(27, 38, 59, 0.85)" : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
          borderRadius: "16px",
          boxShadow: darkMode ? "0 8px 32px rgba(0, 0, 0, 0.37)" : "0 8px 32px rgba(31, 38, 135, 0.07)",
          border: darkMode ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(37, 99, 235, 0.15)",
          padding: "40px 30px",
          textAlign: "center",
        }}
      >
        {/* Animated Shield Warning Icon */}
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1
          }}
          style={{
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: darkMode ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.1)",
            color: "#ef4444",
            marginBottom: "24px",
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </motion.div>

        <h1 style={{
          fontSize: "28px",
          fontWeight: "700",
          color: darkMode ? "#ffffff" : "#1e293b",
          margin: "0 0 8px 0",
        }}>
          Access Denied
        </h1>

        <p style={{
          fontSize: "14px",
          color: darkMode ? "#94a3b8" : "#64748b",
          fontWeight: "600",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          margin: "0 0 20px 0",
        }}>
          Error 403 • Forbidden
        </p>

        <div style={{
          height: "1px",
          background: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
          margin: "0 auto 24px auto",
          width: "80px",
        }} />

        <p style={{
          fontSize: "15px",
          lineHeight: "1.6",
          color: darkMode ? "#cbd5e1" : "#475569",
          margin: "0 0 30px 0",
        }}>
          You do not have the required authorization or role permissions to view the requested page.
        </p>

        {isLoaded && user && (
          <div style={{
            background: darkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
            border: darkMode ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(0, 0, 0, 0.05)",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "30px",
            display: "inline-block",
            width: "100%",
          }}>
            <p style={{
              margin: 0,
              fontSize: "13px",
              color: darkMode ? "#94a3b8" : "#64748b",
            }}>
              Logged in as: <strong style={{ color: darkMode ? "#fff" : "#000" }}>{user.primaryEmailAddress?.emailAddress}</strong>
            </p>
            <p style={{
              margin: "4px 0 0 0",
              fontSize: "13px",
              color: darkMode ? "#94a3b8" : "#64748b",
            }}>
              Account Role: <span style={{
                textTransform: "uppercase",
                fontWeight: "700",
                fontSize: "11px",
                padding: "2px 8px",
                borderRadius: "12px",
                background: role === 'admin' ? '#fee2e2' : role === 'doctor' ? '#dbeafe' : role === 'patient' ? '#dcfce7' : '#f1f5f9',
                color: role === 'admin' ? '#991b1b' : role === 'doctor' ? '#1e40af' : role === 'patient' ? '#166534' : '#475569',
                border: "1px solid transparent",
              }}>{role || 'None'}</span>
            </p>
          </div>
        )}

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}>
          {isLoaded && role ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoToDashboard}
              style={{
                width: "100%",
                padding: "12px 24px",
                background: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
                transition: "background 0.2s",
              }}
            >
              Go to {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
            </motion.button>
          ) : (
            isLoaded && user && !role && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/onboarding/')}
                style={{
                  width: "100%",
                  padding: "12px 24px",
                  background: "#166534",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(22, 101, 52, 0.2)",
                  transition: "background 0.2s",
                }}
              >
                Complete Onboarding
              </motion.button>
            )
          )}

          <div style={{
            display: "flex",
            gap: "12px",
          }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/')}
              style={{
                flex: 1,
                padding: "10px 16px",
                background: "transparent",
                color: darkMode ? "#ffffff" : "#475569",
                border: darkMode ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              Go to Homepage
            </motion.button>

            {isLoaded && user && (
              <SignOutButton signOutOptions={{ redirectUrl: '/' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    background: darkMode ? "rgba(239, 68, 68, 0.15)" : "#fef2f2",
                    color: "#ef4444",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                >
                  Sign Out
                </motion.button>
              </SignOutButton>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
