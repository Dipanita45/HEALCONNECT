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



Screenshots

### Homepage Preview
<img width="1885" height="878" alt="Screenshot 2025-08-12 204702" src="https://github.com/user-attachments/assets/eec7755b-0074-4b92-ba36-b97ef77baa55" />


### Prescription 
<img width="1882" height="562" alt="Screenshot 2025-08-12 204741" src="https://github.com/user-attachments/assets/ba062cfc-81e5-4aa5-8277-4332913ad21b" />

### Appointments
<img width="1890" height="577" alt="Screenshot 2025-08-12 204752" src="https://github.com/user-attachments/assets/25b665c5-7fe3-4d70-8d48-d12c7d04ba8e" />


### Monitoring
<img width="1878" height="558" alt="Screenshot 2025-08-12 204802" src="https://github.com/user-attachments/assets/87e82497-2daa-4515-bac0-04038633f261" />


### FAQ Section
<img width="1239" height="867" alt="Screenshot 2025-08-12 204828" src="https://github.com/user-attachments/assets/3f90d130-bb49-43f0-b648-d0756ff47040" />


### Contact Page
<img width="1910" height="340" alt="Screenshot 2025-08-12 204840" src="https://github.com/user-attachments/assets/018d9d69-c48b-444a-9e82-87799ba497d7" />


### Dark Mode
<img width="1845" height="834" alt="Screenshot 2025-08-12 204852" src="https://github.com/user-attachments/assets/b7361658-739c-4296-858e-de966e6cae55" />


### 🤝 Contributing

We welcome contributions from everyone! Please read our [Contributing Guidelines](contributing.md) to get started.

---
<p align="center"><strong>Made with ❤️ by the HEALCONNECT </strong><br>Empowering healthcare, one heartbeat at a time.</p>

---

<p align="center"><a href="#top" style="font-size: 18px; padding: 10px 20px; background: #e0f7fa; border-radius: 8px; text-decoration: none;">
⬆️ Back to Top</a></p>

