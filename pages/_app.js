// ✅ All imports at the top
import '@/styles/globals.css'
import '@/styles/app.scss'

import { ThemeProvider } from '@/context/ThemeContext'
import Navbar from '@/components/navbar'
import ScrollToTop from '@/components/ScrollToTop'
import Footer from './footer'
import { UserContext } from '@lib/context'
import { useUserData } from '@lib/userInfo'
import Layout from './layout'
import SupportWidget from '@/components/Support/SupportWidget'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'
import PWAInitializer from '@/components/PWAInitializer'
import { ClerkProvider } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Loader from '@/components/Loader'

// ✅ Single App component
function MyApp({ Component, pageProps }) {
  const userData = useUserData()
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches ||
        localStorage.getItem('theme') === 'dark'
      setIsDarkMode(isDark)
    }

    // Check initially
    checkDarkMode()

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', checkDarkMode)

    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', checkDarkMode)
    }
  }, [])

  return (
    <ClerkProvider>
      <ThemeProvider>
        <UserContext.Provider value={userData}>
          <PWAInitializer />
          <PWAInstallPrompt />
          <Navbar />
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <ScrollToTop />
          <Footer />
          <SupportWidget />
        </UserContext.Provider>
      </ThemeProvider>
    </ClerkProvider>
  )
}

export default MyApp
