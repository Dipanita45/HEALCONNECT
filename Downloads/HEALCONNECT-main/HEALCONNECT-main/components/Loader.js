// Loading Spinner
import React from 'react';
import { FaSpinner } from 'react-icons/fa';

export default function Loader({ show }) {
  return show ? (
    <main className="h-full w-full flex items-center justify-center object-center align-middle">
      <FaSpinner
        className=" animate-spin text-green-500 text-center object-center align-middle"
        size={40}
      />
    </main>
  ) : null;
}
