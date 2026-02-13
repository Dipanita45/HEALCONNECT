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
    <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-12 h-16">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <span className={styles.logoText}>HEALCONNECT</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-8">
        {[
          { href: '/', label: 'Home' },
          { href: '/prescriptions', label: 'Prescriptions' },
          { href: '/appointments', label: 'Appointments' },
          { href: '/monitoring', label: 'Monitoring' },
          { href: '/faq', label: 'FAQ' },
          { href: '/contact', label: 'Contact' },
          { href: '/support', label: 'Support' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.navLink} ${
              router.pathname === link.href ? styles.active : ''
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right Side */}
      <div className="hidden lg:flex items-center gap-4">
        {user || currentUser ? (
          <>
            <button
              onClick={handleDashboardRedirect}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLoginRedirect}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        )}

        <ThemeToggle />
      </div>

      {/* Mobile Menu Button + Theme Toggle */}
      <div className="lg:hidden flex items-center gap-2">
        <ThemeToggle />
        <button
          className="flex flex-col gap-1.5"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="w-6 h-0.5 bg-white transition-colors light-hamburger"
            style={{ background: 'var(--hamburger-color, white)' }}></span>
          <span className="w-6 h-0.5 bg-white transition-colors light-hamburger"
            style={{ background: 'var(--hamburger-color, white)' }}></span>
          <span className="w-6 h-0.5 bg-white transition-colors light-hamburger"
            style={{ background: 'var(--hamburger-color, white)' }}></span>
        </button>
      </div>
    </div>

    {/* Mobile Menu */}
    {isMenuOpen && (
      <div className="lg:hidden px-6 py-6 space-y-4" style={{ background: 'var(--mobile-menu-bg, #0f172a)' }}>
        {[
          { href: '/', label: 'Home' },
          { href: '/prescriptions', label: 'Prescriptions' },
          { href: '/appointments', label: 'Appointments' },
          { href: '/monitoring', label: 'Monitoring' },
          { href: '/faq', label: 'FAQ' },
          { href: '/contact', label: 'Contact' },
          { href: '/support', label: 'Support' },
        ].map((link) => (
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
        </div>
      </div>
    )}
  </nav>
)

}