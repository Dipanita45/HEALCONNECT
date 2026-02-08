## Appointment Booking System - Implementation Guide

This document describes the refactored appointment booking system with real-time slot availability and duplicate booking prevention.

### Overview

The appointment booking system now includes:
- ✅ Real-time booked slot detection using Firestore listeners
- ✅ UI-level slot disabling with visual indicators
- ✅ Validation-level duplicate booking prevention
- ✅ Better error handling and user feedback
- ✅ Loading states for async operations
- ✅ Reusable hooks and utility functions
- ✅ Improved accessibility and UX

---

## Architecture

### Files & Components

#### 1. **useBookedSlots Hook** (`hooks/useBookedSlots.js`)
Custom React hook that manages booked slot fetching and real-time updates.

**Features:**
- Real-time Firestore listener for automatic updates
- Fallback to one-time fetch if real-time fails
- Loading and error states
- Auto-cleanup of listeners

**Usage:**
```jsx
import { useBookedSlots } from '@/hooks/useBookedSlots'

function TimeSlotSelector({ date, doctorName }) {
  const { bookedSlots, loading, error, refetch } = useBookedSlots(date, doctorName)

  if (loading) return <Spinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <select>
      {times.map(time => (
        <option disabled={bookedSlots.includes(time)}>
          {time} {bookedSlots.includes(time) && '(Booked)'}
        </option>
      ))}
    </select>
  )
}
```

**Return Value:**
```javascript
{
  bookedSlots: ['9:00 AM', '10:30 AM'],  // Array of booked times
  loading: false,                         // Loading state
  error: null,                           // Error message or null
  refetch: () => {},                     // Manual refresh function
}
```

#### 2. **Appointment Utilities** (`lib/appointmentUtils.js`)
Helper functions for appointment operations.

**Key Functions:**

```javascript
// Check if a time slot is booked
const isBooked = await isTimeSlotBooked(date, doctorName, time)

// Get all booked slots for a day
const slots = await getBookedSlotsForDay(date, doctorName)

// Create appointment with built-in validation
const appointmentId = await createAppointment({
  name: 'John Doe',
  date: '2024-02-15',
  time: '9:00 AM',
  doctorName: 'Dr. Sarah Johnson',
  reason: 'Checkup'
})

// Get patient appointments
const appointments = await getPatientAppointments('John Doe')

// Get doctor appointments
const appointments = await getDoctorAppointments('Dr. Sarah Johnson')

// Format appointment for display
const formatted = formatAppointmentForDisplay(appointment)
```

#### 3. **Appointments Page** (`pages/appointments.jsx`)
Main appointment booking component with improved error handling.

**Key Changes:**
- Uses `useBookedSlots` hook instead of manual fetching
- Uses `createAppointment` utility for safer creation
- Real-time updates when new appointments are booked
- Better error messages instead of alerts
- Loading states for slots
- Improved form validation

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Books Appointment                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. Select Doctor & Date (Step 1)                             │
│    - Doctor selection triggers Step 2                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. useBookedSlots Hook Triggered                             │
│    - Queries Firestore for booked slots                      │
│    - Sets up real-time listener                              │
│    - Returns bookedSlots, loading, error                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Time Slot Rendering                                       │
│    - Shows loading spinner if slotsLoading = true            │
│    - Highlights booked slots as disabled                     │
│    - Shows error message if slotsError exists                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. User Submits Form                                         │
│    - Form validation (dates, times, names)                   │
│    - Call createAppointment() utility                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. createAppointment Validation                              │
│    - Check if slot is already booked (isTimeSlotBooked)     │
│    - Throw error if booked                                   │
│    - Create Firestore document if available                  │
└─────────────────────────────────────────────────────────────┘
                            │
                  ┌─────────┴──────────┐
                  ▼                    ▼
         ┌──────────────┐      ┌──────────────┐
         │   Success    │      │    Error     │
         └──────────────┘      └──────────────┘
              │                      │
              ▼                      ▼
        Show animation        Show error message
        Reset form            Keep form intact
        Back to Step 1        Stay on Step 2
```

---

## Real-Time Updates

The `useBookedSlots` hook uses Firestore's `onSnapshot` listener to automatically update when new appointments are created:

```javascript
// When User A creates appointment at 9:00 AM
addDoc(collection(db, 'appointments'), {
  date: '2024-02-15',
  doctorName: 'Dr. Sarah Johnson',
  time: '9:00 AM',
  // ...
})

// Firestore listener on User B's browser triggers
onSnapshot(query, (snapshot) => {
  const slots = snapshot.docs.map(doc => doc.data().time)
  setBookedSlots(slots)  // Now includes '9:00 AM'
  // UI automatically disables this slot
})
```

This ensures users always see the most current availability.

---

## Error Handling

### UI-Level Errors
```jsx
{slotLoadingError && (
  <div className={styles.errorAlert}>
    <svg className={styles.errorIcon}>...</svg>
    <div>
      <p className={styles.errorAlertTitle}>Unable to Load Availability</p>
      <p className={styles.errorAlertMessage}>{slotLoadingError}</p>
    </div>
  </div>
)}

{appointmentError && (
  <div className={styles.errorAlert}>
    <svg className={styles.errorIcon}>...</svg>
    <div>
      <p className={styles.errorAlertTitle}>Booking Error</p>
      <p className={styles.errorAlertMessage}>{appointmentError}</p>
    </div>
  </div>
)}
```

### Common Error Scenarios

1. **Slot Already Booked**
   ```
   Error: The time slot 9:00 AM is already booked for Dr. Sarah Johnson 
   on 2024-02-15. Please choose another time.
   ```
   - User sees error at submission time
   - Slot was also disabled in dropdown (if real-time worked)
   - This is a race condition fallback

2. **Firestore Connection Error**
   ```
   Error: Unable to fetch real-time updates. Using cached data.
   ```
   - Falls back to one-time fetch
   - User can still book appointments
   - Shows warning to user

3. **Validation Error**
   ```
   Error: All appointment fields are required.
   ```
   - Caught during form validation
   - Field-specific errors shown

---

## Firestore Schema

### Appointments Collection

```javascript
{
  id: "doc-id",
  name: "John Doe",              // Patient name
  date: "2024-02-15",            // ISO date format (YYYY-MM-DD)
  time: "9:00 AM",               // Time format (H:MM AM/PM)
  doctorName: "Dr. Sarah Johnson", // Exact doctor name from list
  reason: "Regular checkup",     // Reason for visit
  status: "confirmed",           // 'confirmed', 'completed', 'cancelled'
  createdAt: Timestamp,          // Firestore Timestamp
  updatedAt: Timestamp,          // Firestore Timestamp
}
```

### Firestore Indexes (Optional but Recommended)

For optimal query performance, create composite indexes:

```
Collection: appointments
Indexes:
  1. (date ASC, doctorName ASC) - for fetching booked slots
  2. (name ASC) - for patient appointment history
  3. (doctorName ASC) - for doctor schedule
```

---

## Performance Optimization

### Firestore Query Optimization

1. **Indexed Queries**
   - `where('date', '==', date) AND where('doctorName', '==', doctor)`
   - Create composite index for this combination

2. **Real-Time Listener Benefits**
   - Only fetches deltas (changes) after initial load
   - Reduces bandwidth usage
   - Provides instant updates

3. **Cache Strategy**
   - Firestore has built-in caching
   - Offline mode works automatically
   - Use `useBookedSlots` refetch for manual refresh

### Component Optimization

```javascript
// Use useBookedSlots only when needed
const { bookedSlots } = useBookedSlots(
  formData.date,      // Only fetch when date changes
  formData.doctor     // Only fetch when doctor changes
)

// Memoize filtered times to avoid recalculation
const availableTimes = useMemo(() => {
  return filterTimesByAvailability(allTimes, selectedDoctor, formData.date)
}, [selectedDoctor, formData.date])
```

---

## Testing Checklist

### Functional Tests
- [ ] User can select a doctor and date
- [ ] Available times load correctly
- [ ] Booked slots show as disabled
- [ ] User cannot select a booked slot
- [ ] Successfully booking removes slot from availability
- [ ] Error message shows if slot becomes booked (race condition)
- [ ] Form resets after successful booking
- [ ] User can go back to doctor selection

### Real-Time Tests
- [ ] Open appointment page in two browsers
- [ ] Book appointment in Browser A
- [ ] Browser B updates automatically
- [ ] Slot appears disabled in Browser B without refresh

### Error Tests
- [ ] Temporary Firestore down - graceful fallback
- [ ] No internet - Firestore offline mode works
- [ ] User tries to book same slot twice - prevented
- [ ] Invalid form data - shows field errors

### Performance Tests
- [ ] Initial load time < 2s
- [ ] Real-time update < 500ms
- [ ] No memory leaks (check DevTools)
- [ ] No duplicate listeners (check console)

---

## Common Issues & Solutions

### Issue: Slots not showing as booked
**Cause:** Real-time listener failed, falls back to one-time fetch
**Solution:** Check browser console for errors, verify Firestore rules

### Issue: User can select booked slot
**Cause:** Race condition - slot was booked after page load
**Solution:** Validation in `createAppointment()` prevents actual booking

### Issue: Duplicate listeners on remount
**Cause:** Missing cleanup function
**Solution:** `useBookedSlots` properly unsubscribes with return statement

### Issue: Slots not loading after date change
**Cause:** Using wrong date format (MM/DD vs YYYY-MM-DD)
**Solution:** Use ISO format (YYYY-MM-DD) for all date operations

---

## Migration from Old Code

Old way (avoid):
```javascript
// Deprecated - manual fetching
const fetchBookedSlots = async (date, doctor) => {
  const q = query(
    collection(db, 'appointments'),
    where('date', '==', date),
    where('doctorName', '==', doctor)
  );
  const snapshot = await getDocs(q);
  setBookedTimes(snapshot.docs.map(doc => doc.data().time));
};

// Manual duplicate checking
const isSlotAlreadyBooked = async () => {
  const q = query(...);
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};
```

New way (recommended):
```javascript
// Use hook for real-time updates
const { bookedSlots, loading, error } = useBookedSlots(date, doctorName)

// Use utility for booking
try {
  const appointmentId = await createAppointment({ ... })
} catch (error) {
  // Handles duplicate checking automatically
}
```

---

## Future Enhancements

Possible improvements:
- [ ] Add cancellation/modification dialog
- [ ] Show appointment confirmations email
- [ ] Add doctor schedule management panel
- [ ] Implement SMS notifications
- [ ] Add recurring appointment support
- [ ] Integrate calendar view
- [ ] Add waitlist feature for fully booked slots
- [ ] Analytics for appointment trends

---

## Support & Questions

For issues or questions:
1. Check the browser console for error messages
2. Verify Firestore connection in DevTools Network tab
3. Check Firestore security rules if data not loading
4. Review Firestore indexes for performance
5. Test in incognito mode (rules/auth issue?)

---

**Last Updated:** February 2024
**Version:** 1.0 (Production Ready)
