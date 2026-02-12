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
            key={link.href}
            href={link.href}
            className={`${styles.navLink} ${
              router.pathname === link.href ? styles.active : ''
            }`}
          >
            {link.label}
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
            key={link.href}
            href={link.href}
            className="block text-white py-2 border-b border-gray-700"
            onClick={() => setIsMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}

        <div className="pt-4 space-y-3">
          {user || currentUser ? (
            <>
              <button
                onClick={handleDashboardRedirect}
                className="w-full py-2 bg-green-600 text-white rounded-md"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="w-full py-2 bg-red-600 text-white rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLoginRedirect}
              className="w-full py-2 bg-blue-600 text-white rounded-md"
            >
              Login
            </button>
          )}

          <div className="pt-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    )}
  </nav>
)

}