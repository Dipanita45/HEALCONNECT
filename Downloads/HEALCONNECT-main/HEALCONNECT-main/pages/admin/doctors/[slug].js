import AdminSidebar from '@components/Sidebar/AdminSidebar';
import AuthCheck from '@components/Auth/AuthCheck'
import { doc, getFirestore } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { FaSpinner, FaAngleRight } from 'react-icons/fa';


export default function DoctorEdit(props) {
  return (
    <AuthCheck>
        <AdminSidebar>
        <EditDoctor />
        </AdminSidebar>
    </AuthCheck>
  )
}

function EditDoctor(){
    const router = useRouter();
    const { slug } = router.query;

    const profileRef = doc(getFirestore(), 'users', slug)
    const [profile] = useDocumentDataOnce(profileRef)

    return (
      <>
      {(profile) && (
        <>
         <div className=" flex flex-row justify-start items-center dark:text-gray3">
          <Link href={'/admin/doctors'}>
          <p>Doctors</p>
          </Link>
          <FaAngleRight size={18} className=' pt-1' />
          <p>{profile.name}</p> 
          <FaAngleRight size={18} className=' pt-1' />
        </div>


        <article className=' prose dark:prose-invert md:prose-base xl:prose-lg sm:prose-sm'>
          <h3>{profile.name}</h3>
        </article>
        </>
      )}
      </>
    );
}