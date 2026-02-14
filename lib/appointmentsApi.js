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

export default { queryAppointments }
