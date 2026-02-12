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

// ✅ Single App component
function MyApp({ Component, pageProps }) {
  const userData = useUserData()
  const router = useRouter()
  const [isRouteLoading, setIsRouteLoading] = useState(false)

  useEffect(() => {
    const handleStart = () => setIsRouteLoading(true)
    const handleEnd = () => setIsRouteLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleEnd)
    router.events.on('routeChangeError', handleEnd)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleEnd)
      router.events.off('routeChangeError', handleEnd)
    }
  }, [router.events])

  return (
    <ThemeProvider>
      <UserContext.Provider value={userData}>
        <Navbar />
        {isRouteLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur">
            <Loader show variant="stethoscope" size={64} />
          </div>
        )}
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
