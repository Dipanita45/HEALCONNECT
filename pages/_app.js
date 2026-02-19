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
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Loader from '@/components/Loader'

// ✅ Single App component
function MyApp({ Component, pageProps }) {
  const userData = useUserData()
  const router = useRouter()
  const [isRouteLoading, setIsRouteLoading] = useState(false)
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

  useEffect(() => {
    const handleStart = () => setIsRouteLoading(true)
    const handleEnd = () => setIsRouteLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleEnd)
    router.events.on('routeChangeError', handleEnd)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleEnd)
      router.events.off('routeChangeError', handleEnd)
    }
  }, [router.events])

  return (
    <ThemeProvider>
      <UserContext.Provider value={userData}>
        <PWAInitializer />
        <PWAInstallPrompt />
        <Navbar />
        {isRouteLoading && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur ${isDarkMode ? 'bg-gray-900/80' : 'bg-white/60'}`}>
            <Loader show variant="stethoscope" size={64} darkMode={isDarkMode} />
          </div>
        )}
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <ScrollToTop />
        <Footer />
        <SupportWidget />
      </UserContext.Provider>
    </ThemeProvider>
  )
}

export default MyApp
