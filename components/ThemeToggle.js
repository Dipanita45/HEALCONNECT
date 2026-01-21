'use client'
import { useTheme } from '@/context/ThemeContext'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full focus:outline-none transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? (
        <SunIcon className="w-5 h-5 text-yellow-300" />
      ) : (
        <MoonIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  )
}