'use client'
import { useEffect } from 'react'

export default function PWAInitializer() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('PWA: Service worker controller changed')
    })

    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'UPDATE_AVAILABLE') {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('HEALCONNECT Update Available', {
            body: 'A new version of HEALCONNECT is available. Please refresh to update.',
            icon: '/Logo.png',
            tag: 'healconnect-update'
          })
        }
      }
    })
  }, [])

  return null
}
