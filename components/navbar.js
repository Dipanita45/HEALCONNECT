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
  const { user, setUser, currentUser, setCurrentUser, userRole, setUserRole } = useContext(UserContext)
  const router = useRouter()

  // Navigation links configuration
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/prescriptions', label: 'Prescriptions' },
    { href: '/appointments', label: 'Appointments' },
    { href: '/monitoring', label: 'Monitoring' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
    { href: '/support', label: 'Support', icon: <FaHeadset className={styles.supportIcon} /> },
  ]

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    const handleRouteChange = () => setIsMenuOpen(false)
    
    if (router.events) {
      router.events.on('routeChangeStart', handleRouteChange)
      return () => router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router.events])

  // Close menu on escape key and prevent body scroll
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const handleLogout = useCallback(async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('userType')
      localStorage.removeItem('username')

      // Clear React state
      setUser(null)
      setUserRole(null)
      setCurrentUser(null)

      // Clear Firebase auth if available
      if (typeof window !== 'undefined' && window.firebaseAuth) {
        await window.firebaseAuth.signOut()
      }

      // Close menu and redirect
      setIsMenuOpen(false)
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Still redirect even if there's an error
      router.push('/login')
    }
  }, [router, setUser, setUserRole, setCurrentUser])

  const handleLoginRedirect = useCallback(() => {
    setIsMenuOpen(false)
    router.push('/login')
  }, [router])

  const handleDashboardRedirect = useCallback(() => {
    if (userRole) {
      setIsMenuOpen(false)
      router.push(`/${userRole}/dashboard`)
    }
  }, [router, userRole])

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const isAuthenticated = Boolean(user || currentUser)

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
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} h-20`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between px-6 lg:px-12">
        {/* Logo/Brand */}
        <div className="flex-shrink-0 flex items-center pr-10 xl:pr-16">
          <Link 
            href="/" 
            className={`${styles.logo} flex items-center gap-3`}
            aria-label="HealConnect Home"
          >
            <div className={styles.logoIcon} aria-hidden="true">
              <div className={styles.crossSymbol}>
                <div className={styles.crossLine1}></div>
                <div className={styles.crossLine2}></div>
              </div>
            </div>
            <span className={styles.logoText}>HEALCONNECT</span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center justify-center flex-grow gap-x-4 xl:gap-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${router.pathname === link.href ? styles.active : ''}`}
              aria-current={router.pathname === link.href ? 'page' : undefined}
            >
              {link.icon}
              <span className={styles.linkText}>{link.label}</span>
              <div className={styles.linkHoverEffect} aria-hidden="true"></div>
            </Link>
          ))}
        </div>

        {/* Right side - Auth buttons + Theme Toggle */}
        <div className="flex items-center gap-6 ml-6">
          <div className="hidden lg:flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDashboardRedirect}
                  className={`${styles.loginButton} bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                  aria-label="Go to dashboard"
                >
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={handleLogout}
                  className={`${styles.loginButton} bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
                  aria-label="Logout"
                >
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleLoginRedirect}
                className={`${styles.loginButton} focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                aria-label="Login to your account"
              >
                <span>Login</span>
                <div className={styles.buttonPulse} aria-hidden="true"></div>
              </button>
            )}
          </div>

          <div className="hidden lg:flex items-center pl-4 border-l border-gray-700">
            <ThemeToggle />
          </div>

          {/* Hamburger Menu Button - visible below 768px */}
          <button
            className={`${styles.menuButton} lg:hidden ${isMenuOpen ? styles.menuOpen : ''} ml-2`}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''} lg:hidden`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className={styles.mobileMenuContent}>
          {/* Mobile Navigation Links */}
          <div className={styles.mobileNavLinks}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.mobileNavLink} ${router.pathname === link.href ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
                aria-current={router.pathname === link.href ? 'page' : undefined}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Auth Buttons */}
          <div className={styles.mobileAuthButtons}>
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleDashboardRedirect}
                  className={`${styles.mobileButton} ${styles.dashboardButton}`}
                  aria-label="Go to dashboard"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className={`${styles.mobileButton} ${styles.logoutButton}`}
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLoginRedirect}
                className={`${styles.mobileButton} ${styles.loginButtonMobile}`}
                aria-label="Login to your account"
              >
                Login
              </button>
            )}

            {/* Mobile Theme Toggle */}
            <div className={styles.mobileThemeToggle}>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div
          className={`${styles.overlay} ${isMenuOpen ? styles.show : ''}`}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </nav>
  )
}