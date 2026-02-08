'use client'

import { useTheme } from '@/context/ThemeContext'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'

/**
 * ThemeToggle Component
 * Provides a button to toggle between light and dark themes
 * 
 * Features:
 * - Smooth transitions between themes
 * - Proper ARIA labels for accessibility
 * - Keyboard accessible (Enter/Space to toggle)
 * - Respects prefers-reduced-motion
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  if (!theme) {
    // Prevent rendering until theme is initialized (avoids hydration mismatch)
    return null
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        theme-toggle-button 
        p-2 rounded-full 
        transition-all duration-300 ease-in-out
        hover:bg-gray-200 dark:hover:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-blue-500 dark:focus:ring-offset-gray-900
        active:scale-95
        motion-safe:transition-all motion-reduce:transition-none
      `}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-pressed={theme === 'dark'}
      title={`Current mode: ${theme}. Click to toggle.`}
    >
      {theme === 'dark' ? (
        <SunIcon 
          className="w-5 h-5 text-yellow-400 motion-safe:animate-spin" 
          aria-hidden="true"
        />
      ) : (
        <MoonIcon 
          className="w-5 h-5 text-gray-700 dark:text-gray-300" 
          aria-hidden="true"
        />
      )}
    </button>
  )
}