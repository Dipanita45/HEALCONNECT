// lib/auth.js
export function login(userType, username, password) {
	// Dummy authentication logic
	// Eventually, replace with your server endpoint call
	if (
		(userType === "doctor" && username === "doctor1" && password === "pass") ||
		(userType === "patient" && username === "patient1" && password === "pass")
	) {
		localStorage.setItem("userType", userType);
		localStorage.setItem("username", username);
		return true;
	}
	return false;
}

export function logout() {
	localStorage.removeItem("userType");
	localStorage.removeItem("username");
}

export function getUserType() {
	return localStorage.getItem("userType");
}
