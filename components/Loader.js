// Enhanced Loading Spinner with Dark Theme Support
import React from 'react';
import { FaSpinner, FaStethoscope, FaHeartbeat, FaSyringe, FaCheckCircle, FaTimesCircle, FaHeart } from 'react-icons/fa';

export default function Loader({
  show = true,
  variant = 'default',
  size = 40,
  className = '',
  status = 'loading', // 'loading' | 'success' | 'error'
  darkMode = false,
}) {
  if (!show) return null;

  const baseWrapper = 'h-full w-full flex items-center justify-center object-center align-middle';
  
  // Enhanced color maps with dark theme support
  const colorMap = {
    light: {
      default: 'text-blue-500',
      stethoscope: 'text-teal-600',
      heartbeat: 'text-red-500',
      syringe: 'text-indigo-600',
      success: 'text-emerald-500',
      error: 'text-rose-500',
    },
    dark: {
      default: 'text-blue-400',
      stethoscope: 'text-teal-400',
      heartbeat: 'text-red-400',
      syringe: 'text-indigo-400',
      success: 'text-emerald-400',
      error: 'text-rose-400',
    }
  };

  const animMap = {
    default: 'animate-spin',
    stethoscope: 'animate-bounce',
    heartbeat: 'animate-pulse',
    syringe: 'animate-spin',
  };

  const commonBase = `text-center object-center align-middle ${className}`;
  const currentColors = darkMode ? colorMap.dark : colorMap.light;

  // Enhanced success state with dark theme
  if (status === 'success') {
    return (
      <main className={baseWrapper}>
        <div className="relative">
          <FaCheckCircle
            data-testid="FaCheckCircle"
            className={`${commonBase} ${currentColors.success} transform transition-all duration-500 ease-out scale-110 drop-shadow-lg`}
            size={size}
          />
          <div className={`absolute inset-0 ${currentColors.success} opacity-20 rounded-full animate-ping`} style={{ width: size, height: size }} />
        </div>
      </main>
    );
  }

  // Enhanced error state with dark theme
  if (status === 'error') {
    return (
      <main className={baseWrapper}>
        <div className="relative">
          <FaTimesCircle
            data-testid="FaTimesCircle"
            className={`${commonBase} ${currentColors.error} transform transition-all duration-500 ease-out animate-pulse drop-shadow-lg`}
            size={size}
          />
          <div className={`absolute inset-0 ${currentColors.error} opacity-20 rounded-full animate-pulse`} style={{ width: size, height: size }} />
        </div>
      </main>
    );
  }

  const commonClasses = ` ${currentColors[variant] || currentColors.default} ${animMap[variant] || animMap.default} ${commonBase} drop-shadow-md transition-all duration-300`;

  // Icon selection
  let Icon = FaSpinner;
  let iconTestId = 'FaSpinner';
  if (variant === 'stethoscope') {
    Icon = FaStethoscope;
    iconTestId = 'FaStethoscope';
  }
  if (variant === 'heartbeat') {
    Icon = FaHeartbeat;
    iconTestId = 'FaHeartbeat';
  }
  if (variant === 'syringe') {
    Icon = FaSyringe;
    iconTestId = 'FaSyringe';
  }

  return (
    <main className={baseWrapper}>
      <div className="relative">
        <Icon data-testid={iconTestId} className={commonClasses} size={size} />
        
        {/* Enhanced visual effects for dark theme */}
        {darkMode && (
          <>
            <div data-testid="dark-gradient" className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-pulse blur-xl" style={{ width: size * 1.5, height: size * 1.5, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
            <div data-testid="dark-gradient" className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-indigo-500/10 rounded-full animate-spin" style={{ width: size * 2, height: size * 2, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', animationDuration: '3s' }} />
          </>
        )}
        
        {/* Light theme effects */}
        {!darkMode && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-full animate-pulse blur-lg" style={{ width: size * 1.3, height: size * 1.3, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        )}
      </div>
    </main>
  );
}
