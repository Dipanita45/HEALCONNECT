import { useState, useEffect } from "react";

export function useUserData() {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsUserLoading(true);
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.isAuthenticated && data.user) {
            setUser({ uid: data.user.userId });
            setCurrentUser({
              id: data.user.userId,
              email: data.user.email,
              role: data.user.role,
              username: data.user.username,
              fullName: data.user.fullName,
              ...data.user
            });
            setUserRole(data.user.role);
          } else {
            setUser(null);
            setCurrentUser(null);
            setUserRole(null);
          }
        } else {
          setUser(null);
          setCurrentUser(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error("Auth fetch error:", error);
        setUser(null);
        setCurrentUser(null);
        setUserRole(null);
      } finally {
        setIsUserLoading(false);
      }
    };

    fetchUser();
  }, []);

  return {
    user,
    setUser,
    currentUser,
    setCurrentUser,
    userRole,
    setUserRole,
    isUserLoading,
  };
}