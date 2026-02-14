import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';
import { auth, db } from '../../lib/firebase'; // adjust path if needed

export default function PatientEmailLogin() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleLogin = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const patientDoc = await getDoc(doc(db, 'patients', userCredential.user.uid));

      if (!patientDoc.exists()) {
        setError('Patient account not found. Contact admin.');
        await auth.signOut();
        return;
      }

      toast.success('Login successful!');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredential.user;

      const patientData = {
        uid: user.uid,
        email: data.email,
        first: data.name?.split(' ')[0] || '',
        last: data.name?.split(' ').slice(1).join(' ') || '',
        number: data.phone,
        age: data.age,
        role: 'patient',
        createdAt: new Date(),
        updatedAt: new Date(),
        city: 'Not specified',
        state: 'Not specified',
        address: 'Not specified',
        gender: 'not-specified',
        bloodGroup: 'Not specified',
      };

      await setDoc(doc(db, 'patients', user.uid), patientData);

      toast.success('Account created successfully!');
      setIsSignUp(false);
      reset();
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full pt-2 px-4 md:py-4 flex-col">
      <h1 className="text-center font-extrabold text-2xl sm:text-4xl">
        Patient {isSignUp ? 'Registration' : 'Login'}
      </h1>

      {error && (
        <div className="my-2 text-sm border border-red-500 text-center text-red-500 py-2">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit(isSignUp ? handleSignUp : handleLogin)}
        className="space-y-4"
      >
        {isSignUp && (
          <>
            <input
              placeholder="Full Name"
              className="input-field"
              {...register('name', { required: 'Name required' })}
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}

            <input
              placeholder="Phone Number"
              className="input-field"
              {...register('phone', {
                required: 'Phone required',
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: 'Enter valid Indian phone number',
                },
              })}
            />
            {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}

            <input
              type="number"
              placeholder="Age"
              className="input-field"
              {...register('age', {
                required: 'Age required',
                min: 1,
                max: 120,
              })}
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          className="input-field"
          {...register('email', {
            required: 'Email required',
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: 'Invalid email',
            },
          })}
        />

        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          className="input-field"
          {...register('password', {
            required: 'Password required',
            minLength: {
              value: 6,
              message: 'Minimum 6 characters',
            },
          })}
        />

        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 flex justify-center items-center text-white font-bold py-2 px-4 w-full"
        >
          {isLoading ? (
            <FaSpinner className="animate-spin mr-2" size={18} />
          ) : (
            <span>{isSignUp ? 'Create Account' : 'Login'}</span>
          )}
        </button>
      </form>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
            reset();
          }}
          className="text-blue-500 underline"
        >
          {isSignUp
            ? 'Already have an account? Login'
            : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
}
