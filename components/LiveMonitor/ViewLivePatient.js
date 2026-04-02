import React from "react";
import { FaAngleRight, FaSpinner } from "react-icons/fa";
import dynamic from "next/dynamic";
import { doc } from "firebase/firestore";
import { db } from "@lib/firebase";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";

const ECGMonitor = dynamic(() => import("@components/LiveMonitor/ECGMonitor"), { ssr: false })

/**
 * Component to view live health updates for a specific patient.
 * It fetches the patient's record to determine their assigned device and status.
 * @param {string} pationtID - The UID of the patient to monitor.
 * @param {string} deviceId - (Optional) The device ID to listen to.
 */
export default function ViewLivePatient({ pationtID, deviceId }) {
  const profileRef = doc(db, "patients", pationtID);
  const [profile, loading, error] = useDocumentDataOnce(profileRef);

  const activeDeviceId = deviceId || profile?.assignedDeviceId || "0001";
  const patientName = profile ? `${profile.firstName} ${profile.middleName || ''} ${profile.lastName}` : "kumar Pandule";
  const patientStatus = profile?.status || "Normal";

  return (
    <>
      <div className="flex flex-col mx-2 md:mx-8 my-2">
        <h1>Patient Info</h1>
        <div className=" px-4 py-2 my-2 flex flex-col md:flex-row overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800">
          {loading ? (
            <div className=" flex items-center gap-2 p-4 text-gray-500">
              <FaSpinner className="animate-spin" /> Loading patient info...
            </div>
          ) : error ? (
            <div className=" p-4 text-red-500">Error: {error.message}</div>
          ) : (
            <>
              <div className=" basis-1/6 flex flex-col justify-center items-start">
                <p className="text-gray-500 text-sm">UID:</p>
                <p className="font-semibold">{pationtID}</p>
                <div className="mt-1">
                   <p className="text-gray-500 text-sm">Device ID:</p>
                   <p className="font-semibold text-blue-500">{activeDeviceId}</p>
                </div>
              </div>
              <div className=" basis-1/6 flex flex-col justify-center items-start">
                <p className="text-gray-500 text-sm">Name:</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{patientName}</p>
                <div className="mt-1">
                   <p className="text-gray-500 text-sm">Status:</p>
                   <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      patientStatus === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                   }`}>
                      {patientStatus}
                   </span>
                </div>
              </div>
            </>
          )}
          <div className=" basis-1/6 flex flex-col justify-center items-start">
          </div>
          <div className=" basis-1/6"></div>
          <div className=" basis-1/6"></div>
          <div className=" basis-1/6">
          </div>
        </div>
      </div>
      <ECGMonitor deviceId={activeDeviceId} />
    </>
  )
}