import { createContext } from "react";

export const UserContext = createContext({
  user: null,
  setUser: () => { },
  userRole: null,
  setUserRole: () => { },
  currentUser: null,
  setCurrentUser: () => { },
  isUserLoading: false,
});
