import { db } from './firebase'
import { collection, query, where, orderBy, limit, getDocs, startAfter } from 'firebase/firestore'
import { Collections } from './db/schema'

/**
 * Query appointments with optional filters.
 * Filters supported: search (patient or doctor name substring), status, date range, doctorName
 * Returns up to `pageSize` results. For pagination, pass `startAfterDoc` to continue.
 */
export async function queryAppointments({
  search = '',
  status = '',
  doctorName = '',
  patientId = '',
  patientEmail = '',
  dateFrom = '',
  dateTo = '',
  pageSize = 50,
  startAfterDoc = null,
} = {}) {
  try {
    const clauses = []

    const colRef = collection(db, Collections.APPOINTMENTS)

    // Status filter
    if (status) {
      clauses.push(where('status', '==', status))
    }
    
    // Patient filters
    if (patientId) {
      clauses.push(where('patientId', '==', patientId))
    }
    if (patientEmail) {
      clauses.push(where('patientEmail', '==', patientEmail))
    }

    // Doctor filter
    if (doctorName) {
      clauses.push(where('doctorName', '==', doctorName))
    }

    // Date range - appointments store date as YYYY-MM-DD string
    if (dateFrom) {
      clauses.push(where('date', '>=', dateFrom))
    }
    if (dateTo) {
      clauses.push(where('date', '<=', dateTo))
    }

    // Build base query
    // If there are clauses, apply them; else query all
    let q
    if (clauses.length > 0) {
      q = query(colRef, ...clauses, orderBy('date', 'desc'), orderBy('time', 'asc'), limit(pageSize))
    } else {
      q = query(colRef, orderBy('date', 'desc'), orderBy('time', 'asc'), limit(pageSize))
    }

    // Note: Firestore doesn't support substring search natively; search param will be applied client-side
    const snapshot = await getDocs(q)
    const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

    // If search provided, filter client-side by patient or doctor name (case-insensitive)
    const normalizedSearch = search.trim().toLowerCase()
    let results = docs
    if (normalizedSearch) {
      results = results.filter((a) => {
        return (
          (a.name && a.name.toLowerCase().includes(normalizedSearch)) ||
          (a.doctorName && a.doctorName.toLowerCase().includes(normalizedSearch)) ||
          (a.date && a.date.toLowerCase().includes(normalizedSearch))
        )
      })
    }

    return results
  } catch (error) {
    console.error('queryAppointments error', error)
    throw error
  }
}

/**
 * Cancel an appointment.
 * Verifies that the appointment is at least 2 hours away.
 */
export async function cancelAppointment(appointmentId, reason = '', canceledBy = 'patient') {
  try {
    const { doc, getDoc, updateDoc } = await import('firebase/firestore')
    const docRef = doc(db, Collections.APPOINTMENTS, appointmentId)
    const snapshot = await getDoc(docRef)
    
    if (!snapshot.exists()) {
      throw new Error('Appointment not found')
    }

    const data = snapshot.data()
    
    if (data.status === 'cancelled') {
        throw new Error('Appointment is already cancelled')
    }

    // Checking the 2-hour rule
    // Date format is YYYY-MM-DD, time format is HH:MM
    if (data.date && data.time) {
      const appointmentDateTime = new Date(`${data.date}T${data.time}`)
      const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000)

      if (appointmentDateTime < twoHoursFromNow) {
        throw new Error('Cannot cancel appointments less than 2 hours before the scheduled time.')
      }
    }

    await updateDoc(docRef, {
      status: 'cancelled',
      cancellationReason: reason,
      cancelledAt: new Date(),
      cancelledBy: canceledBy
    })

    return { success: true }
  } catch (error) {
    console.error('cancelAppointment error', error)
    throw error
  }
}

/**
 * Reschedule an appointment to a new date and time.
 */
export async function rescheduleAppointment(appointmentId, newDate, newTimeSlot) {
  try {
    const { doc, getDoc, updateDoc } = await import('firebase/firestore')
    const docRef = doc(db, Collections.APPOINTMENTS, appointmentId)
    const snapshot = await getDoc(docRef)
    
    if (!snapshot.exists()) {
      throw new Error('Appointment not found')
    }

    const data = snapshot.data()

    await updateDoc(docRef, {
      status: 'rescheduled',
      date: newDate,
      time: newTimeSlot,
      rescheduledFrom: {
        date: data.date,
        timeSlot: data.time
      },
      rescheduledAt: new Date()
    })

    return { success: true }
  } catch (error) {
    console.error('rescheduleAppointment error', error)
    throw error
  }
}

export default { queryAppointments, cancelAppointment, rescheduleAppointment }
