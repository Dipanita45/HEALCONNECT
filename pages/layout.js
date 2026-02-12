'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUserData } from "@lib/userInfo";

export default function Layout({ children }) {
  const router = useRouter();
  const pathname = router.pathname;
  const { userRole, isUserLoading } = useUserData(); // SECURITY: Use Firebase-verified role
  const [isOffline, setIsOffline] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    if (!mounted || isUserLoading) return; // Wait for auth to load

    // SECURITY: userRole comes from Firebase Auth + Firestore (verified in userInfo.js)
const publicPages = [
  "/",
  "/login",
  "/signup",
  "/signup-test",
  "/faq",
  "/contact",
  "/about",
  "/privacy",
  "/terms",
  "/how-it-works",
  "/open-source",
  "/support",
  "/appointments",
  "/monitoring",
  "/prescriptions",
  "/feedback"
];

    const currentPath = pathname || "";

    // Redirect if not logged in and trying to access protected pages
    if (!userRole && !publicPages.includes(currentPath)) {
      router.replace("/login");
      return;
    }

    // Redirect logged-in users from login page
    if (userRole && currentPath === "/login") {
      if (userRole === "doctor") router.replace("/doctor/dashboard");
      if (userRole === "patient") router.replace("/patient/dashboard");
      if (userRole === "admin") router.replace("/admin/dashboard");
      return;
    }

    // Redirect from root if logged in
    if (userRole && currentPath === "/") {
      if (userRole === "doctor") router.replace("/doctor/dashboard");
      if (userRole === "patient") router.replace("/patient/dashboard");
      if (userRole === "admin") router.replace("/admin/dashboard");
    }
  }, [mounted, isUserLoading, userRole, router, pathname]);

  if (!mounted) return null;

  return (
    <>
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white text-center py-2 px-4 z-50">
          You are offline – showing last cached data.
        </div>
      )}
      <div className="min-h-screen">{children}</div>
    </>
  );
}