import PatientCard from "@components/PatientComponents/PatientCard";
import FetchPatients from "@lib/fetchPatients";
import { useRouter } from "next/router";
import { FaAngleRight, FaSpinner, FaSearch } from 'react-icons/fa';
import dynamic from 'next/dynamic';

const AuthCheck = dynamic(() => import("@components/Auth/AuthCheck"), {ssr: false});
const DoctorSidebar = dynamic(() => import("@components/Sidebar/DoctorSidebar"), {ssr: false});

export default function Patients(prose) {
  const router = useRouter();
  const { patients, loading } = FetchPatients();

  return (
    <AuthCheck>
    <DoctorSidebar>
        {/* Patients Route */}
        <div className=" flex flex-row justify-start items-center dark:text-gray3">
          <a>Patients</a>
          <FaAngleRight size={18} className=' pt-1' />
        </div>

        {/* Patients List */} 
        <div>
          <div className="w-full overflow-hidden rounded-lg shadow-xs">
            <div className="w-full overflow-x-auto p-2 md:p-4">
             <div className="flex flex-row flex-wrap w-full h-auto"></div>
             <div className="w-full md:w-1/4 flex flex-col">
              <h2 className="prose dark:text-gray1 text-gray6 font-bold">Search</h2>
                <div className="relative flex items-center w-full h-10 rounded-lg focus-within:shadow-lg bg-white dark:bg-gray-700 overflow-hidden">
                  <div className="grid place-items-center h-full w-12 text-gray-300">
                    <FaSearch />
                  </div>
                  <input
                    className="peer h-full w-full outline-none text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 pr-2"
                    type="text"
                    id="search"
                    placeholder="Search something.." />
                </div>
             </div>
            </div>
          </div>
        </div>
        <hr className=" md:mx-4 my-2 bg-gray-200 dark:bg-gray-800 border border-blue-400 dark:border-blue-400 rounded-full " />

        {/* Patients List */}
        <div>
          <h1 className="prose lg:prose-lg font-bold md:ml-4 py-2 dark:text-gray1">
            All Patients
          </h1>
          <div className="md:mx-4">
            <div className="w-full overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800">
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
                  {(loading) && (
                    <tbody>
                      <tr>
                      <td></td>
                      <td></td>
                      <td><FaSpinner className=' my-40 animate-spin text-blue-500' size={40}/></td>
                    </tr>
                    </tbody>
                  )}  

                    {(!loading) && (
                    <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                      {patients.map(patient => (
                         <tr key={patient.id} onClick={() => router.push(`/doctor/patients/${patient.id}`)} className=" w-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400 cursor-pointer">
                        <PatientCard name={patient.firstName +' '+ patient.middleName +' '+ patient.lastName} number={patient.number} city={patient.city} uid={patient.id} aadhar={patient.aadhar}/>
                        </tr>
                        ))}
                    </tbody>
                   )}
                </table>
              </div>
            </div>
          </div>
        </div>
    </DoctorSidebar>
    </AuthCheck>
  );
}
