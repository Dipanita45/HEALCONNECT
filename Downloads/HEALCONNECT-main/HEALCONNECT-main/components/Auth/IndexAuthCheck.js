import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "@lib/firebase"; 



import Link from 'next/link';
import { useContext } from "react";
import { UserContext } from "@lib/context";

export default function IndexAuthCheck(){
    const { userRole } = useContext(UserContext);
    const router = useRouter();
    const SignOutNow = () => {
      signOut(auth);
      router.push('/login');
    }

    return (
        <div className=" h-screen bg-gray-100 dark:bg-gray-900">
        <div className='container prose dark:prose-invert md:prose-lg lg:prose-xl sm:prose-sm'>
        <header className="text-center pt-20 ">
         <article>
         <h1>You Don{"'"}t Have <span className='gradient-text'>Access!</span></h1>
          <p>{`${userRole} dashboard can only accessed by Legitimate User.`}</p>
          <h2>Go to Dashboard</h2>
          { userRole === 'admin' ? <Link href="/admin/dashboard" className="btn btn-green btn-glow">Your Dashboard!</Link> : null}

          { userRole === 'doctor' ? <Link href="/doctor/dashboard" className="btn btn-green btn-glow">Your Dashboard!</Link> : null}

          { userRole === 'patient' ? <Link href="/patient" className="btn btn-green btn-glow">Your Dashboard!</Link> : null}

          <a className='px-4'>Or</a>
          <button className='btn btn-red' onClick={SignOutNow}>Sign Out</button>
         </article>
        </header>
        </div>
      </div>
    )
}