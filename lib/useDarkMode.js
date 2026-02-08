import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

/**
 * Custom hook for accessing dark mode theme
 * Returns [theme, toggleTheme] for backward compatibility
 * 
 * @returns {[string, Function]} [currentTheme, toggleFunction]
 * @example
 * const [theme, toggleTheme] = useDarkMode();
 * // theme will be 'light' or 'dark'
 */
function useDarkMode() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useDarkMode must be used within ThemeProvider. " +
      "Ensure ThemeProvider wraps your component tree in _app.js"
    );
  }

  const { theme, toggleTheme } = context;

  // Return in array format for backward compatibility
  return [theme, toggleTheme];
}

export default useDarkMode;
export { useDarkMode };
