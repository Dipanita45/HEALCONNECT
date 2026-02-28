# HEALCONNECT Local Environment Setup Guide

Welcome to the development guide for HEALCONNECT. This document aims to get you from cloning the repository to running the full-stack Next.js and Firebase application on your local machine.

---

## 1. Prerequisites

Before you start, ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v16.x or higher)
* [npm](https://www.npmjs.com/) (usually bundled with Node.js) or [Yarn](https://yarnpkg.com/)
* [Git](https://git-scm.com/)
* A text editor (we recommend [VS Code](https://code.visualstudio.com/))
* A Google Account (to configure a Firebase project)

---

## 2. Setting Up Your Local Project

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Dipanita45/HEALCONNECT.git
   cd HEALCONNECT
   ```

2. **Install all Node dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

---

## 3. Configuring Firebase (Backend Services)

HEALCONNECT relies on Firebase for Authentication and Firestore. To run it locally, you must provide your own set of Firebase config keys.

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a **New Project**.
2. Within your Firebase project, enable **Authentication** (specifically Email/Password sign-in).
3. Under the **Build** menu, create a **Firestore Database** in test mode.
4. Go to **Project Settings -> General** and add a new **Web App**.
5. Note the keys provided in the `firebaseConfig` section.

Create a `.env.local` file in the root of your HEALCONNECT project, and populate it with your keys:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-app-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-app.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

> ⚠️ **IMPORTANT**: Never commit `.env.local` to version control! The `.gitignore` is configured to ignore it automatically.

---

## 4. Initializing Firestore Schema (Optional)
On the very first run, your Firestore DB will be empty. The app is built to gracefully handle missing collections by creating default documents as users log in. 

To seed test data:
1. Start the app (see step 5).
2. Register a new user using the `/signup` route.
3. Your Firebase Auth and `users` Firestore collection will automatically populate.

---

## 5. Running the Application

Once your `.env.local` runs, start the Next.js development server:

```bash
npm run dev
# or 
yarn dev
```

Your terminal will show:
```bash
ready - started server on http://localhost:3000
```

1. Open your browser to `http://localhost:3000`.
2. You will see the main landing page.
3. Test your Firebase configuration by attempting to Create an Account.

---

## 6. Admin vs Doctor Roles (Development)

By default, any user registering via the website becomes a `patient` role. 
To gain access to the `/admin/dashboard` or `/doctor/dashboard`:
1. Log into your Firebase Console website.
2. Go to **Firestore Database** -> `users` collection.
3. Find your user's Document ID.
4. Manually edit the `role` field from `patient` to `admin` or `doctor`.
5. Refresh your local webpage.

---

## 7. Creating a Production Build

When you are ready to check the compiled PWA logic before making a Pull Request:
*(Note: Do not ignore warnings! PRs that break the React build will not be merged).*

```bash
npm run lint    # Check for ESLint warnings
npm run build   # Compiles all Next.js static and server routes
npm run start   # Runs the compiled bundle on port 3000
```
