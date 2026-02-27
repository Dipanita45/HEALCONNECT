# HEALCONNECT API Documentation

Welcome to the HEALCONNECT API Documentation. This reference provides details on the core Firebase interactions and client-side REST mechanisms used throughout the web application.

---

## 1. Appointments API

The Appointments module uses Firebase Cloud Firestore to structure, query, and mutate healthcare reservations. 

`Location:` \`lib/appointmentsApi.js\`

### `queryAppointments`
Fetches a list of appointments based on the provided filter parameters. Automatically implements limits and ordering to optimize Firestore reads.

**Parameters (Object):**
- `search` (String): Search keyword to filter by patient name, doctor name, or date (evaluates client-side).
- `status` (String): Filter by appointment status (e.g. `scheduled`, `cancelled`, `completed`).
- `doctorName` (String): Filter appointments by a specific doctor.
- `patientId` (String): The Firebase Auth UID of the patient.
- `patientEmail` (String): The registered email of the patient.
- `dateFrom` (String): Format `YYYY-MM-DD`. Start date threshold.
- `dateTo` (String): Format `YYYY-MM-DD`. End date threshold.
- `pageSize` (Number): Maximum number of results to return (Default `50`).
- `startAfterDoc` (Firestore DocumentSnapshot): For pagination.

**Returns:** `Array<Object>` containing the combined appointment metadata and document IDs.

---

### `cancelAppointment`
Updates an existing appointment's status to `cancelled`. Enforces a strict 2-hour blocking rule, preventing cancellations from occurring too close to the scheduled time.

**Parameters:**
- `appointmentId` (String): The Firestore document ID of the appointment.
- `reason` (String): Optional text context for why the appointment is cancelled.
- `canceledBy` (String): Role actor who initiated the cancellation (Default: `'patient'`).

**Returns:** `{ success: true }` on successful write.

**Throws:** Error if the appointment is within 2 hours of the scheduled time, or already cancelled.

---

### `rescheduleAppointment`
Reschedules an existing appointment to a new date and time. Preserves the prior scheduling history.

**Parameters:**
- `appointmentId` (String): The Firestore document ID of the appointment.
- `newDate` (String): Format `YYYY-MM-DD`. The proposed new date.
- `newTime` (String): Format `HH:MM`. The proposed new time block.

**Returns:** `{ success: true }` on successful write.

**Throws:** Error if the appointment does not exist.

---

## 2. Authentication API (Routes)

For security reasons, HEALCONNECT integrates Google Firebase Authentication alongside native Next.js API Routes for session establishment and cookie management. 

#### Endpoint: `POST /api/auth/register`
Creates a brand new user via Firebase Admin SDK. Validates payload criteria and enforces secure role assignments.

**Request Body Schema:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "role": "patient",
  "name": "John Doe",
  "specialty": "Cardiology" // Optional, required if role === 'doctor'
}
```

**Responses:**
- `201 Created`: User successfully registered. Returns uid and role.
- `400 Bad Request`: Missing requirements or weak password.
- `403 Forbidden`: Attempted to register as Admin without authorized token.
- `405 Method Not Allowed`: Request wasn't a `POST`.

#### Endpoint: `POST /api/auth/login`
Future scope endpoint for JWT minting and secure NextAuth implementation. (Currently relying on client-side state).

---

> ℹ️ **Note to Developers:** This documentation is a living document. When adding new Firebase collections or standardizing API routes inside Next.js, please update this file to ensure all contributors stay aligned with HEALCONNECT's architectural guidelines!
