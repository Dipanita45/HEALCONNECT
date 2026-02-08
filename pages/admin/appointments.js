import React, { useEffect, useState, useMemo } from 'react'
import AdminSidebar from '@components/Sidebar/AdminSidebar'
import AuthCheck from '@components/Auth/AuthCheck'
import { queryAppointments } from '@/lib/appointmentsApi'
import FetchDoctors from '@/lib/fetchDoctors'
import { AppointmentStatus } from '@/lib/db/schema'

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Filters
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [doctor, setDoctor] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const { loading: doctorsLoading, doctors } = FetchDoctors()

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      fetchData()
    }, 350)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, doctor, dateFrom, dateTo])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const results = await queryAppointments({
        search,
        status,
        doctorName: doctor,
        dateFrom,
        dateTo,
        pageSize: 100,
      })
      setAppointments(results)
    } catch (err) {
      console.error(err)
      setError('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // initial load
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const statusOptions = useMemo(() => [
    { value: '', label: 'All Statuses' },
    { value: AppointmentStatus.SCHEDULED, label: 'Scheduled' },
    { value: AppointmentStatus.CONFIRMED, label: 'Confirmed' },
    { value: AppointmentStatus.COMPLETED, label: 'Completed' },
    { value: AppointmentStatus.CANCELLED, label: 'Cancelled' },
  ], [])

  return (
    <AuthCheck>
      <AdminSidebar>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Appointments</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <div className="col-span-1 md:col-span-2">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by patient, doctor or date"
                className="w-full p-2 border rounded-md"
                aria-label="Search appointments"
              />
            </div>

            <div>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded-md">
                {statusOptions.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <select value={doctor} onChange={(e) => setDoctor(e.target.value)} className="w-full p-2 border rounded-md">
                <option value="">All Doctors</option>
                {!doctorsLoading && doctors.map(d => (
                  <option key={d.id} value={d.name || d.displayName || d.email}>
                    {d.name || d.displayName || d.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="p-2 border rounded-md" />
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="p-2 border rounded-md" />
          </div>

          {loading ? (
            <div className="p-4">Loading appointments...</div>
          ) : error ? (
            <div className="p-4 text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow">
              <table className="min-w-full divide-y">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left">Patient</th>
                    <th className="px-4 py-2 text-left">Doctor</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Time</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {appointments.length === 0 && (
                    <tr><td colSpan={5} className="p-4 text-center">No appointments found</td></tr>
                  )}
                  {appointments.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-2">{a.name}</td>
                      <td className="px-4 py-2">{a.doctorName}</td>
                      <td className="px-4 py-2">{a.date}</td>
                      <td className="px-4 py-2">{a.time}</td>
                      <td className="px-4 py-2">{a.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AdminSidebar>
    </AuthCheck>
  )
}
