import { withErrorHandling, withMethods, withAuth, compose } from '../../../lib/api/middleware';
import { dbOperations, where } from '../../../lib/db/operations';
import { Collections } from '../../../lib/db/schema';

/**
 * API handler to return doctor-specific dashboard statistics.
 * Fetches counts from Firestore for Patients, Reports, and Scheduled Appointments.
 */
async function handler(req, res) {
  // Extract user info from decoded token (populated by withAuth middleware)
  const { uid, name } = req.user;

  try {
    // 1. Total Patients assigned to this doctor
    const patientsCount = await dbOperations.getCount(Collections.PATIENTS, [
      where('doctorId', '==', uid)
    ]);

    // 2. Total Reports
    // Currently, reports might not have doctorId, but we'll query it for future data migration consistency.
    const reportsCount = await dbOperations.getCount(Collections.REPORTS, [
      where('doctorId', '==', uid)
    ]);

    // 3. Appointments
    // Appointments are counted if they are 'scheduled'.
    // We check for both 'doctorId' and fallback to 'doctorName' for legacy/compatibility data.
    let apptCount = 0;
    const appointmentsById = await dbOperations.getCount(Collections.APPOINTMENTS, [
      where('doctorId', '==', uid),
      where('status', '==', 'scheduled')
    ]);

    if (appointmentsById.success && appointmentsById.count > 0) {
      apptCount = appointmentsById.count;
    } else if (name) {
      // Fallback query by doctor name if UID query yields 0
      const appointmentsByName = await dbOperations.getCount(Collections.APPOINTMENTS, [
        where('doctorName', '==', name),
        where('status', '==', 'scheduled')
      ]);
      if (appointmentsByName.success) {
        apptCount = appointmentsByName.count;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        patients: patientsCount.success ? patientsCount.count : 0,
        reports: reportsCount.success ? reportsCount.count : 0,
        appointments: apptCount
      }
    });
  } catch (error) {
    // Error is logged by withErrorHandling middleware
    throw error;
  }
}

export default compose(
  withErrorHandling,
  withAuth,
  (h) => withMethods(['GET'], h)
)(handler);
