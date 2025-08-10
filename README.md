# HEALCONNECT [![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://Dipanita45.github.io/HEALCONNECT)

---

## 🩺 About

**HEALCONNECT** is a smart health monitoring system designed to help hospitals manage patient health parameters remotely.  
Our goal is to enable doctors to access patient data anytime, anywhere — enabling faster and better treatment decisions.

---

## 🚀 Features

- 🔐 Secure Firebase Authentication  
- 🗄️ Cloud Firestore for real-time data storage  
- 🧑‍⚕️ Patient health parameter tracking and monitoring  
- 📅 Appointment booking system  
- 📸 Image uploads for health records  
- 🛠️ Reactive forms using `react-hook-form`  

---

## 🛠 Tech Stack

- **Frontend**: React.js with Vite  
- **Backend Services**: Firebase Authentication & Firestore  
- **Forms**: React Hook Form  
- **Styling**: CSS / SCSS  

---
# 📁 Project Structure

```
HEALCONNECT/
├── .github/
│   └── workflows/
│       └── deploy-react.yml
│
├── HealthConnect_Kit_Arduino_Code/
│   ├── HealthConnect_Kit_Arduino_Code.ino        # Main sketch
│   ├── Network.cpp
│   └── Network.h
│
├── components/
│   ├── Auth/
│   │   ├── AuthCheck.js
│   │   ├── DemoPhoneAuth.js
│   │   ├── IndexAuthCheck.js
│   │   ├── PatientLogin.js
│   │   └── SignIn.js
│   │
│   ├── DoctorComponents/
│   │   └── DoctorCard.js
│   │
│   ├── LiveMonitor/
│   │   ├── ECGMonitor.js
│   │   ├── RealtimeChart.js
│   │   └── ViewLivePatient.js
│   │
│   ├── PatientComponents/
│   │   ├── PatientCard.js
│   │   ├── PatientDetails.js
│   │   ├── PatientStatus.js
│   │   └── ViewPatient.js
│   │
│   ├── Profile/
│   ├── Sidebar/
│   ├── Loader.js
│   ├── Navbar.module.css
│   ├── Note.js
│   └── navbar.js
│
├── lib/
│   ├── firebase.js
│   ├── useDarkMode.js
│   └── userInfo.js
│
├── pages/
│   ├── admin/
│   ├── doctor/
│   ├── patient/
│   ├── Appointments.module.css
│   ├── Contact.module.css
│   ├── Monitoring.module.css
│   ├── _app.jsx
│   ├── about.jsx
│   ├── appointments.jsx
│   ├── contact.jsx
│   ├── footer.js
│   ├── index.js
│   ├── layout.js
│   ├── login.jsx
│   ├── monitoring.jsx
│   ├── prescriptions.jsx
│   └── profile.jsx
│ 
├── public/
│   └── Untitled design .png
│
├── styles/
│   ├── Home.module.scss
│   ├── app.scss
│   ├── button.scss
│   ├── globals.css
│   ├── special-effects.scss
│   └── ui.scss
│
├── .env.example
├── .eslintrc.json
├── .gitignore
├── Code_of_Conduct.md
├── License.md
├── README.md
├── Security.md
├── jsconfig.json
├── next.config.js
├── package.json
├── package-lock.json
├── postcss.config.js
└── tailwind.config.js

```
---

## ⚙️ Getting Started

### ✅ Prerequisites

- Node.js (version 14 or higher)
- Firebase project (setup on [Firebase Console](https://console.firebase.google.com))

---

### 🔧 Installation Steps

- Clone the repository
``` git clone https://github.com/Dipanita45/HEALCONNECT```
- Navigate to project directory
``` cd HEALCONNECT ```

- Install dependencies
``` npm install ```

- Start the development server
``` npm run dev ``` 

---

### 🤝 Contributing

We welcome contributions from everyone! Please read our [Contributing Guidelines](contributing.md) to get started.

---
<p align="center"><strong>Made with ❤️ by the HEALCONNECT </strong><br>Empowering healthcare, one heartbeat at a time.</p>

---

<p align="center"><a href="#top" style="font-size: 18px; padding: 10px 20px; background: #e0f7fa; border-radius: 8px; text-decoration: none;">
⬆️ Back to Top</a></p>
