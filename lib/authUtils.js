// lib/authUtils.js

/**
 * Hashes a password using SHA-256 (Web Crypto API).
 * @param {string} password - The plain text password.
 * @returns {Promise<string>} - The hex string of the hashed password.
 */
export const hashPassword = async (password) => {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Updates the user state in React Context after successful login.
 * Using Firebase Auth as the source of truth.
 */
export const updateUserState = (setUser, setUserRole, setCurrentUser, userType, userData) => {
  // Application no longer persists auth in localStorage (relying on Firebase)

  setUser({ uid: userData.uid || 'firebase-user' });
  setUserRole(userType);
  setCurrentUser({
    id: userData.uid,
    name: userData.fullName || userData.name || userData.username,
    email: userData.email,
    phone: userData.phone,
    role: userType,
    ...userData,
  });
};

/**
 * Clears the user state in React Context after logout.
 * ensuring all potential legacy state is removed.
 */
export const clearUserState = (setUser, setUserRole, setCurrentUser) => {
  // Clear all user-related localStorage items to ensure clean state
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

  // Clear React state immediately for UI update
  setUser(null);
  setUserRole(null);
  setCurrentUser(null);
};
