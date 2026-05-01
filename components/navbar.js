'use client'
import Link from 'next/link'
import Image from 'next/image'
import ThemeToggle from './ThemeToggle'
import { useState, useEffect, useCallback, useRef } from 'react'
import AuthActions from './AuthActions'
import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import { FaHeadset } from 'react-icons/fa'
import styles from './navbar.module.css'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true) // For Smart Navbar (Hide/Show)
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const menuRef = useRef(null)

  const { user: clerkUser, isLoaded } = useUser()
  const { signOut } = useClerk()
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

  // Focus trap logic
  useEffect(() => {
    if (!isMenuOpen) return;

    const focusableElements = menuRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // aria-hidden logic for main content
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (isMenuOpen) {
      mainContent?.setAttribute('aria-hidden', 'true');
    } else {
      mainContent?.removeAttribute('aria-hidden');
    }
    return () => mainContent?.removeAttribute('aria-hidden');
  }, [isMenuOpen]);

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
    await signOut()
    setIsLoggingOut(false)
    router.push('/login')
    closeMenu()
  }

  const handleLoginRedirect = () => {
    router.push('/login')
    closeMenu()
  }

  const handleSignupRedirect = () => {
    router.push('/signup')
    closeMenu()
  }

  const handleDashboardRedirect = () => {
    if (clerkUser?.publicMetadata?.role) {
      router.push(`/${clerkUser.publicMetadata.role}/dashboard`)
    } else {
      router.push('/onboarding')
    }
    closeMenu()
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
        <div className="flex-shrink-0 flex items-center lg:pr-10 xl:pr-16">
          <Link href="/" className={`${styles.logo} flex items-center gap-3`}>
            <span className={styles.logoImageWrap}>
              <Image
                src="/logo_new.png"
                alt="Healconnect logo"
                width={32}
                height={32}
                className={`${styles.logoImage} ${styles.logoLight}`}
                priority
              />
              <Image
                src="/logo_black.png"
                alt="Healconnect logo"
                width={32}
                height={32}
                className={`${styles.logoImage} ${styles.logoDark}`}
                priority
              />
            </span>
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

        {/* ✅ FIXED: Removed duplicate AuthActions that was causing two Login buttons */}
        <div className="flex items-center gap-2 md:gap-4 lg:gap-3 xl:gap-6 ml-2 md:ml-4 lg:ml-3 xl:ml-6">
          <Link
            href="/contact"
            className={`hidden sm:flex ${styles.navLink} ${router.pathname === '/contact' ? styles.active : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className={styles.linkText}>Contact</span>
            <div className={styles.linkHoverEffect}></div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {/* ✅ Single AuthActions — the only Login button */}
          <div className="hidden lg:flex items-center gap-2">
            <AuthActions 
              isLoaded={isLoaded}
              user={clerkUser}
              isLoggingOut={isLoggingOut}
              handleDashboardRedirect={handleDashboardRedirect}
              handleLogout={handleLogout}
              handleLoginRedirect={handleLoginRedirect}
            />
          </div>
          {/* Hamburger button - mobile only */}
          <button
            onClick={toggleMenu}
            className="lg:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-md"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-haspopup="true"
          >
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
              style={{ background: 'var(--hamburger-color, white)' }}
            ></span>
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-x-0' : ''}`}
              style={{ background: 'var(--hamburger-color, white)' }}
            ></span>
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
              style={{ background: 'var(--hamburger-color, white)' }}
            ></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={styles.overlay} onClick={closeMenu} />
      )}

      {/* Mobile Menu Panel */}
      <div 
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''} lg:hidden`}
      >
        <div className={styles.mobileMenuContent}>
          <nav className={styles.mobileNav} aria-label="Mobile Links">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.mobileNavLink} ${router.pathname === link.href ? styles.mobileNavLinkActive : ''}`}
                onClick={closeMenu}
              >
                {link.icon && <FaHeadset className={styles.supportIcon} />}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Auth Buttons */}
          <AuthActions 
            isMobile
            isLoaded={isLoaded}
            user={clerkUser}
            isLoggingOut={isLoggingOut}
            handleDashboardRedirect={handleDashboardRedirect}
            handleLogout={handleLogout}
            handleLoginRedirect={handleLoginRedirect}
          />
        </div>
      </div>
    </nav>
  );
}