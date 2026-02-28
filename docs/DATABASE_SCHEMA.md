# HEALCONNECT Database Schema

HEALCONNECT uses Google Firebase Cloud Firestore as its primary NoSQL database. This document details the collections, their structural relationships, and the medical data standards established for the platform.

---

## Collections Overview

The database is divided into these core collections (defined in `lib/db/schema.js`):
1. `users`: Healthcare providers, patients, and administrators.
2. `patients`: Detailed medical profiles for monitored individuals.
3. `vitals`: Time-series sensor data representing health metrics.
4. `alerts`: System-generated warnings based on medical thresholds.
5. `devices`: Physical IoT hardware configuration.
6. `appointments`: Scheduling and booking blocks for doctors and patients.
7. `prescriptions`: Medication and dosage directives.

---

## 1. `users` Collection
Stores authentication metadata and RBAC (Role-Based Access Control) permissions. Lookups are handled via the Firebase Auth `uid`.

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String (ID) | Matches the Firebase Authentication UID. |
| `email` | String | User's registered email address. |
| `role` | String | Enum: `admin`, `doctor`, or `patient`. |
| `name` | String | Full display name. |
| `specialty` | String | (Doctors Only) Medical specialization field. |
| `createdAt` | Timestamp | Account creation date. |
| `lastLogin` | Timestamp | Last authentication event. |

---

## 2. `patients` Collection
Contains the immutable and mutable medical history of a registered patient.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | The reference UID of the patient. |
| `name` | String | Patient's full name. |
| `age` | Number | Integer value of patient's age. |
| `gender` | String | Patient's gender. |
| `bloodGroup` | String | Enum: A+, O-, etc. |
| `medicalHistory` | Array<String> | Known pre-existing conditions (e.g., "Hypertension"). |
| `assignedDoctor` | String | The UID or Name of the overseeing physician. |
| `status` | String | Enum: `stable`, `critical`, `monitoring`. |

---

## 3. `vitals` Collection
High-frequency time-series data pushed by the ESP32/Arduino hardware kit.

| Field | Type | Description |
|-------|------|-------------|
| `patientId` | String (Ref) | The UID of the patient being monitored. |
| `timestamp` | Timestamp | Exact time the vital sign was recorded by the sensor. |
| `heartRate` | Number | BPM (Beats per minute). |
| `spO2` | Number | Blood oxygen saturation percentage (%). |
| `temperature` | Number | Body temperature in Celsius. |
| `bloodPressure`| Object | `{ systolic: Number, diastolic: Number }` |

---

## 4. `appointments` Collection
Manages the real-time scheduling system between patients and doctors.

| Field | Type | Description |
|-------|------|-------------|
| `patientId` | String (Ref) | UID of the patient booking the appointment. |
| `patientEmail`| String | Contact email for the patient. |
| `doctorName` | String | The selected physician's name. |
| `date` | String | Format: `YYYY-MM-DD`. |
| `time` | String | Format: `HH:MM`. |
| `status` | String | Enum: `scheduled`, `cancelled`, `rescheduled`, `completed`. |
| `reason` | String | Primary medical complaint / reason for visit. |
| `cancellationReason` | String | (Optional) Why the appointment was cancelled. |

---

## 5. `alerts` Collection
Generated automatically by `lib/alertSystem.js` when ingested vitals breach safe medical boundaries.

| Field | Type | Description |
|-------|------|-------------|
| `patientId` | String (Ref) | The patient who triggered the alert. |
| `type` | String | Enum: `critical`, `warning`, `info`. |
| `metric` | String | The vital sign that breached the threshold (e.g. `heartRate`). |
| `value` | Number | The dangerous value recorded. |
| `threshold` | Number | The safe limit that was exceeded. |
| `timestamp` | Timestamp | When the alert was generated. |
| `status` | String | Enum: `unread`, `acknowledged`, `resolved`. |

---

## 6. `prescriptions` Collection
Issued by doctors to patients.

| Field | Type | Description |
|-------|------|-------------|
| `patientId` | String (Ref) | Patient UID receiving the prescription. |
| `doctorId` | String (Ref) | Doctor UID issuing the prescription. |
| `medications` | Array<Object> | List of `{ name, dosage, frequency, duration }`. |
| `notes` | String | Additional physician instructions. |
| `dateIssued` | Timestamp | When the script was written. |
| `status` | String | Enum: `active`, `completed`. |

---

> ℹ️ **Note to Developers:** Do not change these core schemas without also migrating the legacy data in the Firestore bucket. Always update the enums in `lib/db/schema.js` first.
