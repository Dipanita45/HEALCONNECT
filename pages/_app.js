 fix/button-style-consistency
import '@styles/app.scss'
import { UserContext } from '@lib/context';
import Layout from './layout';
import { useUserData } from '@lib/userInfo';
import '../styles/app.scss';



function MyApp({ Component, pageProps }) {
  const userData = useUserData();

import { ThemeProvider } from '@/context/ThemeContext'
import Navbar from '@/components/navbar' // Import your Navbar
import '@/styles/globals.css'
 main

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Navbar /> {/* Add Navbar here */}
      <Component {...pageProps} />
    </ThemeProvider>
  )
}