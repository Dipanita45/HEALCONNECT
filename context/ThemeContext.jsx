'use client'

import { createContext, useContext, useEffect, useState } from 'react'

/**
 * ThemeContext for managing dark/light theme across the application
 * Handles:
 * - Theme persistence in localStorage
 * - System preference detection
 * - Hydration safety in Next.js
 * - Tailwind CSS dark class application
 */
export const ThemeContext = createContext()

/**
 * ThemeProvider Component
 * Wraps the application to provide theme context
 * Must be placed above components that use theme
 */
export function ThemeProvider({ children }) {
  // Initialize state with getter that checks both localStorage and system preference
  const [theme, setTheme] = useState('light')
  const [mounted, setMounted] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [supportWidgetOpen, setSupportWidgetOpen] = useState(false)

  /**
   * Initialize theme from localStorage or system preference
   * Runs only once on mount to avoid hydration mismatch
   */
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme')
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      // Priority: saved theme > system preference > default 'light'
      const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light')
      setTheme(initialTheme)
    } catch (error) {
      console.warn('Failed to initialize theme from localStorage:', error)
      setTheme('light')
    }
    
    setMounted(true)
  }, [])

  /**
   * Apply theme to HTML element and persist to localStorage
   * Uses colorScheme property for better browser integration
   */
  useEffect(() => {
    if (!mounted) return

    try {
      const root = document.documentElement

      if (theme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }

      // Set color-scheme for native elements (inputs, scrollbars, etc.)
      root.style.colorScheme = theme

      // Persist to localStorage
      localStorage.setItem('theme', theme)
    } catch (error) {
      console.warn('Failed to apply theme:', error)
    }
  }, [theme, mounted])

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  /**
   * Provide context value
   * During SSR (not mounted), theme defaults to 'light' to prevent hydration mismatch
   */
  const contextValue = {
    theme,
    toggleTheme,
    mounted,
    isMinimized,
    setIsMinimized,
    supportWidgetOpen,
    setSupportWidgetOpen,
  }

  // Render children even before mounted to avoid layout shift
  // The theme-specific styles will apply once mounted
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Custom hook to use theme context
 * Must be used within ThemeProvider
 * 
 * @returns {Object} { theme, toggleTheme, mounted, ... }
 * @throws {Error} If used outside ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error(
      'useTheme must be used within <ThemeProvider>. ' +
      'Make sure ThemeProvider wraps your component tree in _app.js or layout.'
    )
  }

  return context
}