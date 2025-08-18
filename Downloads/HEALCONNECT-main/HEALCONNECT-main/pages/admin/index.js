import AuthCheck from "@components/Auth/AuthCheck";
import { UserContext } from "@lib/context";
import { useContext } from "react";
import { FaSpinner } from 'react-icons/fa';
import Dashboard from "./dashboard";
import IndexAuthCheck from "@components/Auth/IndexAuthCheck";

export default function Admin(props) {
  const {userRole, isUserLoading} = useContext(UserContext);

  return (
    <>
    { !isUserLoading ? (
    <AuthCheck>
      { userRole === 'admin' ? <Dashboard /> : <IndexAuthCheck/>}
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