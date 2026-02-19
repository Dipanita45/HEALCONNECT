'use client'
import { useState, useEffect } from 'react'
import { FaDownload, FaTimes, FaCheckCircle, FaWifi } from 'react-icons/fa'
import { MdWifiOff } from 'react-icons/md'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Check online status
    setIsOnline(navigator.onLine)

    let isMounted = true

    const handleOnline = () => {
      if (isMounted) {
        setIsOnline(true)
        setShowOfflineMessage(false)
      }
    }

    const handleOffline = () => {
      if (isMounted) {
        setIsOnline(false)
        setShowOfflineMessage(true)
        setTimeout(() => {
          if (isMounted) setShowOfflineMessage(false)
        }, 5000)
      }
    }

    // Periodic connectivity check (more reliable than just relying on events)
    const checkConnectivity = async () => {
      if (!isMounted) return
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000)

        await fetch(window.location.origin + '/manifest.json', {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-store',
          signal: controller.signal
        })

        clearTimeout(timeoutId)
        if (isMounted) setIsOnline(true)
      } catch (error) {
        if (isMounted) {
          setIsOnline(false)
          setShowOfflineMessage(true)
          setTimeout(() => {
            if (isMounted) setShowOfflineMessage(false)
          }, 5000)
        }
      }
    }

    // Run connectivity check every 5 seconds
    const connectivityInterval = setInterval(checkConnectivity, 5000)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      isMounted = false
      clearInterval(connectivityInterval)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to install prompt: ${outcome}`)

      if (outcome === 'accepted') {
        setIsInstalled(true)
        setShowInstallPrompt(false)
        setDeferredPrompt(null)
      }
    } catch (error) {
      console.error('Error during installation:', error)
    }
  }

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false)
  }

  const dismissOfflineMessage = () => {
    setShowOfflineMessage(false)
  }

  if (isInstalled) return null

  return (
    <>
      {/* Install Prompt Banner */}
      {showInstallPrompt && (
        <div className="fixed top-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-pulse">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg shadow-2xl p-4 border border-white/20">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <FaDownload className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Install HEALCONNECT</h3>
                  <p className="text-xs opacity-90">Get instant access to your healthcare dashboard</p>
                </div>
              </div>
              <button
                onClick={dismissInstallPrompt}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Dismiss install prompt"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
            <div className="mt-3 flex space-x-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-white text-blue-600 px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
              >
                <FaDownload className="text-sm" />
                <span>Install App</span>
              </button>
              <button
                onClick={dismissInstallPrompt}
                className="px-4 py-2 text-white/80 hover:text-white text-sm transition-colors"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Status Indicator */}
      {!isOnline && (
        <div className="fixed top-4 left-4 right-4 z-40">
          <div className="bg-red-600 text-white rounded-lg shadow-lg p-3 flex items-center space-x-3">
            <MdWifiOff className="text-lg animate-pulse" />
            <div>
              <p className="font-semibold text-sm">You're offline</p>
              <p className="text-xs opacity-90">Critical data is still available</p>
            </div>
          </div>
        </div>
      )}

      {/* Offline Message Toast */}
      {showOfflineMessage && (
        <div className="fixed bottom-4 left-4 right-4 z-40">
          <div className="bg-orange-600 text-white rounded-lg shadow-lg p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaWifiSlash className="text-lg" />
              <div>
                <p className="font-semibold text-sm">Offline Mode Activated</p>
                <p className="text-xs opacity-90">Patient vitals and emergency contacts available</p>
              </div>
            </div>
            <button
              onClick={dismissOfflineMessage}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Dismiss offline message"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>
        </div>
      )}

      {/* Online Status Indicator */}
      {isOnline && (
        <div className="fixed bottom-8 right-8 z-30">
          <div className="bg-green-600 text-white rounded-full py-1.5 px-3 shadow-lg flex items-center space-x-2 text-sm">
            <FaWifi className="text-sm animate-pulse" />
            <span className="text-xs font-medium">Online</span>
          </div>
        </div>
      )}
    </>
  )
}
