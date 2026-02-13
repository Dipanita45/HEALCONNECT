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
      const isScrolled = window.scrollY > 10
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('userType')
    localStorage.removeItem('username')

    // Clear React state immediately for UI update
    setUser(null)
    setUserRole(null)
    setCurrentUser(null)

    // Clear any Firebase auth state if available
    if (typeof window !== 'undefined' && window.firebaseAuth) {
      window.firebaseAuth.signOut()
    }

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
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} h-20`}>
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

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center justify-center flex-grow gap-x-2 xl:gap-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${router.pathname === link.href ? styles.active : ''}`}
            >
              {link.icon && <FaHeadset className={styles.supportIcon} />}
              <span className={styles.linkText}>{link.label}</span>
              <div className={styles.linkHoverEffect}></div>
            </Link>
          ))}
        </div>

        {/* Right side - Auth buttons + Theme Toggle + Hamburger */}
        <div className="flex items-center gap-2 md:gap-4 lg:gap-3 xl:gap-6 ml-2 md:ml-4 lg:ml-3 xl:ml-6">
          {/* Auth buttons - hidden on small screens, shown in mobile menu */}
          <div className="hidden sm:flex items-center">
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
                  className={`${styles.loginButton} bg-red-600 hover:bg-red-700`}
                >
                  <span>Logout</span>
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

          <div className="flex items-center pl-2 lg:pl-2 xl:pl-4 border-l border-gray-700">
            <ThemeToggle />
          </div>

          {/* Hamburger Menu Button - visible below 768px */}
          <button
            className={`${styles.menuButton} ${isMenuOpen ? styles.menuOpen : ''}`}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            type="button"
          >
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`${styles.overlay} ${isMenuOpen ? styles.overlayVisible : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className={styles.mobileMenuContent}>
          {/* Mobile Navigation Links */}
          <nav className={styles.mobileNav}>
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.mobileNavLink} ${router.pathname === link.href ? styles.mobileNavLinkActive : ''}`}
                onClick={closeMenu}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.icon && <FaHeadset className={styles.supportIcon} />}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Auth Buttons */}
          <div className={styles.mobileAuthSection}>
            {user || currentUser ? (
              <>
                <button
                  onClick={handleDashboardRedirect}
                  className={`${styles.mobileAuthButton} ${styles.mobileAuthButtonPrimary}`}
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className={`${styles.mobileAuthButton} ${styles.mobileAuthButtonDanger}`}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLoginRedirect}
                className={`${styles.mobileAuthButton} ${styles.mobileAuthButtonPrimary}`}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}