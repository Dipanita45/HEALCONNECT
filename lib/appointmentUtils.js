/**
 * Firestore Appointment Utilities
 * Helper functions for appointment operations
 */

import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

/**
 * Check if a specific time slot is already booked
 * 
 * @param {string} date - Appointment date (YYYY-MM-DD format)
 * @param {string} doctorName - Name of the doctor
 * @param {string} time - Time slot (e.g., "9:00 AM")
 * @returns {Promise<boolean>} True if slot is booked, false otherwise
 * 
 * @example
 * const isBooked = await isTimeSlotBooked('2024-02-15', 'Dr. Sarah Johnson', '9:00 AM')
 */
export async function isTimeSlotBooked(date, doctorName, time) {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('date', '==', date),
      where('doctorName', '==', doctorName),
      where('time', '==', time)
    )

    const snapshot = await getDocs(q)
    return !snapshot.empty
  } catch (error) {
    console.error('Error checking time slot availability:', error)
    throw new Error('Failed to validate appointment slot. Please try again.')
  }
}

/**
 * Get all booked slots for a specific date and doctor
 * 
 * @param {string} date - Appointment date (YYYY-MM-DD format)
 * @param {string} doctorName - Name of the doctor
 * @returns {Promise<string[]>} Array of booked time slots
 * 
 * @example
 * const bookedSlots = await getBookedSlotsForDay('2024-02-15', 'Dr. Sarah Johnson')
 * console.log(bookedSlots) // ['9:00 AM', '10:30 AM', '2:00 PM']
 */
export async function getBookedSlotsForDay(date, doctorName) {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('date', '==', date),
      where('doctorName', '==', doctorName)
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data().time)
  } catch (error) {
    console.error('Error fetching booked slots:', error)
    throw new Error('Failed to load booked slots. Please try again.')
  }
}

/**
 * Create a new appointment in Firestore
 * Includes validation to prevent duplicate bookings
 * 
 * @param {Object} appointmentData - Appointment details
 * @param {string} appointmentData.name - Patient name
 * @param {string} appointmentData.date - Appointment date (YYYY-MM-DD)
 * @param {string} appointmentData.time - Appointment time (e.g., "9:00 AM")
 * @param {string} appointmentData.doctorName - Name of the doctor
 * @param {string} appointmentData.reason - Reason for visit
 * @returns {Promise<string>} Document ID of the created appointment
 * 
 * @throws {Error} If slot is already booked or other validation fails
 * 
 * @example
 * try {
 *   const appointmentId = await createAppointment({
 *     name: 'John Doe',
 *     date: '2024-02-15',
 *     time: '9:00 AM',
 *     doctorName: 'Dr. Sarah Johnson',
 *     reason: 'Checkup'
 *   })
 *   console.log('Appointment created:', appointmentId)
 * } catch (error) {
 *   console.error('Failed to create appointment:', error.message)
 * }
 */
export async function createAppointment(appointmentData) {
  const { name, date, time, doctorName, reason } = appointmentData

  // Validate required fields
  if (!name || !date || !time || !doctorName || !reason) {
    throw new Error('All appointment fields are required.')
  }

  // Check if slot is already booked
  const isBooked = await isTimeSlotBooked(date, doctorName, time)
  if (isBooked) {
    throw new Error(
      `The time slot ${time} is already booked for ${doctorName} on ${date}. Please choose another time.`
    )
  }

  try {
    // Create appointment document
    const appointmentRef = await addDoc(collection(db, 'appointments'), {
      name: name.trim(),
      date,
      time,
      doctorName: doctorName.trim(),
      reason: reason.trim(),
      status: 'confirmed', // New appointments are confirmed by default
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })

    return appointmentRef.id
  } catch (error) {
    console.error('Error creating appointment:', error)
    throw new Error(
      error.message || 'Failed to create appointment. Please try again.'
    )
  }
}

/**
 * Get appointments for a specific patient (by name)
 * Useful for showing appointment history
 * 
 * @param {string} patientName - Name of the patient
 * @returns {Promise<Object[]>} Array of appointment documents
 * 
 * @example
 * const appointments = await getPatientAppointments('John Doe')
 */
export async function getPatientAppointments(patientName) {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('name', '==', patientName.trim())
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Error fetching patient appointments:', error)
    throw new Error('Failed to fetch appointments.')
  }
}

/**
 * Get all appointments for a specific doctor
 * Useful for doctor dashboard
 * 
 * @param {string} doctorName - Name of the doctor
 * @returns {Promise<Object[]>} Array of appointment documents
 * 
 * @example
 * const appointments = await getDoctorAppointments('Dr. Sarah Johnson')
 */
export async function getDoctorAppointments(doctorName) {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('doctorName', '==', doctorName.trim())
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Error fetching doctor appointments:', error)
    throw new Error('Failed to fetch appointments.')
  }
}

/**
 * Format appointment data for display
 * Converts Firestore Timestamp to readable date string
 * 
 * @param {Object} appointment - Appointment document
 * @returns {Object} Formatted appointment object
 * 
 * @example
 * const formatted = formatAppointmentForDisplay(appointment)
 * console.log(formatted.createdAtFormatted) // "Feb 15, 2024 at 2:30 PM"
 */
export function formatAppointmentForDisplay(appointment) {
  let createdAtDate = appointment.createdAt

  // Handle both Timestamp object and date strings
  if (createdAt && typeof createdAt.toDate === 'function') {
    createdAtDate = createdAt.toDate()
  }

  return {
    ...appointment,
    createdAtFormatted: createdAtDate
      ? new Date(createdAtDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'N/A',
  }
}

export default {
  isTimeSlotBooked,
  getBookedSlotsForDay,
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  formatAppointmentForDisplay,
}
