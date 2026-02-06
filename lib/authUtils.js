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
  // Clear localStorage
  localStorage.removeItem('userType')
  localStorage.removeItem('username')
  
  // Clear React state immediately for UI update
  setUser(null)
  setUserRole(null)
  setCurrentUser(null)
}
