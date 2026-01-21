import ThemeToggle from './ThemeToggle'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <nav className="flex justify-end p-4">
        <ThemeToggle />
      </nav>
      <main>{children}</main>
    </div>
  )
}