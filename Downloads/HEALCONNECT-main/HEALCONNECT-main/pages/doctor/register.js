import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { doctorRegistrationSchema } from '../../lib/schemas';
// Import your Firebase or API logic here
// import { registerDoctor } from '../../lib/addDoctor';

const DoctorRegister = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(doctorRegistrationSchema),
  });

  const [submitError, setSubmitError] = useState('');

  const onSubmit = async (data) => {
    setSubmitError('');
    try {
      // await registerDoctor(data);
      // router.push('/doctor/dashboard');
      console.log('Form Data:', data);
      alert('Registration successful! (Implement backend logic)');
    } catch (err) {
      setSubmitError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Doctor Registration</h2>
        {submitError && <div className="text-red-500 mb-4">{submitError}</div>}

        <div className="mb-4">
          <input
            type="text"
            placeholder="Full Name"
            {...register('name')}
            className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            {...register('email')}
            className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            {...register('password')}
            className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Specialization"
            {...register('specialization')}
            className={`w-full p-2 border rounded ${errors.specialization ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization.message}</p>}
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Medical License Number"
            {...register('license')}
            className={`w-full p-2 border rounded ${errors.license ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.license && <p className="text-red-500 text-sm mt-1">{errors.license.message}</p>}
        </div>

        <div className="mb-4">
          <input
            type="tel"
            placeholder="Phone Number"
            {...register('phone')}
            className={`w-full p-2 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default DoctorRegister;
