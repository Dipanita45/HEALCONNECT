import AuthCheck from "@components/Auth/AuthCheck";
import AdminSidebar from "@components/Sidebar/AdminSidebar";
import FetchDoctors from "@lib/fetchDoctors";
import AddDoctor from "@lib/addDoctor";
import DoctorCard from "@components/DoctorComponents/DoctorCard";
import { FaSpinner, FaAngleRight } from 'react-icons/fa';
import { useRouter } from "next/router";

export default function Doctors(props) {
  const { doctors, loading } = FetchDoctors()
  const router = useRouter();

  return (
    <AuthCheck>
      <AdminSidebar>
        <div className=" flex flex-row justify-start items-center dark:text-gray3">
          <p>Doctors</p>
          <FaAngleRight size={18} className=' pt-1' />
        </div>

        {/* Add Doctor */}
        <div>
          <h1 className="prose lg:prose-xl font-bold md:ml-4 py-2 dark:text-gray1">
            Add Doctor
          </h1>
          <div className="md:mx-4">

           <AddDoctor />

           </div>
        </div>

        {/* Doctors List */}
        <div>
          <h1 className="prose lg:prose-xl font-bold md:ml-4 py-2 dark:text-gray1">
            All Doctors
          </h1>
          <div className="md:mx-4">
            <div className="w-full overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800">
              <div className="w-full overflow-x-auto p-2 md:p-4">

                <table className="w-full">
                  <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                      <th className="px-4 py-3">Doctor</th>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Email</th>
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
                      {doctors.map(doctor => (
                         <tr key={doctor.id} onClick={() => router.push(`/admin/doctors/${doctor.uid}`)} className=" w-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400 cursor-pointer">
                        <DoctorCard name={doctor.name} speciality={doctor.speciality} email={doctor.email} uid={doctor.uid} userRole={doctor.role} />
                        </tr>
                        ))}
                    </tbody>
                   )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </AdminSidebar>
    </AuthCheck>
  );
}

