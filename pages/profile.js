// components/Profile.js
import { useContext } from 'react';
import { UserContext } from '@/lib/context';

export default function Profile() {
  const { user, currentUser, userRole } = useContext(UserContext);

  return (
    <div>
      {user ? (
        <>
          <h2>Welcome {currentUser?.name || 'User'}!</h2>
          <p>Email: {user.email}</p>
          <p>Role: {userRole}</p>
        </>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
