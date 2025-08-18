import React, { useContext, useState } from 'react'
import Link from 'next/link';
import { UserContext } from '@lib/context';
import Loader from '@components/Loader';
import Footer from 'pages/footer';
import UpdateProfile from './UpdateProfile';
import Image from 'next/image';

export default function ProfileView() {
    const { userRole, currentUser, isUserLoading } = useContext(UserContext);
    const [update, setUpadate] = useState(false);
    console.log(update)
    const Update = () => {
      setUpadate(true)
    }
    return (
      <>
        <Loader show={isUserLoading} />
        {(!isUserLoading) && (
          <main className="h-auto w-full bg-gray-100 dark:bg-gray-900">
            {(!update) && (
            <div className="container p-8">
              <header className="mx-auto text-center mb-8 mt-6 prose dark:prose-invert md:prose-base lg:prose-lg sm:prose-sm">
                <h1 className=" text-gray6 dark:text-gray1">Profile</h1>
                <div className="mx-auto w-24 h-1 my-12 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"></div>
              </header>
              <div>
                <div className=" flex flex-col justify-center text-center">
                  <Image
                    className="mx-auto p-1 w-1/4 h-auto md:h-32 md:w-32 rounded-full ring-2 md:ring-4 ring-green-500 "
                    src={currentUser?.img || '/hacker.png'}
                    alt="Avatar"
                    width={512}
                    height={512}
                  />
                  <h1 className=' py-2 mx-auto text-center prose dark:prose-invert text-xl md:text-4xl'>
                    Welcome{" "}
                    <span className=" gradient-text">{currentUser?.name || currentUser?.fir}</span>
                  </h1>
                  <Link href={`/${userRole}`} className=" mx-auto mb-2 text-center font-display text-base font-normal text-green-500 border-green-400 border-2 rounded-md px-4 py-1 hover:drop-shadow-[0_0_9px_rgba(34,197,94,0.9)]">{userRole}</Link>
                </div>
                <div className="md:mx-4">
                  <div className=" mx-auto px-4 w-full md:w-1/2 overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800 text-sm md:text-lg text-gray-5 dark:text-gray1">
                    <div className="w-full overflow-x-auto p-2 md:p-4">
                      <article className=" pt-2 mx-auto space-y-4">
                        <p>
                          User ID: <span>{currentUser?.uid}</span>
                        </p>
                        <p>
                          Account Name: <span>{currentUser?.name}</span>
                        </p>
                        <p>
                          Account Email: <span>{currentUser !== '' ? 'Email Not Mentioned!' : currentUser?.email}</span>
                        </p>
  
                        <p>Go to Dashboard</p>
                        { userRole === 'patient' ? <Link href="/patient" className="btn btn-green btn-glow font-bold text-gray7">Your Dashboard!</Link> : null}

                        { userRole === 'admin' ? <Link href="/admin" className="btn btn-green btn-glow font-bold text-gray7">Your Dashboard!</Link> : null }
                        
                        { userRole === 'doctor' ? <Link href="/doctor" className="btn btn-green btn-glow text-gray7">Your Dashboard!</Link> : null }

                        { userRole != 'patient' && userRole != 'admin' && userRole != 'doctor' ? (<div>No User Found!</div>) : null}

                        <a className="px-4">Or</a>
                        <button className="btn btn-red btn-glow text-gray7" onClick={() => auth.signOut()}>Sign Out</button>
                        
                      </article>
                    </div>
                  </div>
                </div>
                <article className=" pt-20 mx-auto text-center prose dark:prose-invert md:prose-base lg:prose-lg sm:prose-sm">
                  <h1 className=" text-gray6 dark:text-gray1">
                    Manage account
                  </h1>
                  <div className="mx-auto w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
                  <div className=' pt-10'></div>
                </article>
                <div className="md:mx-4">
                  <div className=" mx-auto px-4 w-full md:w-1/2 overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800 text-sm md:text-lg text-gray-5 dark:text-gray1">
                    <div className=" flex flex-col w-2/5 p-2 md:p-4">
                      <button onClick={Update} className=' btn btn-blue my-2'>Update Account</button>
                    </div>
                  </div>
                </div>
  
                <article className=" pt-20 mx-auto prose dark:prose-invert md:prose-base lg:prose-lg sm:prose-sm">
                  <h1 className=" text-gray6 dark:text-gray1 text-center">FAQ</h1>
  
                  <div className="mx-auto w-24 h-1 my-12 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"></div>
  
                  <h3 className="font-sans font-bold">How To View and Add Patients?</h3>
  
                  <p>You need to go to your Dashboard apperd on profile. If not, you can access with the <span>/doctor</span> command in Discord</p>
  
                  <h3 className="font-sans font-bold">Can I customize my account details?</h3>
  
                  <p>Yes, you can modify your name and address by clicking the <span>update account</span> button above. Once updated, it should be reflected on all profile page.</p>
  
                  <h3 className="font-sans font-bold">How do I delete my patient?</h3>
  
                  <p>Click the <span>patients</span> button option in your dashboard. Then you can find the patient by using there name or patient ID.</p>
                </article>
              </div>
            </div>
            )} 
            {(update) && (
              <UpdateProfile />
            )}
            <Footer />
          </main>
        )}
      </>
    );
  }

