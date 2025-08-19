import IndexAuthCheck from '@components/Auth/IndexAuthCheck';
import { UserContext } from '@lib/context';
import { useContext, useEffect } from 'react'
import Dashboard from './dashboard';

export default function Patient(){
  const { userRole } = useContext(UserContext);
    return (
      <>
      {userRole !== 'patient' ? IndexAuthCheck() : <Dashboard />}
      </>
    )
}

