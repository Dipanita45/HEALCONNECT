/**
 * Layout Component
 * Provides the basic page structure with dark mode support via Tailwind CSS
 * ThemeToggle is in the Navbar component to avoid duplication
 */
export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <main className="text-gray-900 dark:text-gray-100">{children}</main>
    </div>
  )
}