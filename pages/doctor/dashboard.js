import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaFileAlt, FaBell, FaUsers } from "react-icons/fa";
import Image from "next/image";
import dynamic from "next/dynamic";

const AuthCheck = dynamic(() => import("@components/Auth/AuthCheck"), { ssr: false });
const DoctorSidebar = dynamic(() => import("@components/Sidebar/DoctorSidebar"), { ssr: false });
const AlertNotifications = dynamic(() => import("@components/DoctorComponents/AlertNotifications"), { ssr: false });

// FetchPatients can stay, but we will override its behavior for offline caching
import FetchPatients from "../../lib/fetchPatients";
import { useMultiPatientMonitor } from "../../lib/useAlertMonitor";

export default function DoctorDashboard() {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [doctorInfo, setDoctorInfo] = useState({ id: null, name: null });

  // Enable real-time patient monitoring for alert generation
  const { monitoring } = useMultiPatientMonitor(doctorInfo.id, !!doctorInfo.id);

  // Network status listener
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Role protection and doctor info setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("userType");
      if (!role) {
        router.push("/login");
      } else if (role !== "doctor") {
        router.push(`/${role}/dashboard`);
      } else {
        // Get doctor info for alert system
        const doctorId = localStorage.getItem("userId") || localStorage.getItem("username");
        const doctorName = localStorage.getItem("username") || "Doctor";
        setDoctorInfo({ id: doctorId, name: doctorName });
      }
    }
  }, [router]);

  // Fetch patients with offline support
  useEffect(() => {
    async function fetchPatients() {
      if (navigator.onLine) {
        try {
          const { loading, error, patients } = await FetchPatients(); // make sure FetchPatients returns a promise
          setLoading(loading);
          setError(error);
          setPatients(patients || []);
          localStorage.setItem("patientsData", JSON.stringify(patients || []));
        } catch (err) {
          setError("Failed to fetch patients.");
          const cached = localStorage.getItem("patientsData");
          if (cached) setPatients(JSON.parse(cached));
        } finally {
          setLoading(false);
        }
      } else {
        // Offline: read from cache
        const cached = localStorage.getItem("patientsData");
        if (cached) {
          setPatients(JSON.parse(cached));
          setLoading(false);
        } else {
          setError("No cached data available.");
          setLoading(false);
        }
      }
    }

    fetchPatients();
  }, []);

  const summaryStats = [
    {
      icon: <FaUsers size={36} className="text-blue-500 dark:text-gray-100" />,
      label: "Total Patients",
      value: patients.length.toString(),
    },
    { icon: <FaFileAlt size={36} className="text-blue-500 dark:text-gray-100" />, label: "Total Reports", value: "02" },
    { icon: <FaBell size={36} className="text-blue-500 dark:text-gray-100" />, label: "Appointments", value: "00" },
  ];

  const getStatusClasses = (status) => {
    const statusMap = {
      "Viral Fever": "text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100",
      "Kidney Heart-Attack": "text-black bg-yellow-500 dark:bg-yellow-500 dark:text-white",
      "Expired": "text-gray-700 bg-gray-100 dark:text-gray-100 dark:bg-gray-700",
      "Brain Tumor": "text-red-700 bg-red-100 dark:text-red-100 dark:bg-red-700",
    };
    return `px-2 py-1 font-semibold leading-tight rounded-full ${statusMap[status] || ""}`;
  };

  return (
    <AuthCheck>
      <DoctorSidebar>
        {isOffline && (
          <div style={{ background: "#ff9800", color: "white", textAlign: "center", padding: "0.5rem" }}>
            You are offline – showing last cached data.
          </div>
        )}

        <div className="flex items-center justify-between md:px-4 mb-4">
          <h1 className="prose lg:prose-xl font-bold dark:text-gray-100">Doctor Dashboard</h1>

          {/* Real-time Alert Notifications */}
          {doctorInfo.id && (
            <AlertNotifications
              doctorId={doctorInfo.id}
              doctorName={doctorInfo.name}
            />
          )}
        </div>

        {monitoring && (
          <div className="md:px-4 mb-2">
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Real-time patient monitoring active
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 py-4 md:px-4 gap-4">
          {summaryStats.map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-500 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium group"
            >
              {stat.icon}
              <div className="text-right">
                <p className="text-2xl">{stat.value}</p>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <h1 className="prose lg:prose-xl font-bold md:ml-4 dark:text-gray-100">All Clients</h1>

        <div className="mt-4 md:px-4">
          <div className="w-full overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800">
            <div className="w-full overflow-x-auto py-4 md:px-4">
              {loading && <p>Loading patients...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {!loading && !error && (
                <table className="w-full">
                  <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                      <th className="px-4 py-3">Patient</th>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                    {patients.map((p, idx) => (
                      <tr
                        key={idx}
                        className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center text-sm">
                            <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                              <Image
                                className="object-cover w-full h-full rounded-full"
                                src="/hacker.png"
                                alt={p.name}
                                loading="lazy"
                                width={512}
                                height={512}
                              />
                            </div>
                            <div>
                              <p className="font-semibold">{p.name}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{p.doctor}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{p.id}</td>
                        <td className="px-4 py-3 text-xs">
                          <span className={getStatusClasses(p.status)}>{p.status}</span>
                        </td>
                        <td className="px-4 py-3 text-sm">{p.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </DoctorSidebar>
    </AuthCheck>
  );
}
