'use client'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { useState, useEffect, useContext, useCallback } from 'react'
import { UserContext } from '@lib/context'
import { useRouter } from 'next/router'
import { FaHeadset } from 'react-icons/fa'
import styles from './navbar.module.css'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true) // For Smart Navbar (Hide/Show)
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const { user, setUser, currentUser, setCurrentUser, userRole, setUserRole } = useContext(UserContext)
  const router = useRouter()

  // Close menu on route change
  useEffect(() => {
    const handleRouteChange = () => setIsMenuOpen(false)
    router.events.on('routeChangeStart', handleRouteChange)
    return () => router.events.off('routeChangeStart', handleRouteChange)
  }, [router.events])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY

      // 1. Logic for background styling (Existing behavior)
      const isScrolled = currentScrollPos > 10
      setScrolled(isScrolled)

      // 2. Logic for Smart Navbar (Hide on scroll down, Show on scroll up)
      if (currentScrollPos < 10) {
        setVisible(true) // Always show at the top
      } else {
        // Show if scrolling up, hide if scrolling down
        setVisible(prevScrollPos > currentScrollPos)
      }

      setPrevScrollPos(currentScrollPos)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [prevScrollPos])

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    // Clear localStorage
    localStorage.removeItem('userType')
    localStorage.removeItem('username')

    // Call server-side logout to clear cookie
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }

    // Clear React state immediately for UI update
    setUser(null)
    setUserRole(null)
    setCurrentUser(null)

    // Clear any Firebase auth state if available
    if (typeof window !== 'undefined' && window.firebaseAuth) {
      window.firebaseAuth.signOut()
    }

    setIsLoggingOut(false)
    // Redirect to login
    router.push('/login')
    closeMenu()
  }

  const handleLoginRedirect = () => {
    router.push('/login')
    closeMenu()
  }

  const handleDashboardRedirect = () => {
    if (userRole) {
      router.push(`/${userRole}/dashboard`)
      closeMenu()
    }
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/prescriptions', label: 'Prescriptions' },
    { href: '/appointments', label: 'Appointments' },
    { href: '/monitoring', label: 'Monitoring' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
    { href: '/support', label: 'Support', icon: true },
  ]

  return (
    <nav
      className={`
        ${styles.navbar} 
        ${scrolled ? styles.scrolled : ''} 
        ${!visible ? styles.navHidden : ''} 
        h-20
      `}
    >
      <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between px-6 lg:px-12">
        {/* Logo/Brand */}
        <div className="flex-shrink-0 flex items-center pr-10 xl:pr-16">
          <Link href="/" className={`${styles.logo} flex items-center gap-3`}>
            <div className={styles.logoIcon}>
              <div className={styles.crossSymbol}>
                <div className={styles.crossLine1}></div>
                <div className={styles.crossLine2}></div>
              </div>
            </div>
            <span className={styles.logoText}>HEALCONNECT</span>
          </Link>
        </div>

        {/* Navigation Links - Centered with Active State Highlighting */}
        <div className={`hidden lg:flex items-center justify-center flex-grow gap-x-4 xl:gap-x-8 ${isMenuOpen ? styles.navOpen : ''}`}>
          <Link
            href="/"
            className={`${styles.navLink} ${router.pathname === '/' ? styles.active : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className={styles.linkText}>Home</span>
            <div className={styles.linkHoverEffect}></div>
          </Link>

          <Link
            href="/prescriptions"
            className={`${styles.navLink} ${router.pathname === '/prescriptions' ? styles.active : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className={styles.linkText}>Prescriptions</span>
            <div className={styles.linkHoverEffect}></div>
          </Link>

          <Link
            href="/appointments"
            className={`${styles.navLink} ${router.pathname === '/appointments' ? styles.active : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className={styles.linkText}>Appointments</span>
            <div className={styles.linkHoverEffect}></div>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4 lg:gap-3 xl:gap-6 ml-2 md:ml-4 lg:ml-3 xl:ml-6">
          {/* Auth buttons for small-to-medium screens (hidden on large to avoid duplicate) */}
          <div className="hidden sm:flex lg:hidden items-center">
            {user || currentUser ? (
              <div className="flex items-center gap-2 lg:gap-2 xl:gap-3">
                <button
                  onClick={handleDashboardRedirect}
                  className={`${styles.loginButton} bg-green-600 hover:bg-green-700`}
                >
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`${styles.loginButton} bg-red-600 hover:bg-red-700 disabled:opacity-50 flex items-center gap-2`}
                >
                  {isLoggingOut && <div className={styles.spinner} style={{ width: '14px', height: '14px', border: '2px solid transparent', borderTop: '2px solid white', borderRadius: '50%' }}></div>}
                  <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleLoginRedirect}
                className={styles.loginButton}
              >
                <span>Login</span>
                <div className={styles.buttonPulse}></div>
              </button>
            )}
          </div>


          <Link
            href="/contact"
            className={`${styles.navLink} ${router.pathname === '/contact' ? styles.active : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className={styles.linkText}>Contact</span>
            <div className={styles.linkHoverEffect}></div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user || currentUser ? (
            <div className="hidden lg:flex items-center gap-2">
              <button onClick={handleDashboardRedirect} className="px-4 py-2 bg-green-600 text-white rounded-md">Dashboard</button>
              <button onClick={handleLogout} disabled={isLoggingOut} className="px-4 py-2 bg-red-600 text-white rounded-md disabled:opacity-50 flex items-center gap-2">
                {isLoggingOut && <div className={styles.spinner} style={{ width: '14px', height: '14px', border: '2px solid transparent', borderTop: '2px solid white', borderRadius: '50%' }}></div>}
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex">
              <button onClick={handleLoginRedirect} className="px-4 py-2 bg-blue-600 text-white rounded-md">Login</button>
            </div>
          )}
          <button onClick={toggleMenu} className="lg:hidden p-2 rounded-md border border-gray-200">
            {isMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden px-6 py-6 space-y-4" style={{ background: 'var(--mobile-menu-bg, #0f172a)' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 border-b transition-colors"
              style={{
                color: 'var(--mobile-menu-text, white)',
                borderColor: 'var(--mobile-menu-border, #374151)'
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.icon && <FaHeadset className={styles.supportIcon} />}
              <span className={styles.linkText}>{link.label}</span>
            </Link>
          ))}

          {/* Mobile Auth Buttons */}
          <div className="pt-4 space-y-3 border-t border-gray-700">
            {user || currentUser ? (
              <>
                <button
                  onClick={handleDashboardRedirect}
                  className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLoginRedirect}
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}