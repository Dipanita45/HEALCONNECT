import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function getUserType() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userType");
  }
  return null;
}

export default function Layout({ children }) {
  const router = useRouter();
  const [isOffline, setIsOffline] = useState(false);
  const [mounted, setMounted] = useState(false); // Track client mounting

  useEffect(() => {
    setMounted(true); // Now safe to access window
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const userType = getUserType();
    const publicPages = ["/", "/login"];

    // Redirect if not logged in and trying to access protected pages
    if (!userType && !publicPages.includes(router.pathname)) {
      router.replace("/login");
      return;
    }

    // Redirect logged-in users from login page
    if (userType && router.pathname === "/login") {
      if (userType === "doctor") router.replace("/doctor/dashboard");
      if (userType === "patient") router.replace("/patient/dashboard");
      return;
    }

    // Redirect from root if logged in
    if (userType && router.pathname === "/") {
      if (userType === "doctor") router.replace("/doctor/dashboard");
      if (userType === "patient") router.replace("/patient/dashboard");
    }
  }, [mounted, router.pathname]);

  if (!mounted) return null; // Prevent server/client mismatch

  return (
    <>
      {isOffline && (
        <div style={{
          position: "fixed",
          top: 0,
          width: "100%",
          background: "#ff9800",
          color: "white",
          textAlign: "center",
          padding: "0.5rem",
          zIndex: 1000,
        }}>
          You are offline – showing last cached data.
        </div>
      )}
      {/* Wrap children in a provider or pass offline data if needed */}
      <div>{children}</div>
    </>
  );
}
