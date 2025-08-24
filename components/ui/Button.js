import React from "react"
import clsx from "clsx"

export default function Button({ 
  children, 
  variant = "primary", 
  onClick, 
  href, 
  ...props 
}) {
  const baseStyles =
    "inline-flex items-center justify-center px-6 py-2 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
    outline:
      "border border-gray-400 text-gray-800 hover:bg-gray-100 focus:ring-gray-400 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700",
  }

  const classes = clsx(baseStyles, variants[variant])

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  )
}
