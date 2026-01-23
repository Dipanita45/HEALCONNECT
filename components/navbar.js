'use client'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from '@lib/context'
import { useRouter } from 'next/router'
import styles from './navbar.module.css'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, currentUser, userRole } = useContext(UserContext)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('userType')
    localStorage.removeItem('username')
    
    // Clear any Firebase auth state if available
    if (typeof window !== 'undefined' && window.firebaseAuth) {
      window.firebaseAuth.signOut()
    }
    
    // Redirect to login
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
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Logo/Brand with animation */}
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <div className={styles.crossSymbol}>
                <div className={styles.crossLine1}></div>
                <div className={styles.crossLine2}></div>
              </div>
            </div>
            <span className={styles.logoText}>HEALCONNECT</span>
          </Link>
        </div>

        {/* Navigation Links with hover effects */}
        <div className={`${styles.navLinks} ${isMenuOpen ? styles.navOpen : ''}`}>
          <Link 
            href="/" 
            className={styles.navLink}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className={styles.linkText}>Home</span>
            <div className={styles.linkHoverEffect}></div>
          </Link>
          <Link 
            href="/prescriptions" 
            className={styles.navLink}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className={styles.linkText}>Prescriptions</span>
            <div className={styles.linkHoverEffect}></div>
          </Link>
          <Link 
            href="/appointments" 
            className={styles.navLink}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className={styles.linkText}>Appointments</span>
            <div className={styles.linkHoverEffect}></div>
          </Link>
          <Link 
            href="/monitoring" 
            className={styles.navLink}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className={styles.linkText}>Monitoring</span>
            <div className={styles.linkHoverEffect}></div>
          </Link>
          <Link 
            href="/faq" 
            className={styles.navLink}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className={styles.linkText}>FAQ</span>
            <div className={styles.linkHoverEffect}></div>
          </Link>
          <Link 
            href="/contact" 
            className={styles.navLink}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className={styles.linkText}>Contact</span>
            <div className={styles.linkHoverEffect}></div>
          </Link>
        </div>

        {/* Right side - Auth buttons + Theme Toggle */}
        <div className={styles.rightSection}>
          {user || currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDashboardRedirect}
                className={`${styles.loginButton} bg-green-600 hover:bg-green-700`}
              >
                <span>Dashboard</span>
              </button>
              <button
                onClick={handleLogout}
                className={`${styles.loginButton} bg-red-600 hover:bg-red-700 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 transform transition-all duration-300 ease-out active:scale-95 relative overflow-hidden group`}
              >
                <span className="relative z-10">Logout</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
          <ThemeToggle />

          {/* Mobile menu button */}
          <button 
            className={`${styles.menuButton} ${isMenuOpen ? styles.menuOpen : ''}`}
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