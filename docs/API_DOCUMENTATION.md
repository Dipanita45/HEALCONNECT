# HEALCONNECT API Documentation

This repository integrates a combination of **client‑side helper libraries**, **Firebase Cloud Firestore** utilities, and **Next.js API routes** to power the HEALCONNECT web application. The purpose of this document is to provide an overview of the available endpoints, library functions, and patterns so that contributors can extend or debug the platform with confidence.

> 📌 _Tips for maintainers_:
> - When new Firestore collections or service helper functions are introduced, add a corresponding section below.
> - API routes under `pages/api` use a shared middleware stack (`lib/api/middleware`) for validation, authentication, rate‑limiting, and error handling. Read those utilities before adding new routes.

---

## Table of Contents
1. [Appointments API](#appointments-api)
2. [Support & Ticketing API](#support--ticketing-api)
3. [Patients API](#patients-api)
4. [Vitals, Alerts & Devices](#vitals-alerts--devices)
5. [Prescriptions & Summarization](#prescriptions--summarization)
6. [Authentication Routes](#authentication-routes)
7. [Core Library Helpers](#core-library-helpers)
8. [Middleware & Security Notes](#middleware--security-notes)

---

## Appointments API

This set of helper functions lives in `lib/appointmentsApi.js` and is consumed by various pages (doctor dashboard, patient dashboard, admin tools).

### `queryAppointments(filter)`
Retrieves appointment documents using optional filters. Internally it builds Firestore queries with `where`, `orderBy`, and `limit` clauses to minimize read costs.

**Filters object (all optional):**
- `search` – string token matched against patient/doctor names or formatted date. Filter applied client‑side.
- `status` – `'scheduled' | 'cancelled' | 'completed' | ...`
- `doctorName`, `patientId`, `patientEmail`
- `dateFrom`/`dateTo` – YYYY‑MM‑DD strings
- `pageSize` – number (default 50)
- `startAfterDoc` – Firestore `DocumentSnapshot` for pagination

_Returns:_ `Promise<Array<{id:string, ...data}>>`

### `cancelAppointment(appointmentId, reason?, canceledBy='patient')`
Sets the document `status` to `'cancelled'`. Throws if the scheduled time is within two hours or if already cancelled.

### `rescheduleAppointment(appointmentId, newDate, newTime)`
Modifies `date`/`time` fields while appending history to the document. Throws when the appointment does not exist.

> 🔍 See the source for additional helpers such as `formatAppointment()`.

---

## Support & Ticketing API

Functions under `lib/supportAPI.js` provide client utilities for managing the **supportTickets** collection and lightweight AI response stubs used by the in‑app chatbot.

Key exports:
- `createSupportTicket(ticketData)` – adds a ticket with auto‑generated ID, timestamps, status, priority, and category
- `getSupportTickets(filters)` – accepts status, priority, category, limit; returns array sorted by creation date
- `updateTicketStatus(ticketId, status, assignedTo?)`
- `addTicketMessage(ticketId, message)` – appends a chat message to an existing ticket
- `generateAIResponse(userMessage, context?)` – returns canned replies and suggestion arrays; used only for frontend UI
- Analytics helpers: `getSupportStats()`, `assignTicketToAgent()`

> **Backend endpoints**: there are no dedicated Next.js API routes for support; interactions are made directly with Firestore via the above helpers.

---

## Patients API

Located at `pages/api/patients/index.js` (and `[id].js` for single‑patient operations). Example routes:

| Method | Path                   | Description                                     |
|--------|------------------------|-------------------------------------------------|
| GET    | `/api/patients`        | List patients; supports `doctorId`, `status`, `limit` query parameters | 200 JSON array |
| POST   | `/api/patients`        | Create new patient; body validated with Joi    | 201 `{success:true,id}` |
| GET    | `/api/patients/[id]`   | Retrieve a specific patient record             | 200 `{success,data}` |
| PUT    | `/api/patients/[id]`   | Update patient by ID                            | 200 `{success}`      |
| DELETE | `/api/patients/[id]`   | Soft‑delete or remove patient (admin/doctor)   | 200 `{success}`      |

_All payloads are validated and the user must be authenticated (`withAuth` middleware)._ The route leverages `lib/db/operations` helpers for Firestore CRUD.

---

## Vitals, Alerts & Devices

These collections power the monitoring dashboard.

- **Vitals**: `pages/api/vitals/index.js` accepts `GET` (with optional `patientId`) and `POST` to store a new vitals record.
- **Alerts**: `pages/api/alerts/index.js` and `[id].js` support listing alerts, creating/updating status, and marking acknowledgements.
- **Devices**: `pages/api/devices/index.js` lets doctors register patient devices used for remote monitoring.

Each route mirrors the patterns used by Patients (Joi validation + `withAuth`, etc.). See the individual files for field schemas.

---

## Prescriptions & Summarization

- `/api/prescriptions/summarize.js` is a lightweight server endpoint used by the doctor interface to transform free‑text notes into structured prescription summaries (stubbed/mocked currently).

No other public prescription APIs exist; prescription data is typically stored inside patient documents or the `prescriptions` collection accessed directly from the client.

---

## Authentication Routes

All auth routes live under `pages/api/auth` and wrap Firebase Admin operations.

- `POST /api/auth/register` – see earlier section; performs role checks and sends verification emails.
- `POST /api/auth/login` – placeholder for future JWT/NextAuth logic. Current login is handled by Firebase client SDK.
- `POST /api/auth/logout` – clears session cookies server‑side and client local state.
- `GET /api/auth/me` – returns the current user’s profile based on the session cookie (used by `useUserData()` hook).

These endpoints employ tight rate limiting and input validation. Avoid exposing additional information to unauthenticated callers.

---

## Core Library Helpers

Several reusable functions sit in `lib/`:

| File | Purpose |
|------|---------|
| `firebase.js` | Client SDK initialization
| `firebaseAdmin.js` | Admin SDK helpers
| `db/operations.js` | Wrapper around Firestore CRUD + queries
| `auth.js` | Client‑side auth helpers (login, signup, reset pwd)
| `appointmentsApi.js` | See above
| `supportAPI.js` | Ticket/chat helpers
| `userInfo.js` | Hooks & utilities for retrieving cached user data
| `fetchDoctors.js` etc. | React hooks for realtime snapshots (for internal use) |

These utilities are not exposed as HTTP endpoints but are part of the architecture and should be documented when they gain new functionality.

---

## Middleware & Security Notes

Most custom Next.js routes are composed with the following middleware (see `lib/api/middleware/index.js`):

1. `withErrorHandling` – converts thrown exceptions to HTTP 500 responses.
2. `rateLimit` – prevents API abuse (different limits based on route responsibility).
3. `withAuth` – validates the Firebase session cookie and attaches `req.user`.
4. `withMethods([...])` – restricts allowed HTTP verbs.
5. `validate(schema)` – runs Joi validation against `req.body` or `req.query`.

**Authorization**: many routes assume the caller’s role (doctor, patient, admin) and should check `req.user.role` before permitting sensitive operations. When in doubt, write a new middleware or extend the existing one.

**Firestore rules**: this file documents server‑side logic only. Client‑side access is also governed by stringent Firestore security rules in `firestore.rules` (not covered here).

---

🎯 _Keep this document up to date! Clear, example‑driven API docs help onboard new contributors and maintain high code quality._

