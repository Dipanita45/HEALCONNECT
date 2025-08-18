import PatientCard from "@components/PatientComponents/PatientCard";
import { doc, getFirestore } from "firebase/firestore";
import React, { useState } from "react";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import {FaSpinner} from "react-icons/fa";
import { PatientDetails, PatientMedicalHistory, PatientOtherHistory } from "@components/PatientComponents/PatientDetails";

export default function ViewPatient({ patientID }) {
    const loading = useState();
    const profileRef = doc(getFirestore(), "patients", patientID);
    const [profile] = useDocumentDataOnce(profileRef);
  
    return (
      <>
        {profile && (
          <>
            {/* Patient View */}
            <div className="text-gray-500  dark:text-gray-400">
              <div className="md:mx-8">
                <div className="w-full flex flex-col md:flex-row gap-4">
                  <div className=" basis-2/3">
                  <PatientDetails name={profile.firstName + " " + profile.middleName + " " + profile.lastName} gender={profile.gender} age={profile.age} marital={profile.maritalStatus} blood={profile.bloodGroup} height={profile.height} weight={profile.weight} number={profile.number} address={profile.address} />
                  </div>
                  <div className="basis-1/3 flex flex-col gap-4">
                      <div className=" basis-1/2"><PatientMedicalHistory /></div>
                      <div className=" basis-1/2"><PatientOtherHistory /></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Reports */}
            <div className="mx-2 md:mx-8">
              <h1 className="prose lg:prose-lg font-bold md:ml-4 py-2 dark:text-gray1">
                All Reports
              </h1>
              <div className="w-full overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800 mx-0 md:mx-2">
                <div className="w-full overflow-x-auto p-2 md:p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                        <th className="px-4 py-3">Patients</th>
                        <th className="pr-4 py-3">Location</th>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Identy</th>
                        <th className="px-4 py-3">Edit</th>
                      </tr>
                    </thead>
                    {loading && (
                      <tbody>
                        <tr>
                          <td></td>
                          <td></td>
                          <td>
                            <FaSpinner
                              className=" my-40 animate-spin text-blue-500"
                              size={40}
                            />
                          </td>
                        </tr>
                      </tbody>
                    )}
  
                    {!loading && (
                      <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                        {patients.map((patient) => (
                          <tr
                            key={patient.id}
                            onClick={() =>
                              router.push(`/admin/patients/${patient.id}`)
                            }
                            className=" w-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400 cursor-pointer"
                          >
                            <PatientCard
                              name={
                                patient.firstName +
                                " " +
                                patient.middleName +
                                " " +
                                patient.lastName
                              }
                              number={patient.number}
                              city={patient.city}
                              uid={patient.id}
                              aadhar={patient.aadhar}
                            />
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }