'use client'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side - Logo/Brand */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">
            HEALCONNECT
          </Link>
        </div>

        {/* Center - Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
            Home
          </Link>
          <Link href="/prescriptions" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
            Prescriptions
          </Link>
          <Link href="/appointments" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
            Appointments
          </Link>
          <Link href="/monitoring" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
            Monitoring
          </Link>
          <Link href="/faq" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
            FAQ
          </Link>
          <Link href="/contact" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
            Contact
          </Link>
        </div>

        {/* Right side - Login + Theme Toggle */}
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
            Login
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}