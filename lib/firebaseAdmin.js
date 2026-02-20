
import admin from 'firebase-admin';

// Helper to create a dummy admin object with minimal API that throws useful errors
function createDummyAdmin() {
  const message = 'Firebase Admin SDK not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY environment variables.';
  const thrower = () => { throw new Error(message); };
  return {
    auth: () => ({ verifyIdToken: async () => { thrower(); } }),
    firestore: () => ({ collection: () => { thrower(); } }),
    initializeApp: () => { thrower(); },
    apps: [],
  };
}

const hasCredentials = !!(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);

let adminInstance;

if (hasCredentials) {
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Replace escaped newlines in private key
          privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
        }),
      });
    } catch (error) {
      console.error('Firebase admin initialization error', error);
    }
  }
  adminInstance = admin;
} else {
  adminInstance = createDummyAdmin();
}

export default adminInstance;
