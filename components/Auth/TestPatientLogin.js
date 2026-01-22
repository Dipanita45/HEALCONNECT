import { auth, db } from '@lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';
import Link from 'next/link';

export default function TestPatientLogin() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const testLogin = async (e) => {
    e.preventDefault();
    
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if patient exists in database
      const patientDoc = await getDoc(doc(db, 'patients', `+91${phoneNumber}`));
      
      if (!patientDoc.exists()) {
        setError('Patient not found. Please create a test account first.');
        toast.error('Patient not found. Please create a test account first.');
        setIsLoading(false);
        return;
      }

      // Sign in anonymously to bypass phone auth billing requirement
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      // Link the anonymous user to the patient document
      await updateDoc(doc(db, 'patients', `+91${phoneNumber}`), {
        uid: user.uid,
        lastLogin: new Date()
      });

      toast.success('🎉 Test login successful! Redirecting to dashboard...');
      
      // Store patient info in localStorage for role checking
      localStorage.setItem('userRole', 'patient');
      localStorage.setItem('patientPhone', `+91${phoneNumber}`);

      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = '/patient/dashboard';
      }, 1500);

    } catch (error) {
      console.error('Test login error:', error);
      setError('Login failed: ' + error.message);
      toast.error('Login failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full pt-2 px-4 md:py-4 flex-col justify-between">
      <h1 className="text-center font-extrabold text-gray6 dark:text-gray2 select-none text-2xl sm:text-4xl">
        🧪 Test Patient Login
      </h1>
      
      <p className="text-center text-gray-500 mb-4">
        Bypass Firebase billing requirements for testing purposes
      </p>

      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>🔧 Test Mode:</strong> This bypasses Firebase phone authentication billing requirements. 
          Create a test account first using the test setup page or script.
        </p>
      </div>

      {error && (
        <div className="my-2 text-sm w-full border-red-500 border text-center border-solid text-red-500 py-2">
          {error}
        </div>
      )}

      <form onSubmit={testLogin} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
            Phone Number (10 digits)
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
              +91
            </span>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="1234567890"
              pattern="[0-9]{10}"
              maxLength="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white input-field"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-700 flex justify-center items-center text-center text-white font-bold py-2 px-4 w-full focus:outline-none focus:shadow-outline rounded-md"
        >
          {isLoading && <FaSpinner className="animate-spin text-white mr-2" size={18} />}
          {!isLoading && (
            <span className="text-white cursor-pointer">
              🧪 Test Login (No SMS Required)
            </span>
          )}
        </button>
      </form>

   <div className="mt-4 space-y-2">
  <div className="text-center">
    <Link
      href="/test-setup"
      className="text-blue-500 hover:text-blue-700 underline text-sm"
    >
      📝 Create Test Account First
    </Link>
  </div>
  
  <div className="text-center">
          <button
            type="button"
            onClick={() => window.location.href = '/login'}
            className="text-gray-500 hover:text-gray-700 underline text-sm"
          >
            ← Back to Normal Login
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
          📋 Testing Steps:
        </h3>
        <ol className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
          <li>1. Visit <code>/test-setup</code> to create a test account</li>
          <li>2. Use the same phone number here to login</li>
          <li>3. Access all patient features without SMS billing</li>
          <li>4. Test Doctor Finder, Dashboard, and Arduino integration</li>
        </ol>
      </div>
    </div>
  );
}
