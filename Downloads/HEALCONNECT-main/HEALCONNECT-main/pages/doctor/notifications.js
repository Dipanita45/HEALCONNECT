import dynamic from "next/dynamic";
import React from "react";

const AuthCheck = dynamic(() => import("@components/Auth/AuthCheck"), {ssr: false});
const DoctorSidebar = dynamic(() => import("@components/Sidebar/DoctorSidebar"), {ssr: false});

export default function Notifications() {
  return (
    <AuthCheck>
    <DoctorSidebar>
    <div className='flex h-full flex-col justify-center items-center'>
      <h1 className='text-5xl text-center prose dark:prose-invert mb-5 font-bold'>Notifications</h1>
      <span className='text-7xl'>💬</span>
    </div>
    </DoctorSidebar>
    </AuthCheck>
  );
}
