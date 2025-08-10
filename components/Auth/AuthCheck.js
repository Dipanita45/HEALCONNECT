// components/Auth/AuthCheck.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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

  if (!allowed) return null; // avoids rendering until check is done
  
  return <>{children}</>;
}
