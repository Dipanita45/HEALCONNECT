import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';
import {
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from '../../lib/firebase'; // adjust path if needed

export default function PatientLoginPage() {
  const [verificationId, setVerificationId] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const signInWithPhone = async (data) => {
    const phoneNumber = data.phone;

    try {
      setIsLoading(true);

      const docRef = doc(db, 'patients', `+91${phoneNumber}`);
      const docSnap = await getDoc(docRef);

      const collectionRef = collection(db, 'patients');
      const q = query(collectionRef, where('number', '==', `+91${phoneNumber}`));
      const snapshotQuery = await getDocs(q);

      if (snapshotQuery.size > 0 || docSnap.exists()) {
        const applicationVerifier = new RecaptchaVerifier(
          'sign-in-button',
          { size: 'invisible' },
          auth
        );

        const provider = new PhoneAuthProvider(auth);
        const vId = await provider.verifyPhoneNumber(
          `+91${phoneNumber}`,
          applicationVerifier
        );

        setVerificationId(vId);
        toast.success('OTP sent successfully');
        setShowOtpInput(true);
      } else {
        toast.error('Please authorize your number first.');
        setError('Please authorize your number first.');
      }
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const verify = async (data) => {
    try {
      setIsLoading(true);

      const authCredential = PhoneAuthProvider.credential(
        verificationId,
        data.otp
      );

      const userCredential = await signInWithCredential(auth, authCredential);

      const userUID = userCredential.user.uid;
      const ref = doc(db, 'patients', `+91${getValues('phone')}`);
      await updateDoc(ref, { uid: userUID });

      toast.success('Login successful!');
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(showOtpInput ? verify : signInWithPhone)}
      className="flex w-full pt-2 px-4 md:py-4 h-96 flex-col justify-between"
    >
      <h1 className="text-center font-extrabold text-gray6 dark:text-gray2 text-2xl sm:text-4xl">
        Patient Login
      </h1>

      <p>Login using your registered mobile number.</p>

      {/* Error Message */}
      {(error || errors.phone || errors.otp) && (
        <div className="my-2 text-sm border border-red-500 text-center text-red-500 py-2">
          {error || errors.phone?.message || errors.otp?.message}
        </div>
      )}

      {/* Phone Input */}
      <input
        type="tel"
        placeholder="Enter phone number"
        className="input-field"
        {...register('phone', {
          required: 'Phone number required',
          pattern: {
            value: /^[6-9]\d{9}$/,
            message: 'Enter valid 10-digit Indian phone number',
          },
        })}
        disabled={showOtpInput}
      />

      {/* OTP Input */}
      {showOtpInput && (
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          className="input-field"
          {...register('otp', {
            required: 'OTP required',
            pattern: {
              value: /^\d{6}$/,
              message: 'Enter valid 6-digit OTP',
            },
          })}
        />
      )}

      <button
        type="submit"
        id="sign-in-button"
        className={`${
          showOtpInput ? 'bg-green-500' : 'bg-blue-500'
        } hover:bg-opacity-80 flex justify-center text-white font-bold py-2 px-4`}
      >
        {isLoading ? (
          <FaSpinner className="animate-spin text-white" size={22} />
        ) : (
          <span>
            {showOtpInput ? 'Verify OTP' : 'Request OTP'}
          </span>
        )}
      </button>
    </form>
  );
}
