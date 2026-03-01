// components/Profile.js
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '@/lib/context';

export default function Profile() {
  const { user, userRole, isLoading, error } = useContext(UserContext);
  const [localLoading, setLocalLoading] = useState(true);

  // Simulate waiting for user context to populate
  useEffect(() => {
    if (!isLoading) setLocalLoading(false);
  }, [isLoading]);

  if (localLoading) {
    return (
      <section className="p-4 border rounded shadow-sm max-w-md mx-auto" aria-live="polite">
        <p>Loading profile...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-4 border rounded shadow-sm max-w-md mx-auto" aria-live="polite">
        <p className="text-red-500">Error loading profile: {error.message}</p>
      </section>
    );
  }

  return (
    <section className="p-4 border rounded shadow-sm max-w-md mx-auto" aria-live="polite">
      {user ? (
        <>
          <h1>Welcome {user?.name || 'User'}!</h1>
          <p>Email: {user.email}</p>
          <p>Role: {userRole || 'N/A'}</p>
        </>
      ) : (
        <p>Please log in</p>
      )}
    </section>
  );
}
