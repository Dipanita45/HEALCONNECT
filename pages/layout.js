'use client'

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
  const pathname = router.pathname;
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
    const publicPages = ["/", "/login", "/signup", "/signup-test", "/faq", "/contact", "/about", "/privacy", "/terms", "/how-it-works", "/open-source", "/support"];

    // Convert pathname to string for comparison
    const currentPath = pathname || "";

    // Redirect if not logged in and trying to access protected pages
    if (!userType && !publicPages.includes(currentPath)) {
      router.replace("/login");
      return;
    }

    // Redirect logged-in users from login page
    if (userType && currentPath === "/login") {
      if (userType === "doctor") router.replace("/doctor/dashboard");
      if (userType === "patient") router.replace("/patient/dashboard");
      return;
    }

    // Redirect from root if logged in
    if (userType && currentPath === "/") {
      if (userType === "doctor") router.replace("/doctor/dashboard");
      if (userType === "patient") router.replace("/patient/dashboard");
    }
  }, [mounted, router, pathname]); // Add pathname to dependencies

  if (!mounted) return null; // Prevent server/client mismatch

  return (
    <>
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white text-center py-2 px-4 z-50">
          You are offline – showing last cached data.
        </div>
      )}
      {/* Wrap children in a provider or pass offline data if needed */}
      <div className="min-h-screen">{children}</div>
    </>
  );
}