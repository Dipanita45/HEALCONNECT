// Database Schema Definitions for Firestore Collections

export const Collections = {
  USERS: 'users',
  PATIENTS: 'patients',
  DOCTORS: 'doctors',
  ADMINS: 'admins',
  APPOINTMENTS: 'appointments',
  VITALS: 'vitals',
  ALERTS: 'alerts',
  REPORTS: 'reports',
  NOTIFICATIONS: 'notifications',
  SUPPORT_TICKETS: 'supportTickets',
  PRESCRIPTIONS: 'prescriptions',
  DEVICES: 'devices'
};

export const UserRoles = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin'
};

export const AlertSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

export const AppointmentStatus = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const TicketStatus = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};
