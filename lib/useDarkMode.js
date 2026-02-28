import { useEffect, useState } from "react";

function useDarkMode() {
  // Get initial theme (localStorage → system preference → fallback light)
  const getInitialTheme = () => {
    if (typeof window === "undefined") return "light";

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;

    // Remove any existing theme classes first
    root.classList.remove("light", "dark");

    // Add current theme class to <html>
    root.classList.add(theme);

    // Persist theme
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Proper toggle function (instead of colorTheme confusion)
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  // Return actual theme + toggle (standard pattern)
  return [theme, toggleTheme];
}

export default useDarkMode;