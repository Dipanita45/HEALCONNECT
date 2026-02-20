// Ensure a safe global `currentUser` exists for any non-module scripts
// This avoids ReferenceError when third-party code references `currentUser`.

// Use globalThis to be robust across environments
globalThis.currentUser = globalThis.currentUser || null;
