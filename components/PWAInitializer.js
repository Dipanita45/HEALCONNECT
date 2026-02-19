'use client'
import { useEffect, useState } from 'react'
import { FaWifi, FaDownload, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'

export default function PWAInitializer() {
  const [pwaSupported, setPwaSupported] = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    checkPwaSupport()
    checkInstallationStatus()
    setupServiceWorker()
    setupInstallPrompt()
  }, [])

  const checkPwaSupport = () => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window
    setPwaSupported(supported)
    
    if (!supported) {
      console.warn('PWA not supported in this browser')
    }
  }

  const checkInstallationStatus = () => {
    // Check if app is running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          window.navigator.standalone ||
                          document.referrer.includes('android-app://')
    
    setIsInstalled(isStandalone)
  }

  const setupServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        // Let next-pwa handle service worker registration
        console.log('PWA: Service worker will be handled by next-pwa')
        
        // Listen for service worker updates
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('PWA: Service worker controller changed')
        })

        // Handle push notifications when service worker is ready
        navigator.serviceWorker.addEventListener('message', (event) => {
          console.log('PWA: Message from service worker', event.data)
          
          if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
            showUpdateNotification()
          }
        })

      } catch (error) {
        console.error('PWA: Service worker setup error:', error)
      }
    }
  }

  const setupInstallPrompt = () => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setInstallPrompt(e)
      console.log('Install prompt ready')
    })
  }

  const showUpdateNotification = () => {
    // Create a simple notification for updates
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('HEALCONNECT Update Available', {
        body: 'A new version of HEALCONNECT is available. Please refresh to update.',
        icon: '/Logo.png',
        tag: 'healconnect-update'
      })
    }
  }

  const handleInstall = async () => {
    if (!installPrompt) return

    try {
      const result = await installPrompt.prompt()
      console.log('Install result:', result)
      
      if (result.outcome === 'accepted') {
        setIsInstalled(true)
        setInstallPrompt(null)
      }
    } catch (error) {
      console.error('Install error:', error)
    }
  }

  const handleUpdate = () => {
    // Refresh to get the latest version
    window.location.reload()
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      console.log('Notification permission:', permission)
      return permission === 'granted'
    }
    return false
  }

  if (!pwaSupported) {
    return (
      <div className="fixed top-4 right-4 z-50 max-w-sm">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg shadow-lg p-4">
          <div className="flex items-center space-x-3">
            <FaExclamationTriangle className="text-yellow-600" />
            <div>
              <h3 className="font-semibold text-sm">PWA Not Supported</h3>
              <p className="text-xs mt-1">Your browser doesn't support all PWA features. Try using Chrome, Firefox, or Edge.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Install Prompt */}
      {installPrompt && !isInstalled && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg shadow-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <FaDownload className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold">Install HEALCONNECT</h3>
                  <p className="text-sm opacity-90">Get instant access to your healthcare dashboard</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleInstall}
                  className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-50 transition-colors"
                >
                  Install
                </button>
                <button
                  onClick={() => setInstallPrompt(null)}
                  className="text-white/80 hover:text-white px-2 py-2 text-sm transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PWA Status Indicator */}
      <div className="fixed top-4 left-4 z-40">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex items-center space-x-2 border border-gray-200 dark:border-gray-600">
          <div className={`w-2 h-2 rounded-full ${
            pwaSupported ? 'bg-green-500' : 'bg-yellow-500'
          }`} />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {pwaSupported ? 'PWA Ready' : 'Limited PWA'}
          </span>
          {isInstalled && (
            <FaCheckCircle className="text-green-500 text-sm" />
          )}
        </div>
      </div>
    </>
  )
}
