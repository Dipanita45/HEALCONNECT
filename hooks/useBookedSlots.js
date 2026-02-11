import { useEffect, useState, useCallback } from 'react'
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

/**
 * Custom hook to fetch booked appointment slots
 * 
 * Features:
 * - Real-time updates using Firestore listeners
 * - Caches booked slots for performance
 * - Handles loading and error states
 * - Auto-cleanup of Firestore listeners
 * 
 * @param {string} date - Appointment date in YYYY-MM-DD format
 * @param {string} doctorName - Name of the doctor
 * @param {boolean} useRealTime - Whether to use real-time listener (default: true)
 * @returns {Object} { bookedSlots, loading, error, refetch }
 * 
 * @example
 * const { bookedSlots, loading, error } = useBookedSlots(date, doctorName)
 * 
 * if (loading) return <Spinner />
 * if (error) return <ErrorMessage message={error} />
 * 
 * return (
 *   <select>
 *     {times.map(time => (
 *       <option disabled={bookedSlots.includes(time)}>
 *         {time} {bookedSlots.includes(time) && '(Booked)'}
 *       </option>
 *     ))}
 *   </select>
 * )
 */
export function useBookedSlots(date, doctorName, useRealTime = true) {
  const [bookedSlots, setBookedSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Fetch booked slots using Firestore query
   * One-time fetch operation
   */
  const fetchSlots = useCallback(async () => {
    if (!date || !doctorName) {
      setBookedSlots([])
      return
    }

    try {
      setLoading(true)
      setError(null)

      const q = query(
        collection(db, 'appointments'),
        where('date', '==', date),
        where('doctorName', '==', doctorName)
      )

      const snapshot = await getDocs(q)
      const slots = snapshot.docs.map((doc) => doc.data().time)

      setBookedSlots(slots)
    } catch (err) {
      console.error('Error fetching booked slots:', err)
      setError(
        err.message || 'Failed to load booked slots. Please try again.'
      )
      setBookedSlots([])
    } finally {
      setLoading(false)
    }
  }, [date, doctorName])

  /**
   * Subscribe to real-time updates using Firestore listener
   * Automatically refetch booked slots when new appointments are made
   */
  useEffect(() => {
    if (!date || !doctorName) {
      setBookedSlots([])
      setLoading(false)
      return
    }

    if (!useRealTime) {
      // Use one-time fetch if real-time is disabled
      fetchSlots()
      return
    }

    try {
      setLoading(true)
      setError(null)

      const q = query(
        collection(db, 'appointments'),
        where('date', '==', date),
        where('doctorName', '==', doctorName)
      )

      // Set up real-time listener
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const slots = snapshot.docs.map((doc) => doc.data().time)
          setBookedSlots(slots)
          setLoading(false)
        },
        (err) => {
          console.error('Error listening to booked slots:', err)
          setError(
            'Unable to fetch real-time updates. Using cached data.'
          )
          setLoading(false)
          // Fall back to one-time fetch
          fetchSlots()
        }
      )

      // Cleanup listener on unmount or when dependencies change
      return () => unsubscribe()
    } catch (err) {
      console.error('Error setting up real-time listener:', err)
      setError(err.message || 'Failed to load booked slots.')
      setLoading(false)
    }
  }, [date, doctorName, useRealTime, fetchSlots])

  /**
   * Manual refetch function for manual refresh
   * Useful if user wants to check for updates manually
   */
  const refetch = useCallback(() => {
    if (useRealTime) {
      // Real-time listener will auto-update
      return
    }
    fetchSlots()
  }, [fetchSlots, useRealTime])

  return {
    bookedSlots,
    loading,
    error,
    refetch,
  }
}

export default useBookedSlots
