import { useRouter } from "next/router";
import React from "react";

export default function IndexAuthCheck({ children } = {}) {
  const router = useRouter();

  const SignOutNow = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("username");
    router.push("/login");
  };

  const userType = typeof window !== 'undefined' ? localStorage.getItem("userType") : null;

  if (!userType) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>You Don't Have Access!</h2>
        <p>Dashboard can only be accessed by Legitimate User.</p>
        <button onClick={() => router.push("/login")} style={{ marginRight: "1rem" }}>
          Go to Dashboard
        </button>
        <button onClick={SignOutNow}>Sign Out</button>
      </div>
    );
  }

  return <>{children}</>;
}
