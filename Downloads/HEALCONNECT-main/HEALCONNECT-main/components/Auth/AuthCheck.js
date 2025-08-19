import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '@lib/context';

export default function AuthCheck({ children, fallback }) {
  const { user } = useContext(UserContext);
  return user ? children : fallback || <YouMustSignIn />;
}

function YouMustSignIn() {
  return (
    <main className="h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">You need to Sign In First!</h1>
        <h2 className="text-lg mb-6">Go to Login page</h2>
        <Link href="/login" className="btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Go to Login
        </Link>
      </div>
    </main>
  );
}
