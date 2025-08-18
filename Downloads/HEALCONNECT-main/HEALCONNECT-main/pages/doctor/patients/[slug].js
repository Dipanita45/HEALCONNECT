import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaAngleLeft,FaAngleRight } from "react-icons/fa";
import dynamic from "next/dynamic";

const AuthCheck = dynamic(() => import("@components/Auth/AuthCheck"), {ssr: false});
const ViewLivePatient = dynamic(() => import("@components/LiveMonitor/ViewLivePatient"), {ssr: false});
const ViewPatient = dynamic(() => import("@components/PatientComponents/ViewPatient"), {ssr: false});


export default function Patient(props) {
  const router = useRouter();
  const { slug } = router.query;

  const [showLivePatient, setShowLivePatient] = useState(true);

  const handleSwitchComponent = () => {
    setShowLivePatient(!showLivePatient);
  };

  return (
    <main>
    <AuthCheck>
      <>
        {/* Patients Route */}
        <Link href={"/doctor/patients"}>
          <div className=" mx-2 md:mx-4 my-2 btn btn-blue ">
            <FaAngleLeft size={24} className=" pt-1" />
            <p className=" py-1">Patients</p>
          </div>
        </Link>
      </>
      <>
        {showLivePatient && (
          <div className="mx-2 md:mx-4 text-gray1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:px-4 gap-1">
            <button onClick={handleSwitchComponent}>
              <div className=" flex flex-row justify-between w-full h-auto rounded-lg shadow-xs bg-blue-500 overflow-x-auto my-2 p-2 md:p-4">
                <h1>
                  Track Patient{"'"}s Health{" "}
                  <span className="text-green-500">Live</span>
                </h1>
                <FaAngleRight size={22} />
              </div>
            </button>
            <button onClick={null}>
              <div className=" flex flex-row justify-between w-full h-auto rounded-lg shadow-xs bg-blue-500 overflow-x-auto my-2 p-2 md:p-4">
                <h1>
                  Update Patient{"'"}s{" "}
                  <span className="text-orange-500">Status</span>
                </h1>
                <FaAngleRight size={22} />
              </div>
            </button>
            <button onClick={null}>
              <div className=" flex flex-row justify-between w-full h-auto rounded-lg shadow-xs bg-blue-500 overflow-x-auto my-2 p-2 md:p-4">
                <h1>
                  Generate Patient{"'"}s{" "}
                  <span className=" text-gray6">report</span>
                </h1>
                <FaAngleRight size={22} />
              </div>
            </button>
          </div>
        )}
      </>
      {showLivePatient ? <ViewPatient patientID={slug} /> : <ViewLivePatient pationtID={slug} />}
    </AuthCheck>
    </main>
  );
}
