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
  const [visible, setVisible] = useState(false)

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
      // Delay showing the prompt so it doesn't interrupt the initial page load
      setTimeout(() => setShowInstallPrompt(true), 3000)
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
    setVisible(false)
    setTimeout(() => setShowInstallPrompt(false), 300)
  }

  const dismissOfflineMessage = () => {
    setShowOfflineMessage(false)
  }

  if (isInstalled) return null

  // Trigger entrance animation after mount
  if (showInstallPrompt && !visible) {
    requestAnimationFrame(() => setVisible(true))
  }

  return (
    <>
      {/* Install Prompt — bottom-right floating card */}
      {showInstallPrompt && (
        <div
          style={{
            transition: 'opacity 300ms ease, transform 300ms ease',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(-16px)',
          }}
          className="fixed bottom-6 left-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
            {/* Accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-blue-500 to-green-500" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                    <FaDownload className="text-white text-base" />
                  </div>
                  <div>
                    <p className="font-semibold text-base text-gray-900 dark:text-white leading-tight">Install HEALCONNECT</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">Add to home screen for quick access</p>
                  </div>
                </div>
                <button
                  onClick={dismissInstallPrompt}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded"
                  aria-label="Dismiss install prompt"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
                >
                  <FaDownload className="text-sm" />
                  Install
                </button>
                <button
                  onClick={dismissInstallPrompt}
                  className="px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Not now
                </button>
              </div>
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
              <MdWifiOff className="text-lg" />
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
