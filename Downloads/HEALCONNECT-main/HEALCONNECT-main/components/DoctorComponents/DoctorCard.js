import React from 'react'
import { FaUser, FaAngleRight} from 'react-icons/fa';

export default function DoctorCard({name, speciality, email, uid, userRole}) {

  return (
    <>
      <td className="px-2 py-3">
        <div className="flex items-center text-sm">
          <div className="flex justify-center items-center w-10 h-10 mr-4 bg-gray-100 rounded-full transition-all duration-300 transform group-hover:rotate-12">
            <FaUser className="text-blue-500" size={26}/>
          </div>
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {speciality}
            </p>
          </div>
        </div>
      </td>
      <td><p className={` ${userRole === 'Admin' ? 'text-green-500' : 'text-blue-500'}`}>{userRole}</p></td>
      <td className="px-4 py-3 text-sm">{uid}</td>
      <td className="px-4 py-3 text-xs">
        <span className="px-2 py-1 font-semibold leading-tight rounded-full text-gray-600 dark:text-gray-400">
          {email}
        </span>
      </td>
      <td className="pl-4">View</td>
      <td>
      <FaAngleRight size={22}/>
      </td>
      </>
  );
}
