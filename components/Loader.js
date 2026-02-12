// Loading Spinner
import React from 'react';
import { FaSpinner, FaStethoscope, FaHeartbeat, FaSyringe, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function Loader({
  show = true,
  variant = 'default',
  size = 40,
  className = '',
  status = 'loading', // 'loading' | 'success' | 'error'
}) {
  if (!show) return null;

  const baseWrapper = 'h-full w-full flex items-center justify-center object-center align-middle';

  const colorMap = {
    default: 'text-green-500',
    stethoscope: 'text-teal-600',
    heartbeat: 'text-red-500',
    syringe: 'text-indigo-600',
    success: 'text-emerald-500',
    error: 'text-rose-500',
  };

  const animMap = {
    default: 'animate-spin',
    stethoscope: 'animate-bounce',
    heartbeat: 'animate-pulse',
    syringe: 'animate-spin',
  };

  const commonBase = `text-center object-center align-middle ${className}`;

  // Success / Error states override the icon and add micro-interactions
  if (status === 'success') {
    return (
      <main className={baseWrapper}>
        <FaCheckCircle
          className={`${commonBase} ${colorMap.success} transform transition duration-300 ease-out scale-110`}
          size={size}
        />
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className={baseWrapper}>
        <FaTimesCircle
          className={`${commonBase} ${colorMap.error} transform transition duration-300 ease-out animate-pulse`}
          size={size}
        />
      </main>
    );
  }

  const commonClasses = ` ${colorMap[variant] || colorMap.default} ${animMap[variant] || animMap.default} ${commonBase}`;

  let Icon = FaSpinner;
  if (variant === 'stethoscope') Icon = FaStethoscope;
  if (variant === 'heartbeat') Icon = FaHeartbeat;
  if (variant === 'syringe') Icon = FaSyringe;

  return (
    <main className={baseWrapper}>
      <Icon className={commonClasses} size={size} />
    </main>
  );
}
