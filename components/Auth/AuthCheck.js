// components/Auth/AuthCheck.js
import { useRouter } from "next/router";
import { useEffect, useContext } from "react";
import Loader from "@components/Loader";
import { UserContext } from "@lib/context";

export default function AuthCheck({ children } = {}) {
  const router = useRouter();
  const { userRole, isUserLoading } = useContext(UserContext);

  useEffect(() => {
    if (!isUserLoading && !userRole) {
      router.push("/login");
    }
  }, [userRole, isUserLoading, router]);

  if (isUserLoading || !userRole) {
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
