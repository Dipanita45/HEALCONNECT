import { useEffect, useState } from "react"

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300)
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-32 right-8 z-40 w-12 h-12 rounded-full shadow-xl
        bg-gradient-to-r from-blue-600 to-purple-600 
        hover:from-blue-700 hover:to-purple-700
        dark:from-blue-500 dark:to-purple-500 
        dark:hover:from-blue-400 dark:hover:to-purple-400
        transition-all duration-500 ease-out transform-gpu
        ${visible 
          ? "opacity-60 translate-y-0 scale-100 hover:scale-105" 
          : "opacity-0 translate-y-16 scale-75 pointer-events-none"
        }
      `}
    >
      <div className="flex items-center justify-center h-full">
        <svg 
          className="w-5 h-5 text-white drop-shadow-sm"
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          viewBox="0 0 24 24"
        >
          <path d="M7 14 l5 -5 5 5 -5 M12 19 V5" />
        </svg>
      </div>
    </button>
  )
}
