import React from 'react'
import { UserContext } from "@lib/context";
import { useContext } from "react";
import { FaSpinner } from 'react-icons/fa';
import Dashboard from './dashboard';
import dynamic from 'next/dynamic';
import IndexAuthCheck from '@components/Auth/IndexAuthCheck';

const AuthCheck = dynamic(() => import("@components/Auth/AuthCheck"), {ssr: false});

export default function Doctor() {
  const {userRole, isUserLoading} = useContext(UserContext);

  return (
    <>
    { !isUserLoading ? (
    <AuthCheck>
      { userRole === 'doctor' ? <Dashboard /> : <IndexAuthCheck/>}
    </AuthCheck>
    )
  :(
    <main className="h-full w-full flex items-center justify-center object-center align-middle">
      <FaSpinner className=' animate-spin text-green-500 text-center object-center align-middle' size={40}/>
    </main>
  )
  }
  </>
  );
}
