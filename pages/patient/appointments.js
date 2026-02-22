import AuthCheck from "@components/Auth/AuthCheck";
import PatientSidebar from "@components/Sidebar/PatientSidebar";
import { UserContext } from "@lib/context";
import { useContext, useEffect, useState } from "react";
import { queryAppointments, cancelAppointment, rescheduleAppointment } from "@/lib/appointmentsApi";
import { AppointmentStatus } from "@/lib/db/schema";
import { FaCalendarAlt, FaTimes, FaSpinner, FaCalendarCheck } from "react-icons/fa";

export default function MyAppointments() {
  const { currentUser } = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);

  // Form State
  const [cancelReason, setCancelReason] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.email) {
      fetchMyApps();
    }
  }, [currentUser]);

  const fetchMyApps = async () => {
    setLoading(true);
    try {
      const results = await queryAppointments({
        patientEmail: currentUser.email,
        pageSize: 100
      });
      setAppointments(results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'scheduled':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Scheduled</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Cancelled</span>;
      case 'rescheduled':
        return <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">Rescheduled</span>;
      case 'completed':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Completed</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{status || 'Unknown'}</span>;
    }
  };

  const openCancel = (appt) => {
    setSelectedAppt(appt);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const executeCancel = async () => {
    setActionLoading(true);
    try {
      await cancelAppointment(selectedAppt.id, cancelReason, 'patient');
      alert("Appointment cancelled successfully!");
      setCancelModalOpen(false);
      fetchMyApps();
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const openReschedule = (appt) => {
    setSelectedAppt(appt);
    setNewDate('');
    setNewTime('');
    setRescheduleModalOpen(true);
  };

  const executeReschedule = async () => {
    if (!newDate || !newTime) return alert("Please select date and time");
    setActionLoading(true);
    try {
      await rescheduleAppointment(selectedAppt.id, newDate, newTime);
      alert("Appointment rescheduled successfully!");
      setRescheduleModalOpen(false);
      fetchMyApps();
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Reschedule time slots
  const availableTimes = [
    "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  return (
    <AuthCheck>
      <PatientSidebar>
        <div className="p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Appointments</h1>
            <p className="text-gray-600 dark:text-gray-400">View and manage your scheduled doctor visits.</p>
          </div>

          {loading ? (
            <div className="flex justify-center p-10"><FaSpinner className="animate-spin text-blue-500 text-4xl" /></div>
          ) : appointments.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <FaCalendarAlt className="mx-auto text-5xl text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">No Appointments Found</h3>
              <p className="text-gray-500 mt-2">You haven't booked any appointments yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {appointments.map(appt => (
                <div key={appt.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Dr. {appt.doctorName}</h3>
                    {getStatusBadge(appt.status)}
                  </div>
                  
                  <div className="text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <p className="flex items-center"><FaCalendarAlt className="mr-2 text-blue-500"/> {appt.date}</p>
                    <p className="flex items-center"><FaCalendarCheck className="mr-2 text-green-500"/> {appt.time}</p>
                    {appt.cancellationReason && (
                        <p className="text-sm mt-2 p-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded border border-red-100 dark:border-red-800">
                          <strong>Reason:</strong> {appt.cancellationReason}
                        </p>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                    {(!appt.status || appt.status === 'scheduled') && (
                      <>
                        <button onClick={() => openReschedule(appt)} className="flex-1 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded font-medium transition-colors border border-blue-200">
                          Reschedule
                        </button>
                        <button onClick={() => openCancel(appt)} className="flex-1 text-sm bg-red-50 hover:bg-red-100 text-red-700 py-2 rounded font-medium transition-colors border border-red-200">
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cancel Modal */}
          {cancelModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
                <button onClick={() => setCancelModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                  <FaTimes size={20} />
                </button>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Cancel Appointment</h3>
                <p className="mb-4 text-sm text-red-600">Appointments cannot be cancelled if they are less than 2 hours away.</p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason for Cancellation (Optional)</label>
                  <textarea 
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows="3"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="E.g. Feeling better, schedule conflict..."
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setCancelModalOpen(false)} className="px-4 py-2 border rounded border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Go Back</button>
                  <button onClick={executeCancel} disabled={actionLoading} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50">
                    {actionLoading ? 'Processing...' : 'Confirm Cancel'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reschedule Modal */}
          {rescheduleModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
                <button onClick={() => setRescheduleModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                  <FaTimes size={20} />
                </button>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Reschedule Appointment</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select New Date</label>
                  <input 
                    type="date" 
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    min={new Date().toISOString().split('T')[0]}
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    style={{colorScheme: 'light'}}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select New Time</label>
                  <select 
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  >
                    <option value="">Choose a time slot...</option>
                    {availableTimes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 justify-end">
                  <button onClick={() => setRescheduleModalOpen(false)} className="px-4 py-2 border rounded border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                  <button onClick={executeReschedule} disabled={actionLoading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                    {actionLoading ? 'Processing...' : 'Confirm New Time'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </PatientSidebar>
    </AuthCheck>
  );
}
