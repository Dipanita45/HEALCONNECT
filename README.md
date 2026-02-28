<div align="center">

# 🏥 HEALCONNECT
### Smart Remote Health Monitoring & Hospital Management System

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square)](https://github.com/Dipanita45/HEALCONNECT)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](License.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-blue?style=flat-square)](contributing.md)
[![Firebase](https://img.shields.io/badge/Database-Firebase-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![SWOC'26](https://img.shields.io/badge/SWOC-2026-blueviolet?style=flat-square&logo=rocket)](https://socialwinterofcode.com/)
[![Discord](https://img.shields.io/badge/Discord-7289DA?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/WbvxB2F4G)

[**Live Demo**](https://healconnect.vercel.app/) | [**Report Bug**](https://github.com/Dipanita45/HEALCONNECT/issues) | [**Request Feature**](https://github.com/Dipanita45/HEALCONNECT/issues) | [**Join Discord**](https://discord.gg/WbvxB2F4G)

</div>

---

## 🩺 About

**HEALCONNECT** is a professional-grade health monitoring system designed for real-time remote patient care. By bridging the gap between physical sensors and cloud-based dashboards, it allows medical professionals to monitor vital parameters (ECG, Heart Rate, etc.) and manage appointments seamlessly from any location.

---

## 🌟 Open Source Participation

This project proudly participates in the following open-source programs:

| Program | Program Name | Status |
|---------|--------------|--------|
| ❄️ | **Social Winter of Code (SWOC)** | Active |
| 🌍 | **Open Source Community Group (OSCG)** | Active |
| 🚀 | **Apertre 3.0** | Active |

> 💡 We warmly welcome contributors from all the above programs.  
Please check open issues and follow the contribution guidelines before submitting a PR.


## 🚀 Key Features

- 🔐 **Secure Auth:** Multi-role Firebase Authentication (Admin, Doctor, Patient).
- 🗄️ **Real-time Database:** Cloud Firestore for zero-latency health parameter updates.
- 🔌 **RESTful API:** Complete API infrastructure for all entities (patients, vitals, alerts, devices).
- 📊 **Service Layer:** Business logic abstraction with comprehensive error handling.
- 📈 **Live Monitoring:** Interactive ECG and health charts using real-time data streams.
- 🚨 **Emergency Alerts:** Automated real-time alerts when patient vitals exceed safe thresholds.
- 📅 **Hospital Management:** Integrated appointment booking and prescription systems.
- 🌓 **UX Focused:** Fully responsive design with Dark Mode support.
- ⚡ **Real-time Sync:** Live data updates using Firestore subscriptions.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), Next.js |
| **Styling** | SCSS / Tailwind CSS |
| **Backend Services** | Firebase Auth & Cloud Firestore |
| **Hardware** | Arduino (C++) / ESP32 |
| **Form Handling** | React Hook Form |

---

## 🔌 Hardware Setup & Flashing

To connect physical sensors to the HEALCONNECT dashboard, you must flash the kit with the provided firmware:

1. **Software:** Install the latest [Arduino IDE](https://www.arduino.cc/en/software).
2. **Open Project:** Open `HealthConnect_Kit_Arduino_Code/HealthConnect_Kit_Arduino_Code.ino`.
3. **Configuration:**
   - Update `Network.h` with your WiFi credentials.
   - Ensure the Firebase Secret/URL matches your project settings.
4. **Library Installation:** Use the Library Manager to install `Firebase ESP32 Client` and `ArduinoJson`.
5. **Upload:** Connect your hardware via USB, select the correct COM port, and click **Upload**.

---

## 📂 Project Structure

```text
HEALCONNECT/
├── .github/workflows/       # Automated CI/CD (GitHub Actions)
├── HealthConnect_Kit_Arduino_Code/ # Hardware Firmware (Arduino/C++)
├── components/              # Reusable UI Components
│   ├── Auth/                # Login & Auth State Logic
│   ├── DoctorComponents/    # Doctor-specific views & Alert System
│   ├── LiveMonitor/         # ECG & Real-time Chart Logic
│   └── PatientComponents/   # Patient-specific views
├── lib/                     # Core Libraries & Services
│   ├── api/                 # API client & middleware
│   ├── db/                  # Database operations & schema
│   ├── services/            # Business logic layer
│   ├── hooks/               # Custom React hooks
│   ├── alertSystem.js       # Core alert monitoring & generation
│   ├── thresholdDefaults.js # Medical threshold configurations
│   └── useAlertMonitor.js   # Real-time monitoring hooks
├── pages/                   # Next.js Routing & API Logic
│   ├── api/                 # RESTful API endpoints
│   │   ├── patients/        # Patient CRUD operations
│   │   ├── vitals/          # Vitals recording & retrieval
│   │   ├── alerts/          # Alert management
│   │   └── devices/         # Device registration & status
│   ├── admin/               # Admin dashboard & threshold management
│   ├── doctor/              # Doctor dashboard with alerts
│   └── patient/             # Patient dashboard
├── docs/                    # Comprehensive Documentation
│   ├── API_DOCUMENTATION.md # Complete API reference
│   ├── DATABASE_SCHEMA.md   # Database structure
│   ├── SETUP_GUIDE.md       # Installation & setup
│   ├── USAGE_EXAMPLES.md    # Code examples
│   └── QUICK_REFERENCE.md   # Quick reference guide
├── public/                  # Static Assets & Images
└── styles/                  # Global SCSS & Tailwind Styles
```

---

## ⚙️ Getting Started

### ✅ Prerequisites
- Node.js (version 14 or higher)
- Firebase project (setup on [Firebase Console](https://console.firebase.google.com))

### 🔧 Installation Steps
#### Clone the repository
```bash
git clone [https://github.com/Dipanita45/HEALCONNECT](https://github.com/Dipanita45/HEALCONNECT)
cd HEALCONNECT
```
#### Install dependencies
```bash
npm install
```
#### Start development server
```bash
npm run dev
```

#### Backend Setup & Configuration
Although this project uses a unified Next.js structure, backend services (API routes, database connections, and authentication) require proper environment configuration.

##### Prerequisites
- Node.js (v16+)
- npm or yarn
- Database (MongoDB / PostgreSQL as applicable)

##### 🔐 Environment Configuration
Create a `.env` file in the root directory and copy the values from `.env.example`. Focus strictly on **Firebase credentials** as this project uses Firestore for all database needs.
```Code snippet
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

##### Install Dependencies
```bash
npm install
```
##### Run the Application
```bash
npm run dev
```
##### Backend/API
- API routes are located inside the `pages/api` directory
- Ensure database connection variables are correctly set

##### 🚨 Emergency Alert System
For detailed information about the real-time alert system, see [ALERT_SYSTEM_GUIDE.md](ALERT_SYSTEM_GUIDE.md)

##### 📚 Database & API Documentation
For comprehensive information about the database and API infrastructure:
- **[Database & API Overview](docs/DATABASE_API_README.md)** - Complete implementation guide
- **[API Documentation](docs/API_DOCUMENTATION.md)** - RESTful API endpoints reference
- **[Database Schema](docs/DATABASE_SCHEMA.md)** - Firestore collections structure
- **[Setup Guide](docs/SETUP_GUIDE.md)** - Step-by-step installation
- **[Usage Examples](docs/USAGE_EXAMPLES.md)** - Code examples and patterns
- **[Quick Reference](docs/QUICK_REFERENCE.md)** - Cheat sheet for common operations

---

## 🖼️ Website Preview

<details> <summary>Click to view Screenshots</summary>

### Homepage

<img width="1915" height="903" alt="Screenshot 2026-02-06 213023 - Copy" src="https://github.com/user-attachments/assets/cbc7b47d-3a86-410c-b1a9-dd3b97fdf311" />


### Team member (Doctor)

<img width="1908" height="908" alt="Screenshot 2026-02-06 213107" src="https://github.com/user-attachments/assets/59cb6721-5625-4deb-b26d-6455b99d1539" />


### Dark Mode

<img width="1845" height="834" alt="Screenshot 2025-08-12 204852" src="https://github.com/user-attachments/assets/b7361658-739c-4296-858e-de966e6cae55" />

### Appointments

<img width="1890" height="577" alt="Screenshot 2025-08-12 204752" src="https://github.com/user-attachments/assets/25b665c5-7fe3-4d70-8d48-d12c7d04ba8e" />

</details>

---

## 🌍 Community & Contributors

### 💖 Contributors  
Thanks to these amazing people who have contributed to **HEALCONNECT** ✨  

<div align="center">
  <a href="https://github.com/Dipanita45/HEALCONNECT/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=Dipanita45/HEALCONNECT" />
  </a>
</div>

<br/>

### ⭐ Project Support

<div align="center">

[![Stars](https://img.shields.io/github/stars/Dipanita45/HEALCONNECT?style=social)](https://github.com/Dipanita45/HEALCONNECT/stargazers)
&nbsp;&nbsp;
[![Forks](https://img.shields.io/github/forks/Dipanita45/HEALCONNECT?style=social)](https://github.com/Dipanita45/HEALCONNECT/network/members)

</div>

---

## 🤝 Contributing
Contributions are what make the open-source community an amazing place to learn and inspire. We welcome contributions from everyone! Please read our [Contributing Guidelines](contributing.md) to get started.

---

## 💬 Connect With Us

Join our growing community! Connect with us on Discord for:
- 🗣️ Real-time discussions and support
- 🚀 Project updates and announcements
- 💡 Feature suggestions and feedback
- 🤝 Collaboration opportunities

[![Join our Discord](https://img.shields.io/badge/Discord-Join%20Server-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/WbvxB2F4G)


---

<p align="center">
   <strong>Made with ❤️ by the HEALCONNECT Team</strong>
    <strong>Empowering healthcare, one heartbeat at a time.</strong>
</p>

<p align="center"><a href="#top">⬆️ Back to Top</a></p>
