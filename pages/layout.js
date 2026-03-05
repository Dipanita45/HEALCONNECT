'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";

export default function Layout({ children }) {
  const router = useRouter();
  const pathname = router.pathname;
  const { user, isLoaded } = useUser();
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
    if (!mounted || !isLoaded) return; // Wait for auth to load

    const userRole = user?.publicMetadata?.role || null;

    // SECURITY: userRole comes from Clerk metadata
    const publicPages = [
      "/",
      "/login",
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
      "/feedback",
      "/onboarding"
    ];

    const currentPath = pathname || "";

    const isPublicPage = publicPages.includes(currentPath) ||
      currentPath.startsWith("/login");

    // Redirect if not logged in and trying to access protected pages
    if (!user && !isPublicPage) {
      router.replace("/login");
      return;
    }

    // 🛡️ RBAC: Role-Based Access Control
    if (userRole) {
      // Protect Admin Routes
      if (currentPath.startsWith("/admin") && userRole !== "admin") {
        if (userRole === "doctor") router.replace("/doctor/dashboard");
        else if (userRole === "patient") router.replace("/patient/dashboard");
        else router.replace("/login");
        return;
      }

      // Protect Doctor Routes
      if (currentPath.startsWith("/doctor") && userRole !== "doctor") {
        if (userRole === "patient") router.replace("/patient/dashboard");
        else if (userRole === "admin") router.replace("/admin/dashboard");
        else router.replace("/login");
        return;
      }

      // Protect Patient Routes
      if (currentPath.startsWith("/patient") && userRole !== "patient") {
        if (userRole === "doctor") router.replace("/doctor/dashboard");
        else if (userRole === "admin") router.replace("/admin/dashboard");
        else router.replace("/login");
        return;
      }
    }

    // If fully logged in, but NO role yet, force them to onboarding (unless they are already on it)
    if (user && !userRole && currentPath !== "/onboarding" && !currentPath.startsWith("/login")) {
      router.replace("/onboarding");
      return;
    }

    // Redirect logged-in users from login page or root
    if (userRole && (currentPath.startsWith("/login") || currentPath === "/")) {
      router.replace(`/${userRole}/dashboard`);
      return;
    }
  }, [mounted, isLoaded, user, router, pathname]);

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