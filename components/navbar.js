'use client'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from '@lib/context'
import { useRouter } from 'next/router'
import { FaHeadset } from 'react-icons/fa'
import styles from './navbar.module.css'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  const { user, setUser, currentUser, setCurrentUser, userRole, setUserRole } = useContext(UserContext)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      // Logic for background styling (Existing behavior)
      const isScrolled = window.scrollY > 10
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userType')
    localStorage.removeItem('username')
    setUser(null)
    setUserRole(null)
    setCurrentUser(null)

    if (typeof window !== 'undefined' && window.firebaseAuth) {
      window.firebaseAuth.signOut()
    }

    router.push('/login')
    setIsMenuOpen(false)
  }

  const handleLoginRedirect = () => {
    router.push('/login')
    setIsMenuOpen(false)
  }

  const handleDashboardRedirect = () => {
    if (userRole) {
      router.push(`/${userRole}/dashboard`)
      setIsMenuOpen(false)
    }
  }

  return (
    <nav 
      className={`
        ${styles.navbar} 
        ${scrolled ? styles.scrolled : ''} 
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

        {/* Navigation Links - Active State Highlighting Only */}
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

          <Link
            href="/monitoring"
            className={`${styles.navLink} ${router.pathname === '/monitoring' ? styles.active : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className={styles.linkText}>Monitoring</span>
            <div className={styles.linkHoverEffect}></div>
          </Link>

          <Link
            href="/faq"
            className={`${styles.navLink} ${router.pathname === '/faq' ? styles.active : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className={styles.linkText}>FAQ</span>
            <div className={styles.linkHoverEffect}></div>
          </Link>

          <Link
            href="/contact"
            className={`${styles.navLink} ${router.pathname === '/contact' ? styles.active : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className={styles.linkText}>Contact</span>
            <div className={styles.linkHoverEffect}></div>
          </Link>

          <Link
            href="/support"
            className={`${styles.navLink} ${router.pathname === '/support' ? styles.active : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <FaHeadset className={styles.supportIcon} />
            <span className={styles.linkText}>Support</span>
            <div className={styles.linkHoverEffect}></div>
          </Link>
        </div>

        {/* Right side - Auth buttons + Theme Toggle */}
        <div className="flex items-center gap-6 ml-6">
          <div className="flex items-center">
            {user || currentUser ? (
              <div className="flex items-center gap-3">
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

          <div className="flex items-center pl-4 border-l border-gray-700">
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <button
            className={`${styles.menuButton} lg:hidden ${isMenuOpen ? styles.menuOpen : ''} ml-2`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div
          className={`${styles.overlay} ${isMenuOpen ? styles.show : ''}`}
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </nav>
  )
}