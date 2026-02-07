// lib/auth.js
// DEPRECATED: This file's utility functions are deprecated.
// Authentication is now handled via Firebase Auth.
// See docs/SETUP.md for how to configure Firebase.

import { signOut } from 'firebase/auth';
import { auth } from './firebase';

/**
 * Signs out the current user from Firebase.
 * @returns {Promise<void>}
 */
export async function logout() {
	await signOut(auth);
}
