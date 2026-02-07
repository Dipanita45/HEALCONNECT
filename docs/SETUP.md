# Developer Environment Setup Guide

This guide helps contributors set up a local development environment to test features that rely on Firebase Authentication and Firestore.

## Prerequisites

- Node.js (v16+)
- npm or yarn
- A [Firebase](https://firebase.google.com/) account (free tier is sufficient)

---

## Step 1: Create a Firebase Project

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **Add project** and follow the prompts.
3.  Once created, click **Add app** and select the **Web** platform (`</>`).
4.  Give it a nickname and click **Register app**.
5.  You will see your Firebase configuration object. Keep this page open.

---

## Step 2: Enable Authentication

1.  In your Firebase project console, go to **Build > Authentication**.
2.  Click **Get started**.
3.  Go to the **Sign-in method** tab.
4.  Enable **Email/Password** as a sign-in provider.

---

## Step 3: Set Up Firestore

1.  Go to **Build > Firestore Database**.
2.  Click **Create database**.
3.  Start in **test mode** for development (allows all reads/writes).
4.  Select a location and click **Done**.

### Create a Test User in Firestore

For login to work, you need a user document in the `users` collection.

1.  In Firestore, click **Start collection** and name it `users`.
2.  For the Document ID, you can use an auto-generated ID or the Firebase Auth UID (after creating a user in Authentication).
3.  Add the following fields:
    *   `email`: (string) e.g., `test@example.com`
    *   `fullName`: (string) e.g., `Test Doctor`
    *   `role`: (string) `doctor`, `patient`, or `admin`
    *   `speciality`: (string) e.g., `Cardiology`

---

## Step 4: Configure Environment Variables

1.  Copy `.env.example` to `.env.local` in the project root:
    ```bash
    cp .env.example .env.local
    ```
2.  Open `.env.local` and fill in the values from your Firebase config:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

---

## Step 5: Run the Application

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Testing Login

1.  Create a user in **Firebase Console > Authentication** with an email and password.
2.  Ensure a corresponding document exists in the `users` Firestore collection with the same `uid` as the Document ID.
3.  Navigate to `/login` and enter the email and password.

---

## Notes

-   **Do not commit your `.env.local` file.** It is already in `.gitignore`.
-   For production, ensure Firestore security rules are properly configured.
