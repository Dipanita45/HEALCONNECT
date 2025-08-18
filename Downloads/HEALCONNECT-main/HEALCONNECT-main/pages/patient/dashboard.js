import AuthCheck from "@components/Auth/AuthCheck";
import PatientSidebar from "@components/Sidebar/PatientSidebar";
import { UserContext } from "@lib/context";
import Image from "next/image";
import { useContext } from "react";
import { FaEdit, FaSpinner } from "react-icons/fa";


export default function Dashboard(params) {
    const { currentUser } = useContext(UserContext);
    return (
        <AuthCheck>
            <PatientSidebar>
                <div className="p-2 w-full h-full flex flex-col">
                <h1 className="prose lg:prose-lg font-bold md:ml-4 py-2 dark:text-gray1">
                Patient Dashboard</h1>
                    <div className="flex flex-row w-full h-auto gap-4">
                        <div className=" basis-2/4 flex">
                            <div className="w-full h-full bg-white rounded-lg shadow-lg p-2">
                                <div className="flex flex-row w-full h-auto">
                                    <div className=" basis-1/4 flex p-2">
                                        <div className=" flex flex-col justify-center text-center">
                                            <Image
                                                className="mx-auto p-1 w-1/4 h-auto md:h-32 md:w-32 rounded-full ring-2 md:ring-4 ring-green-500 "
                                                src={currentUser?.img || '/hacker.png'}
                                                alt="Avatar"
                                                width={512}
                                                height={512}
                                            />
                                            <h2 className="text-xl py-2 text-green-500 font-bold ">
                                                {"Healthy"}</h2>
                                        </div>
                                    </div>
                                    <div className=" basis-3/4 flex flex-col p-2">
                                            <h1 className="text-2xl font-bold text-gray-900 pb-2">Welcome Patient</h1>
                                            <h2 className="text-xl font-bold text-gray-900">
                                                {"Name: " + currentUser?.name}</h2>
                                            <h2 className="text-xl font-bold text-gray-900">
                                                {"Email: " + currentUser?.email}</h2>
                                            <h2 className="text-xl font-bold text-gray-900">
                                                {"Number: " + currentUser?.number}</h2>
                                            <h2 className=" bg-gray2 rounded-lg p-2 my-2 text-gray-900">
                                                {"You tracked your health on Monday 21/04/2023 last time."}</h2>
                                            <p className="text-blue-500">View last report!</p>
                                    </div>
                                    <div className=" flex flex-col ">
                                     <FaEdit size={20} className="text-blue-500"/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className=" basis-1/4 flex">
                            <div className="w-full h-full bg-white rounded-lg shadow-lg p-2">
                                <div className="flex flex-col w-full h-auto">
                                            <h1 className="text-xl font-bold text-gray-900">Patient</h1>
                                             <hr className="m-1 bg-gray-200 dark:bg-gray-800 border border-blue-400 dark:border-blue-400 
                                             rounded-full"/>
                                <div className=" flex flex-row w-full">
                                    <div className=" p-2 basis-1/2 flex flex-col">
                                    <h2 className="text-base text-gray-900">{"Age: "}<span>{"22"}</span></h2>
                                             <h2 className="text-base text-gray-900">{"Blood Group: "}<span>{"B+"}</span></h2>
                                             <h2 className="text-base text-gray-900">{"Weight: "}<span>{"90 KG"}</span></h2>
                                             <h2 className="text-base text-gray-900">{"Height: "}<span>{"185 CM"}</span></h2>
                                            <h2 className="text-base text-gray-900">{"Diabetes status: "}<span className="text-green-500">{"No"}</span></h2>
                                            <h2 className="text-base text-gray-900">{"Surgical History: "}<span className="text-green-500">{"No"}</span></h2>
                                            <h2 className="text-base text-gray-900">{"Cardiac History: "}<span className="text-green-500">{"No"}</span></h2>
                                    </div>
                                    <div className=" p-2 basis-1/2 w-full">
                                    <div className=" flex flex-col justify-center text-center">
                                            <Image
                                                className="mx-auto p-6"
                                                src="https://firebasestorage.googleapis.com/v0/b/health-monitoring-system-7885c.appspot.com/o/Images%2Fpatient.png?alt=media&token=741d8ff4-d483-49fb-9355-11374b1fb12f"
                                                alt="Avatar"
                                                width={512}
                                                height={512}
                                            />
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>


            <div className="mx-2 md:mx-0">
              <h1 className="prose lg:prose-lg font-bold md:ml-4 py-2 dark:text-gray1">
                Recent Reports
              </h1>
              <div className="w-full overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800 mx-0 ">
                <div className="w-full overflow-x-auto p-2 md:p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                        <th className="px-4 py-3">Report Name</th>
                        <th className="pr-4 py-3">ID</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Doctor</th>
                      </tr>
                    </thead>
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
                  </table>
                </div>
              </div>
            </div>
                </div>
            </PatientSidebar>
        </AuthCheck>
    )
};
