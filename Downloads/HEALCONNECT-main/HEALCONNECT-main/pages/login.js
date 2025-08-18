import React, { useContext, useEffect} from 'react'
import { UserContext } from '@lib/context';
import { useRouter } from 'next/router';
import SignIn from '@components/Auth/SignIn';

export default function Login(props) {
  const { user } = useContext(UserContext);
  const router = useRouter();
  useEffect(() => {
    if (!user){
      router.push('/login')
    }else{
      router.push('/profile')
    }
  }, [user])

  return (
     <SignIn />
  );
}