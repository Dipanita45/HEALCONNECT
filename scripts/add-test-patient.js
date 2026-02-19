// Test script to add a patient for testing purposes
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDBKubwqUBiiOrapLr-_Rr_dA24Z_fw7yU",
  authDomain: "health-monitoring-system-7885c.firebaseapp.com",
  projectId: "health-monitoring-system-7885c",
  storageBucket: "health-monitoring-system-7885c.appspot.com",
  messagingSenderId: "488459224908",
  appId: "1:488459224908:web:5147e63edbdf45504d71e9",
  measurementId: "G-3DMC0WV2M5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addTestPatient() {
  // Use a test phone number that you'll configure in Firebase Console
  const phoneNumber = "1234567890"; // This should match your Firebase test number

  console.log("🔧 Creating test patient account for Firebase test number...");
  console.log("📝 Make sure to add this number as a test number in Firebase Console");
  console.log("🎯 Firebase Console → Authentication → Sign-in method → Phone → Test phone numbers");

  const patientData = {
    // Personal Information
    first: "Test",
    middle: "User",
    last: "Patient",
    aadhar: "123456789012",
    dob: "1990-01-01T00:00:00.000Z",
    gender: "male",
    married: "no",

    // Contact Information
    number: `+91${phoneNumber}`,
    email: "test.patient@example.com",

    // Address Information
    address: "Test Address",
    city: "Mumbai",
    state: "Maharashtra",
    pin: "400001",

    // Health Information
    height: "170",
    weight: "70",
    bloodGroup: "O+",

    // System Information
    role: "patient",
    uid: `test-patient-${phoneNumber}`, // Test UID for bypassing auth
    createdAt: new Date(),
    updatedAt: new Date(),

    // Doctor Assignment (optional)
    assignedDoctor: "test-doctor-id"
  };

  try {
    const docRef = doc(db, "patients", `+91${phoneNumber}`);
    await setDoc(docRef, patientData);
    console.log("✅ Test patient added successfully!");
    console.log(`📱 Phone number: +91${phoneNumber}`);
    console.log("🔑 Add this as a test number in Firebase Console");
    console.log("📋 Recommended verification code: 123456");
    console.log("🌐 Then login normally using the original authentication system");
  } catch (error) {
    console.error("❌ Error adding test patient:", error);
  }
}

addTestPatient();
