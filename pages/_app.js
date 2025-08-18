import { ThemeProvider } from '@/context/ThemeContext'
import Navbar from '@/components/navbar' // Import your Navbar
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Navbar /> {/* Add Navbar here */}
      <Component {...pageProps} />
    </ThemeProvider>
  )
}