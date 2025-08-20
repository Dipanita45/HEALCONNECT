import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaAngleLeft, FaAngleRight, FaWindowClose } from "react-icons/fa";
import dynamic from "next/dynamic";

const AuthCheck = dynamic(() => import("@components/Auth/AuthCheck"), {ssr: false});
const ViewLivePatient = dynamic(() => import("@components/LiveMonitor/ViewLivePatient"), {ssr: false});
const ViewPatient = dynamic(() => import("@components/PatientComponents/ViewPatient"), {ssr: false});
const PatientStatus = dynamic(() => import("@components/PatientComponents/PatientStatus"), {ssr: false});

export default function Patient(props) {
  const router = useRouter();
  const { slug } = router.query;

  const [showModal, setShowModal] = useState(false);
  const [showLivePatient, setShowLivePatient] = useState(true);

  const handleSwitchComponent = () => {
    setShowLivePatient(!showLivePatient);
  };

  return (
    <main>
      <AuthCheck>
        <>
          {/* Patients Route */}
          <Link href={"/admin/patients"}>
            <div className=" mx-2 md:mx-4 my-2 btn btn-blue ">
              <FaAngleLeft size={24} className=" pt-1" />
              <p className=" py-1">Patients</p>
            </div>
          </Link>
        </>
        <>
          {showLivePatient && !showModal && (
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
              <button onClick={() => setShowModal(true)}>
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

        {showModal ? (
          <div className="fixed flex flex-col insert-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className=" relative top-20 md:mx-auto flex justify-between items-center flex-col w-auto md:w-1/4 h-auto rounded-lg shadow-xl p-2 bg-gray1 dark:bg-gray6">
              {/* <Image src={Trophy} width={100} height={100} objectFit="contain" /> */}
              <div className="flex w-full h-auto justify-end text-blue-500">
                <FaWindowClose size={20} onClick={() => setShowModal(false)} />
              </div>
              <h2 className="text-base mt-2 mx-4 text-gray7 font-semibold text-center">
                Update Patient Status
              </h2>
              <PatientStatus />
              <p className="mx-4 pb-8">
                Please select status option based on patients report.
              </p>
              <button className="my-5 w-auto px-8 h-10 bg-blue-600 text-white rounded-md shadow hover:shadow-lg font-semibold" onClick={null}>Update</button>
            </div>
          </div>
        ) : null}

        {showLivePatient ? (
          <ViewPatient patientID={slug} />
        ) : (
          <ViewLivePatient pationtID={slug} />
        )}
      </AuthCheck>
    </main>
  );
}
