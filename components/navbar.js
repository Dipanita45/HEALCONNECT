'use client'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { useState, useEffect } from 'react'
import styles from './navbar.module.css'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

        {/* Right side - Login + Theme Toggle */}
        <div className={styles.rightSection}>
          <Link 
            href="/login" 
            className={styles.loginButton}
            onClick={() => setIsMenuOpen(false)}
          >
            <span>Login</span>
            <div className={styles.buttonPulse}></div>
          </Link>
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
          className={styles.overlay}
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </nav>
  )
}