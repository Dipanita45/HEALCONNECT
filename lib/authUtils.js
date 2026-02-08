// lib/authUtils.js
export const updateUserState = (setUser, setUserRole, setCurrentUser, userType, username) => {
  // Update localStorage
  localStorage.setItem('userType', userType)
  localStorage.setItem('username', username)

  // Update React state immediately for UI update
  setUser({ uid: 'local' }) // Set a mock user object
  setUserRole(userType)
  setCurrentUser({
    name: username,
    role: userType
  })
}

export const clearUserState = (setUser, setUserRole, setCurrentUser) => {
  // Clear all user-related localStorage items
  const itemsToClear = [
    'userType',
    'username',
    'currentUser',
    'registeredUsers',
    'patientsData',
    'userRole',
    'patientPhone'
  ];

  itemsToClear.forEach(item => localStorage.removeItem(item));

  // Preserve user preferences (theme)
  // 'theme' is intentionally NOT cleared

  // Clear React state immediately for UI update
  setUser(null);
  setUserRole(null);
  setCurrentUser(null);
}
