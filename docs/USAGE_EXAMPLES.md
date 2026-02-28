# HEALCONNECT Usage Guide & Code Examples

This guide provides technical contributors with context on how to interface with the HEALCONNECT Firebase logic and UI components safely.

---

## 1. Firebase Service Architecture

HEALCONNECT abstracts its Firebase logic into the `lib/` directory so that UI components do not handle complex asynchronous query building directly.

**Rule of Thumb:** Never `import { collection, updateDoc } from 'firebase/firestore'` directly inside a `.js` or `.jsx` React component. Import from `lib/api/` instead!

### ❌ Anti-Pattern (Do not do this)

```javascript
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function VitalsDashboard() {
  const fetchVitals = async () => {
    // DO NOT write raw Firebase logic inside component files
    const snapshot = await getDocs(collection(db, "vitals"));
    console.log(snapshot.docs);
  }
}
```

### ✅ Best Practice (Do this)

```javascript
import { fetchPatientVitals } from '../lib/vitalsApi';

export default function VitalsDashboard() {
  const loadVitals = async (patientId) => {
    try {
      const data = await fetchPatientVitals(patientId);
      setVitals(data);
    } catch (e) {
      console.error(e);
    }
  }
  // ...
}
```

---

## 2. Component Role Checks

Next.js pages in HEALCONNECT restrict access using Firebase Authentication Contexts. If you are building a new component meant *only* for doctors, you must verify the Role locally before rendering sensitive UI fragments.

```javascript
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useRouter } from 'next/router';

export default function GeneratePrescription() {
  const { userRole, loading } = useContext(UserContext);
  const router = useRouter();

  if (loading) return <Spinner />;
  
  // Safe guard access
  if (userRole !== 'doctor') {
    router.push('/unauthorized');
    return null;
  }

  return (
    <form>
      <!-- Form logic here -->
    </form>
  )
}
```

---

## 3. Emitting Real-time Medical Alerts

HEALCONNECT monitors data points pushing into the `/vitals` collection. If you are building a new sensor or threshold hook, you must use the global `alertSystem.js` schema configuration.

### Example: Creating an Alert Document

```javascript
import { generateAlert } from '../lib/alertSystem';

// Logic processing continuous IoT data...
if (currentHeartRate > 120) {
    await generateAlert({
        patientId: currentPatientId,
        type: 'critical',
        metric: 'heartRate',
        value: currentHeartRate,
        threshold: 120
    });
}
```

> **Note**: For performance, do not generate duplicate Unread alerts if one already exists for the same `patientId` and `metric` within a 15-minute sliding window.

---

## 4. UI Library & Theming

HEALCONNECT uses Vanilla CSS Modules combined with Tailwind CSS utility classes. 

* The `styles/` folder contains global application themes.
* Individual components should use `{styles.myClass}` syntax to prevent CSS leakage globally.

```javascript
import styles from './Dashboard.module.css';

// DO NOT USE vanilla string classes for structure
<div className="card-container"> </div> 

// DO USE the module imports
<div className={`${styles.cardContainer} shadow-xl rounded-lg`}> </div>
```
