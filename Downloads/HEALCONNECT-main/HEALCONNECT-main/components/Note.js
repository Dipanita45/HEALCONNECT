import React from 'react'
import { FaExclamationCircle } from 'react-icons/fa';

export default function Note({note}) {
  return (
    <div className=' h-auto w-auto border border-solid border-red-400 rounded-lg'>
    <div className=' bg-red-100 h-full w-full rounded-lg'>
     <article className=' opacity-100 '>
      <div className=' flex flex-row px-3 pt-2 justify-start'>
      <FaExclamationCircle className=' text-gray6 m-1'/><span className=' pr-2'>{'Note: '}</span>
      </div>
      <p className=' px-4'>{note}</p>
     </article>
    </div>
    </div>
  )
}
