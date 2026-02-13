// lib/authUtils.js
// Utility functions for managing user state in React Context.
// Note: We no longer persist auth state in localStorage.
// Firebase Auth handles session persistence.

/**
 * Updates the user state in React Context after successful login.
 * @param {Function} setUser - Setter for user object.
 * @param {Function} setUserRole - Setter for user role string.
 * @param {Function} setCurrentUser - Setter for detailed current user object.
 * @param {string} userType - The role of the user (e.g., 'doctor', 'patient').
 * @param {object} userData - The user data object from Firestore.
 */
export const updateUserState = (setUser, setUserRole, setCurrentUser, userType, userData) => {
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
 * @param {Function} setUser - Setter for user object.
 * @param {Function} setUserRole - Setter for user role string.
 * @param {Function} setCurrentUser - Setter for detailed current user object.
 */
export const clearUserState = (setUser, setUserRole, setCurrentUser) => {
	setUser(null);
	setUserRole(null);
	setCurrentUser(null);
};
