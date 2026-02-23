'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const [mounted, setMounted] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [supportWidgetOpen, setSupportWidgetOpen] = useState(false)
  const [showTicketModal, setShowTicketModal] = useState(false);
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(savedTheme || (systemPrefersDark ? 'dark' : 'light'))
  }, [])

  useEffect(() => {
    if (mounted) {
      const root = document.documentElement

      if (theme === 'dark') {
        root.classList.add('dark')
        root.classList.remove('light')
      } else {
        root.classList.remove('dark')
        root.classList.add('light')
      }

      // Force immediate reflow to ensure theme applies
      root.style.colorScheme = theme
      localStorage.setItem('theme', theme)
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isMinimized, setIsMinimized, supportWidgetOpen, setSupportWidgetOpen, showTicketModal,
  setShowTicketModal }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}