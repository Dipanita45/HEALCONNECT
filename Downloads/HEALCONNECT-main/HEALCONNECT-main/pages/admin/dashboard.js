import React from 'react'
import AdminSidebar from "@components/Sidebar/AdminSidebar";
import AuthCheck from "@components/Auth/AuthCheck";
import { FaFileAlt, FaBell, FaUsers, FaAngleLeft, FaAngleRight} from 'react-icons/fa';
import Image from 'next/image';

export default function Dashboard(props) {
  return (
    <AuthCheck>
      <AdminSidebar>
        <h1 className="prose lg:prose-xl font-bold md:ml-4 dark:text-gray1">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 py-4 md:px-4 gap-4 ">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-500 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium group">
                <FaUsers className='text-blue-500 dark:text-gray-100' size={36} />
            <div className="text-right">
              <p className="text-2xl">01</p>
              <p>Total Patients</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-500 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium group">
                <FaFileAlt className='stroke-current text-blue-500 dark:text-gray-100 ' size={36} />
            <div className="text-right">
              <p className="text-2xl">02</p>
              <p>Total Reports</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-500 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium group">
                <FaBell className='stroke-current text-blue-500 dark:text-gray-100' size={36} />
            <div className="text-right">
              <p className="text-2xl">03</p>
              <p>Appointments</p>
            </div>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-2 p-4 gap-4">
                <div className="relative flex flex-col min-w-0 h-96 mb-4 lg:mb-0 break-words bg-gray-50 dark:bg-gray-800 w-full shadow-lg rounded">
                  <div className="rounded-t mb-0 px-0 border-0">
                    <div className="flex flex-wrap items-center px-4 py-2">
                      <div className="relative w-full max-w-full flex-grow flex-1">
                        <h3 className="font-semibold text-base text-gray-900 dark:text-gray-50">
                          Social Traffic
                        </h3>
                      </div>
                      <div className="relative w-full max-w-full flex-grow flex-1 text-right">
                        <button
                          className="bg-blue-500 dark:bg-gray-100 text-white active:bg-blue-600 dark:text-gray-800 dark:active:text-gray-700 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                        >
                          See all
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative flex flex-col min-w-0 h-96 break-words bg-gray-50 dark:bg-gray-800 w-full shadow-lg rounded">
                  <div className="rounded-t mb-0 px-0 border-0">
                    <div className="flex flex-wrap items-center px-4 py-2">
                      <div className="relative w-full max-w-full flex-grow flex-1">
                        <h3 className="font-semibold text-base text-gray-900 dark:text-gray-50">
                          Recent Activities
                        </h3>
                      </div>
                      <div className="relative w-full max-w-full flex-grow flex-1 text-right">
                        <button
                          className="bg-blue-500 dark:bg-gray-100 text-white active:bg-blue-600 dark:text-gray-800 dark:active:text-gray-700 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                        >
                          See all
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

        <h1 className="prose lg:prose-xl font-bold md:ml-4 dark:text-gray1">All Clients</h1>
        <div className="mt-4 md:px-4">
          <div className="w-full overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800">
            <div className="w-full overflow-x-auto py-4 md:px-4">
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
                  <tr className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                          <Image
                            className="object-cover w-full h-full rounded-full"
                            src="/hacker.png"
                            alt=""
                            loading="lazy"
                            width={512}
                            height={512}
                          />
                          <div
                            className="absolute inset-0 rounded-full shadow-inner"
                            aria-hidden="true"
                          ></div>
                        </div>
                        <div>
                          <p className="font-semibold">Kumar Pandule</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Dr Vishal Deshpande
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">#001</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                        {" "}
                        Virel Fevr{" "}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">15-01-2021</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                        <Image
                            className="object-cover w-full h-full rounded-full"
                            src="/hacker.png"
                            alt=""
                            loading="lazy"
                            width={512}
                            height={512}
                          />
                          <div
                            className="absolute inset-0 rounded-full shadow-inner"
                            aria-hidden="true"
                          ></div>
                        </div>
                        <div>
                          <p className="font-semibold">Nandita Sharma</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Dr Hema Pawar
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">#002</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-1 font-semibold leading-tight text-black bg-yellow-500 rounded-full dark:bg-yellow-500 dark:text-white">
                        {" "}
                        Kidney heart-attack{" "}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">15-01-2021</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                        <Image
                            className="object-cover w-full h-full rounded-full"
                            src="/hacker.png"
                            alt=""
                            loading="lazy"
                            width={512}
                            height={512}
                          />
                          <div
                            className="absolute inset-0 rounded-full shadow-inner"
                            aria-hidden="true"
                          ></div>
                        </div>
                        <div>
                          <p className="font-semibold">Dushman</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Dr Kumar Pandule
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">#003</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-1 font-semibold leading-tight text-gray-700 bg-gray-100 rounded-full dark:text-gray-100 dark:bg-gray-700">
                        {" "}
                        Expired{" "}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">09-02-2021</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                        <Image
                            className="object-cover w-full h-full rounded-full"
                            src="/hacker.png"
                            alt=""
                            loading="lazy"
                            width={512}
                            height={512}
                          />
                          <div
                            className="absolute inset-0 rounded-full shadow-inner"
                            aria-hidden="true"
                          ></div>
                        </div>
                        <div>
                          <p className="font-semibold">Kumar Pandule</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Dr Vishal Deshpande
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">#001</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                        {" "}
                        Virel Fevr{" "}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">15-01-2021</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                        <Image
                            className="object-cover w-full h-full rounded-full"
                            src="/hacker.png"
                            alt=""
                            loading="lazy"
                            width={512}
                            height={512}
                          />
                          <div
                            className="absolute inset-0 rounded-full shadow-inner"
                            aria-hidden="true"
                          ></div>
                        </div>
                        <div>
                          <p className="font-semibold">Someone else</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Dr Someone
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">#004</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-700">
                        {" "}
                        Brain Tumar{" "}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">11-01-2021</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
              <span className="flex items-center col-span-3">
                {" "}
                Showing 21-30 of 100{" "}
              </span>
              <span className="col-span-2"></span>
              <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                <nav aria-label="Table navigation">
                  <ul className="inline-flex items-center">
                    <li>
                      <button
                        className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                        aria-label="Previous"
                      >
                      <FaAngleLeft size={16}/>
                      </button>
                    </li>
                    <li>
                      <button className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
                        1
                      </button>
                    </li>
                    <li>
                      <button className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
                        2
                      </button>
                    </li>
                    <li>
                      <button className="px-3 py-1 text-white dark:text-gray-800 transition-colors duration-150 bg-blue-600 dark:bg-gray-100 border border-r-0 border-blue-600 dark:border-gray-100 rounded-md focus:outline-none focus:shadow-outline-purple">
                        3
                      </button>
                    </li>
                    <li>
                      <button className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
                        4
                      </button>
                    </li>
                    <li>
                      <span className="px-3 py-1">...</span>
                    </li>
                    <li>
                      <button className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
                        8
                      </button>
                    </li>
                    <li>
                      <button className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
                        9
                      </button>
                    </li>
                    <li>
                      <button
                        className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
                        aria-label="Next"
                      >
                          <FaAngleRight size={16}/>
                      </button>
                    </li>
                  </ul>
                </nav>
              </span>
            </div>
          </div>
        </div>
      </AdminSidebar>
    </AuthCheck>
  )
}
