## Dark/Light Theme Implementation Guide

This document explains the refactored dark/light theme system for the HEALCONNECT Next.js application.

### Overview

The theme system provides:
- ✅ Global dark/light mode toggle
- ✅ Theme persistence using localStorage
- ✅ System preference detection and fallback
- ✅ Next.js hydration safety (no theme flashing)
- ✅ Tailwind CSS integration (dark mode class)
- ✅ Accessibility features (ARIA labels, keyboard support)
- ✅ Clean, reusable code with no duplication

### Architecture

#### Components & Files

1. **ThemeContext** (`context/ThemeContext.jsx`)
   - Core theme state management
   - Provides `useTheme()` hook
   - Handles theme initialization and DOM updates
   - Manages other UI state (sidebar, support widget)

2. **ThemeToggle** (`components/ThemeToggle.js`)
   - Toggle button for switching themes
   - Accessible with ARIA labels
   - Shows sun/moon icons based on current theme

3. **useDarkMode** (`lib/useDarkMode.js`)
   - Backward-compatible wrapper around `useTheme()`
   - Returns `[theme, toggleTheme]` array format

4. **Theme Utilities** (`lib/theme.js`)
   - Helper functions for theme operations
   - Functions: `getStoredTheme()`, `applyTheme()`, `isDarkTheme()`, etc.
   - Useful for SSR or manual theme application

5. **Document Script** (`pages/_document.js`)
   - Prevents Flash of Unstyled Content (FOUC)
   - Initializes theme before React hydration
   - Reads localStorage and system preferences

### Usage

#### Using useTheme Hook (Recommended)

```jsx
import { useTheme } from '@/context/ThemeContext'
// or
import { useTheme } from '@/lib/theme'

function MyComponent() {
  const { theme, toggleTheme, mounted } = useTheme()

  // Avoid rendering until mounted to prevent hydration mismatch
  if (!mounted) return null

  return (
    <div className={theme === 'dark' ? 'dark-styles' : 'light-styles'}>
      <button onClick={toggleTheme}>
        Toggle Theme (Currently: {theme})
      </button>
    </div>
  )
}
```

#### Using useDarkMode Hook (Backward Compatible)

```jsx
import useDarkMode from '@/lib/useDarkMode'

function MyComponent() {
  const [theme, setTheme] = useDarkMode()

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  )
}
```

#### Using Theme Utilities

```jsx
import { 
  isDarkTheme, 
  applyTheme, 
  getEffectiveTheme,
  watchSystemThemeChange 
} from '@/lib/theme'

// Check if dark theme is active
if (isDarkTheme()) {
  console.log('Dark mode is on')
}

// Manually apply theme
applyTheme('dark')

// Get effective theme (stored > system > default)
const currentTheme = getEffectiveTheme()

// Watch for system preference changes
const unsubscribe = watchSystemThemeChange((newTheme) => {
  console.log('System theme changed to:', newTheme)
})

// Clean up
unsubscribe()
```

### Tailwind CSS Integration

The theme system works with Tailwind's `darkMode: 'class'` configuration.

Use the `dark:` prefix for dark mode styles:

```jsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  Content that changes based on theme
</div>
```

### Theme Priority

1. **Stored preference** (localStorage) - Highest priority
2. **System preference** (prefers-color-scheme) - Medium priority
3. **Default** ('light') - Lowest priority (fallback)

### How It Works

#### App Initialization Flow

```
1. Browser loads HTML
   ↓
2. Head script runs (pages/_document.js)
   - Reads localStorage.theme or system preference
   - Applies 'dark' class to <html> and sets colorScheme
   ↓
3. React hydration begins
   - ThemeProvider initializes state
   - No FOUC because theme is already applied
   ↓
4. ThemeProvider ready
   - Components can now use useTheme()
   - Theme toggle works
```

#### Theme Change Flow

```
1. User clicks theme toggle button
   ↓
2. toggleTheme() updates state
   ↓
3. ThemeProvider's useEffect:
   - Applies/removes 'dark' class to <html>
   - Updates colorScheme property
   - Saves to localStorage
   ↓
4. Tailwind CSS automatically applies dark mode styles
   ↓
5. Next render reflects new theme
```

### Preventing Hydration Mismatch

The implementation prevents hydration mismatch by:

1. **Pre-script in _document.js**: Applies theme before React hydration
2. **Conditional rendering**: Components check `mounted` flag before rendering theme-specific content
3. **Consistent initial state**: Both server and client start with the same theme

```jsx
// Use the mounted flag to prevent hydration mismatch
const { theme, mounted } = useTheme()

if (!mounted) return null // Don't render until theme is initialized
```

### Accessibility Features

- ✅ ARIA labels on toggle button
- ✅ `aria-pressed` attribute to indicate state
- ✅ Focus ring for keyboard navigation
- ✅ Respects `prefers-reduced-motion` media query
- ✅ Proper color contrast in both themes
- ✅ `aria-hidden="true"` on decorative icons

### Browser Support

- ✅ All modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Fallback for older browsers (uses system preference)
- ✅ Works without localStorage (graceful degradation)
- ✅ No flashing on page load

### Troubleshooting

#### Theme doesn't persist across reloads
- Check if localStorage is enabled in browser
- Check browser dev tools → Application → Local Storage
- Verify localStorage.setItem('theme', ...) is being called

#### FOUC (Flash of Unstyled Content) occurs
- The _document.js script may not be running
- Clear browser cache and rebuild with `npm run build`
- Check that the script tag with dangerouslySetInnerHTML is present

#### Theme not applying to all components
- Ensure ThemeProvider wraps your app in _app.js
- Use proper Tailwind dark: classes instead of inline theme logic
- Check that tailwind.config.js has `darkMode: 'class'`

#### Hydration mismatch error
- Components must check `mounted` flag before rendering
- Avoid server-dependent theme logic
- Use `useTheme()` only in client components

### Migration Guide

If you're migrating from a different theme system:

**Old way (not recommended):**
```jsx
import useDarkMode from '@/lib/useDarkMode'
const [colorTheme, setTheme] = useDarkMode()
```

**New way (recommended):**
```jsx
import { useTheme } from '@/context/ThemeContext'
const { theme, toggleTheme, mounted } = useTheme()
```

### Performance Considerations

- ✅ Theme state is minimal (just 'light' or 'dark' string)
- ✅ Only HTML element and localStorage are modifed
- ✅ No unnecessary re-renders of the entire tree
- ✅ Context update only affects components using theme

### Future Enhancements

Possible extensions to the theme system:

- [ ] Add support for auto-switching based on time of day
- [ ] Add more theme options (e.g., 'sepia', 'high-contrast')
- [ ] Add theme animation/transition preferences
- [ ] Add theme customization (color palette)
- [ ] Persist theme across device/browser sync

### Questions or Issues?

For issues with the theme system:

1. Check browser dev tools console for errors
2. Verify ThemeProvider is in _app.js
3. Ensure components are within ThemeProvider
4. Check that tailwind.config.js is correct
5. Clear browser cache and localStorage if needed

---

**Last Updated:** February 2024
**Version:** 2.0 (Refactored)
