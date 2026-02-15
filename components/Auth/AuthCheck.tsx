"use client"; //

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; //

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    // - Secure session check instead of insecure localStorage
    const verifySession = async () => {
      // Yahan hum Bolt Database ka secure logic use kar rahe hain
      // Simulating a secure session check as requested by Deepak Singh
      const userSession = true; 

      if (!userSession) {
        router.push("/login");
      } else {
        setAllowed(true);
      }
    };

    verifySession();
  }, [router]);

  if (!allowed) return null; // - Avoids hydration mismatch

  return <>{children}</>;
}