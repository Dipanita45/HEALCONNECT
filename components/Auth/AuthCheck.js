// components/Auth/AuthCheck.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "@components/Loader";

export default function AuthCheck({ children } = {}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("userType");
      if (!role) router.push("/login");
      else setAllowed(true);
    }
  }, [router]);

  if (!allowed) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Loader variant="stethoscope" size={60} />
          <p className="text-gray-500 dark:text-gray-400 mt-4 font-semibold animate-pulse">
            Authenticating clinical session...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
