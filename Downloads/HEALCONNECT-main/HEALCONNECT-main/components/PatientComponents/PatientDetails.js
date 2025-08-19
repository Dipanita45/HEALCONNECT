import React from "react";
import {FaUserAlt} from "react-icons/fa";

export function PatientDetails({name, gender, age, marital, blood, height, weight, number, address}){

    return(
            <div className=" mx-2 flex flex-col">
              <h1 className="prose font-bold py-2">
                Patient Details
              </h1>
              <div className="rounded-lg shadow-xs bg-white dark:bg-gray-800 overflow-x-auto p-2 ">
                <div className="flex flex-col w-full h-auto">
                  <div className="flex flex-col md:flex-row w-auto ">
                    <div className=" m-auto">
                      <FaUserAlt
                        size={80}
                        className=" p-2 m-2 rounded-full ring-4 ring-green-400 text-blue-400"
                      />
                    </div>
                    <div className="flex flex-col w-full md:mx-10 py-4">
                      <p>Name :{" "}<span>{name}</span></p>
                      <div className="flex flex-row justify-between py-2">
                      <p>Gender : <span>{gender}</span></p>
                      <p>Age : <span>{age}</span></p>
                      <p>Marital Status :{" "}<span>{marital}</span></p>
                      </div>
                      <div className="flex flex-row justify-between py-2 text-blue-400">
                      <p>Blood Group : <span>{blood}</span></p>
                      <p>Height : <span>{height}</span></p>
                      <p>Weight : <span>{weight}</span></p>
                      </div>
                    </div>
                  </div>
                  <hr className=" md:mx-4 my-2 bg-gray-200 dark:bg-gray-800 border border-blue-400 dark:border-blue-400 rounded-full " />
                  <div className="flex flex-col h-auto w-auto mx-4 py-2">
                  <p>Contact No : <span>{number}</span></p>
                  <div className="flex flex-row w-auto">
                  <p>Address</p>
                  <span className="mx-2">{":" + " "}{address}</span>
                  </div>
                  </div>
                  <hr className=" md:mx-4 my-2 bg-gray-200 dark:bg-gray-800 border border-blue-400 dark:border-blue-400 rounded-full " />
                  <div className="flex flex-row w-auto mx-4">
                    <p>Previous Hospitality Status</p>
                    <div className="flex flex-col h-auto w-auto mx-2 py-1">
                      <span className="mx-2">
                        {":" + " " + "Deenanath Mangeshkar Hospital - Pune"}
                      </span>
                      <p className="px-4">on 24 Jan 2023</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    )
}

export function PatientMedicalHistory(){
  return(
    <div>
    <div className=" mx-2 flex flex-col h-full">
      <h1 className="prose font-bold py-2">
        Medical History
      </h1>
      <div className="rounded-lg shadow-xs bg-white dark:bg-gray-800 overflow-x-auto p-2">
        <div className="flex flex-col w-full h-auto gap-2 justify-start md:px-4">
          <div className="flex flex-row w-auto h-auto gap-10">
            <p>
              Diabetes status : <span>NO</span>
            </p>
            <p>
              Cardiac History : <span>NO</span>
            </p>
          </div>
          <div className="flex flex-row w-auto h-auto gap-10">
            <p>
              Surgical History : <span>NO</span>
            </p>
            <p>
              Any Fall Incidance : <span>NO</span>
            </p>
          </div>
          <div className="flex flex-row w-auto h-auto gap-10">
            <p>
              Neuro-Logical History : <span>NO</span>
            </p>
            <p>
              Neuro-Logical History : <span>NO</span>
            </p>
          </div>
        </div>
        <hr className=" md:mx-4 my-2 bg-gray-200 dark:bg-gray-800 border border-blue-400 dark:border-blue-400 rounded-full " />
      </div>
    </div>
    </div>
  )
}

export function PatientOtherHistory(){
  return(
    <div className="mx-2 flex flex-col h-full">
    <h1 className=" basis-1/6 prose font-bold py-2 dark:text-gray1">
      Other History
    </h1>
    <div className=" basis-5/6 rounded-lg shadow-xs h-full bg-white dark:bg-gray-800 overflow-x-auto p-2">
      <div className="flex flex-col w-full h-auto gap-2 justify-start md:px-4">
        <div className="flex flex-row w-auto h-auto gap-10">
          <p>
            History Not Found!<span></span>
          </p>
        </div>
      </div>
      <hr className=" md:mx-4 my-2 bg-gray-200 dark:bg-gray-800 border border-blue-400 dark:border-blue-400 rounded-full " />
    </div>
  </div>
  )
}