import React from "react";
import { FaAngleRight } from "react-icons/fa";
import dynamic from "next/dynamic";

const ECGMonitor = dynamic(() => import("@components/LiveMonitor/ECGMonitor"), {ssr: false})

export default function ViewLivePatient({pationtID}){

    return(
      <>
        <div className="flex flex-col mx-2 md:mx-8 my-2">
        <h1>Patient Info</h1>
        <div className=" px-4 py-2 my-2 flex flex-col md:flex-row overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800">
          <div className=" basis-1/6 flex flex-col justify-center items-start">
          <p>UID: <span>{pationtID}</span></p>
         <p>Device ID: <span>0001</span></p>
          </div>
          <div className=" basis-1/6 flex flex-col justify-center items-start">
          <p>Name: <span>kumar Pandule</span></p>
          <p>Status: <span>Norml</span></p>
          </div>
          <div className=" basis-1/6 flex flex-col justify-center items-start">
          </div>
          <div className=" basis-1/6"></div>
          <div className=" basis-1/6"></div>
          <div className=" basis-1/6">
          {/* <button onClick={null}>
                <div className=" text-gray1 flex flex-row justify-between w-full h-auto rounded-lg shadow-xs bg-blue-500 overflow-x-auto my-2 p-2 md:p-4">
                  <h1>
                  Generate Patient{"'"}s {" "}
                    <span className="text-green-500">ECG</span> Report
                  </h1>
                  <FaAngleRight size={22} />
                </div>
              </button> */}
          </div>
        </div>
        </div>
      <ECGMonitor />
      </>
    )
  }