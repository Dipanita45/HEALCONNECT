// pages/_app.js
import '@styles/app.scss';
/*import { useState } from 'react';
import { UserContext } from '@/lib/context';
import Navbar from '@/components/Navbar';
export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  return (

    <UserContext.Provider value={{ user, setUser, userRole, setUserRole, currentUser, setCurrentUser }}>
       <Navbar />     
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}
*/
// src/App.jsx
// pages/_app.js
// pages/_app.js
import '../styles/globals.css';  // global styles
import Navbar from '../components/navbar';
import '../components/Navbar.module.css'
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}

