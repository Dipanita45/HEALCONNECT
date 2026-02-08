/**
 * Theme Utilities and Hooks
 * 
 * Central location for all theme-related functionality
 * Provides consistent theme management across the application
 */

export { useTheme } from '@/context/ThemeContext'

/**
 * Get the current theme from localStorage
 * Useful for server-side operations or initial data fetching
 * 
 * @returns {string} 'light' or 'dark'
 */
export function getStoredTheme() {
  try {
    if (typeof window === 'undefined') return 'light'
    return localStorage.getItem('theme') || 'light'
  } catch (error) {
    console.warn('Failed to get stored theme:', error)
    return 'light'
  }
}

/**
 * Get the system preference for theme
 * 
 * @returns {string} 'light' or 'dark' based on system preference
 */
export function getSystemThemePreference() {
  try {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch (error) {
    console.warn('Failed to get system theme preference:', error)
    return 'light'
  }
}

/**
 * Get the effective theme (stored > system > default)
 * 
 * @returns {string} 'light' or 'dark'
 */
export function getEffectiveTheme() {
  return getStoredTheme() || getSystemThemePreference() || 'light'
}

/**
 * Apply theme class to HTML element
 * Useful for manual theme application when context is not available
 * 
 * @param {string} theme - 'light' or 'dark'
 */
export function applyTheme(theme) {
  try {
    if (typeof window === 'undefined') return

    const root = document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    root.style.colorScheme = theme
  } catch (error) {
    console.warn('Failed to apply theme:', error)
  }
}

/**
 * Save theme preference to localStorage
 * 
 * @param {string} theme - 'light' or 'dark'
 */
export function saveThemePreference(theme) {
  try {
    localStorage.setItem('theme', theme)
  } catch (error) {
    console.warn('Failed to save theme preference:', error)
  }
}

/**
 * Remove theme preference from localStorage (revert to system preference)
 */
export function clearThemePreference() {
  try {
    localStorage.removeItem('theme')
  } catch (error) {
    console.warn('Failed to clear theme preference:', error)
  }
}

/**
 * Check if current theme is dark
 * Useful for conditional styling or logic
 * 
 * @returns {boolean}
 */
export function isDarkTheme() {
  try {
    if (typeof window === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  } catch (error) {
    console.warn('Failed to check dark theme:', error)
    return false
  }
}

/**
 * Watch for system theme changes
 * Returns unsubscribe function
 * 
 * @param {Function} callback - Called when system theme changes
 * @returns {Function} Unsubscribe function
 */
export function watchSystemThemeChange(callback) {
  try {
    if (typeof window === 'undefined') {
      return () => {} // No-op for SSR
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => {
      const theme = e.matches ? 'dark' : 'light'
      callback(theme)
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    // Fallback for older browsers
    if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }

    return () => {} // No-op if not supported
  } catch (error) {
    console.warn('Failed to watch system theme change:', error)
    return () => {}
  }
}

export default {
  getStoredTheme,
  getSystemThemePreference,
  getEffectiveTheme,
  applyTheme,
  saveThemePreference,
  clearThemePreference,
  isDarkTheme,
  watchSystemThemeChange,
}
