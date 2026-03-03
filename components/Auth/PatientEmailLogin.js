// import { auth, db } from '@lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

export default function PatientEmailLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    phone: '',
    age: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user exists in patients collection
      const patientDoc = await getDoc(doc(db, 'patients', user.uid));

      if (!patientDoc.exists()) {
        setError('Patient account not found. Please contact admin.');
        await auth.signOut();
        return;
      }

      toast.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!email || !password || !patientInfo.name || !patientInfo.phone) {
      setError('All fields are required for registration');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create patient document
      const patientData = {
        uid: user.uid,
        email: email,
        first: patientInfo.name.split(' ')[0] || '',
        last: patientInfo.name.split(' ').slice(1).join(' ') || '',
        number: patientInfo.phone,
        age: patientInfo.age,
        role: 'patient',
        createdAt: new Date(),
        updatedAt: new Date(),
        // Default values
        city: 'Not specified',
        state: 'Not specified',
        address: 'Not specified',
        gender: 'not-specified',
        bloodGroup: 'Not specified'
      };

      await setDoc(doc(db, 'patients', user.uid), patientData);
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full pt-2 px-4 md:py-4 flex-col justify-between">
      <h1 className="text-center font-extrabold text-gray6 dark:text-gray2 select-none text-2xl sm:text-4xl">
        Patient {isSignUp ? 'Registration' : 'Login'}
      </h1>

      <p className="text-center text-gray-500 mb-4">
        {isSignUp
          ? 'Create your patient account with email and password'
          : 'Login with your registered email and password'
        }
      </p>

      {error && (
        <div className="my-2 text-sm w-full border-red-500 border text-center border-solid text-red-500 py-2">
          {error}
        </div>
      )}

      <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
        {isSignUp && (
          <>
            <input
              type="text"
              value={patientInfo.name}
              onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
              placeholder="Full Name"
              className="input-field"
              required
            />
            <input
              type="tel"
              value={patientInfo.phone}
              onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
              placeholder="Phone Number"
              className="input-field"
              required
            />
            <input
              type="number"
              value={patientInfo.age}
              onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
              placeholder="Age"
              className="input-field"
              min="1"
              max="120"
              required
            />
          </>
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="input-field"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="input-field"
          minLength="6"
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 flex justify-center items-center text-center text-white font-bold py-2 px-4 w-full focus:outline-none focus:shadow-outline"
        >
          {isLoading && <FaSpinner className="animate-spin text-white mr-2" size={18} />}
          {!isLoading && (
            <span className="text-white cursor-pointer">
              {isSignUp ? 'Create Account' : 'Login'}
            </span>
          )}
        </button>
      </form>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
            setEmail('');
            setPassword('');
            setPatientInfo({ name: '', phone: '', age: '' });
          }}
          className="text-blue-500 hover:text-blue-700 underline"
        >
          {isSignUp
            ? 'Already have an account? Login here'
            : "Don't have an account? Register here"
          }
        </button>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
        <p className="text-xs text-yellow-800 dark:text-yellow-200">
          <strong>Note:</strong> This email-based authentication is an alternative to phone authentication
          to avoid Firebase billing requirements. All features remain the same.
        </p>
      </div>
    </div>
  );
}
