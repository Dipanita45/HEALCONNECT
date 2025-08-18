import React from 'react'
import { FaUser, FaAngleRight} from 'react-icons/fa';

function PatientCard({name, number, city, uid, aadhar}) {
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
              {number}
            </p>
          </div>
        </div>
      </td>
      <td><p className='font-semibold'>{city}</p></td>
      <td className="px-4 py-3 text-sm">{uid}</td>
      <td className="px-4 py-3 text-xs">
        <span className="px-2 py-1 font-semibold leading-tight rounded-full text-gray-600 dark:text-gray-400">
          {aadhar}
        </span>
      </td>
      <td className="pl-4">View</td>
      <td>
      <FaAngleRight size={22}/>
      </td>
      </>
  )
}

export default PatientCard