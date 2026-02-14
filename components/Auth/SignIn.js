import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../lib/firebase'; // adjust path if needed

export default function SignIn() {
  const [confirmation, setConfirmation] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm();

  // Initialize recaptcha once
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
          callback: () => console.log('reCAPTCHA solved'),
          'expired-callback': () => window.recaptchaVerifier.reset(),
        },
        auth
      );
    }
  }, []);

  const sendOTP = async (data) => {
    try {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }

      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
          callback: () => console.log('reCAPTCHA solved'),
          'expired-callback': () => window.recaptchaVerifier.reset(),
        },
        auth
      );

      const formattedPhone = '+91' + data.phone;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier
      );

      setConfirmation(confirmationResult);
      alert('OTP sent successfully!');
    } catch (error) {
      alert('Error sending OTP: ' + error.message);
    }
  };

  const verifyOTP = async (data) => {
    try {
      await confirmation.confirm(data.otp);
      alert('Login successful!');
    } catch (error) {
      alert('Invalid OTP: ' + error.message);
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-3">Patient Login</h2>

      {/* Phone Form */}
      <form onSubmit={handleSubmit(sendOTP)}>
        <input
          type="text"
          placeholder="Enter 10-digit phone number"
          className="border px-2 py-1 w-full mb-1"
          maxLength={10}
          {...register('phone', {
            required: 'Phone number required',
            pattern: {
              value: /^[6-9]\d{9}$/,
              message: 'Enter valid Indian phone number'
            }
          })}
        />

        {errors.phone && (
          <p className="text-red-500 text-sm mb-2">
            {errors.phone.message}
          </p>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded w-full mb-3"
        >
          Send OTP
        </button>
      </form>

      {/* OTP Form */}
      {confirmation && (
        <form onSubmit={handleSubmit(verifyOTP)}>
          <input
            type="text"
            placeholder="Enter OTP"
            className="border px-2 py-1 w-full mb-1"
            maxLength={6}
            {...register('otp', {
              required: 'OTP required',
              minLength: {
                value: 6,
                message: 'OTP must be 6 digits'
              }
            })}
          />

          {errors.otp && (
            <p className="text-red-500 text-sm mb-2">
              {errors.otp.message}
            </p>
          )}

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-1 rounded w-full"
          >
            Verify OTP
          </button>
        </form>
      )}

      <div id="recaptcha-container"></div>
    </div>
  );
}
