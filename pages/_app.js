import '@styles/app.scss'
import { UserContext } from '@lib/context';
import Layout from './layout';
import { useUserData } from '@lib/userInfo';
import '../styles/app.scss';



function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
  <UserContext.Provider value={userData}>
  <Layout>
  <Component {...pageProps} />
  </Layout>
  </UserContext.Provider> 
  );
}

export default MyApp
