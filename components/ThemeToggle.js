'use client'
import { useTheme } from '@/context/ThemeContext'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-button p-1.5 lg:p-1.5 xl:p-2 rounded-full focus:outline-none transition-colors hover:bg-gray-700 dark:hover:bg-gray-300"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? (
        <SunIcon className="w-4 h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5 text-yellow-300" />
      ) : (
        <MoonIcon className="w-4 h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5 text-gray-200 dark:text-gray-300" />
      )}
    </button>
  )
}