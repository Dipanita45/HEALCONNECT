// ✅ All imports at the top
import '@/styles/globals.css'
import '@/styles/app.scss'

import { ThemeProvider } from '@/context/ThemeContext'
import Navbar from '@/components/navbar'
import ScrollToTop from '@/components/ScrollToTop'
import Footer from './footer'
import { UserContext } from '@lib/context'
import { useUserData } from '@lib/userInfo'
import Layout from './layout'
import SupportWidget from '@/components/Support/SupportWidget'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'
import PWAInitializer from '@/components/PWAInitializer'

// ✅ Single App component
function MyApp({ Component, pageProps }) {
  const userData = useUserData()

  return (
    <ThemeProvider>
      <UserContext.Provider value={userData}>
        <PWAInitializer />
        <PWAInstallPrompt />
        <Navbar />
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <ScrollToTop />
        <Footer />
        <SupportWidget />
      </UserContext.Provider>
    </ThemeProvider>
  )
}

export default MyApp
