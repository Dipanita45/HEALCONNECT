
import React, { useState } from "react";
import { auth } from "@lib/firebase";
import toast from "react-hot-toast";
import { FaSpinner } from 'react-icons/fa';
import Note from "@components/Note";

export default function AddDoctor({ props }) {
  const [name, setName] = useState('')
  const [speciality, setSpeciality] = useState('')
  const [address, setAddress] = useState('')
  const [number, setNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setError] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [userUID, setUserUID] = useState('')



  function clearValues() {
    setName('')
    setSpeciality('')
    setAddress('')
    setNumber('')
    setEmail('')
    setPassword('')
    return
  }

  async function addHandler() {
    if (!email || !password || !name || !speciality) {
      setError('All Input fields are required!');
      toast.error('All Input fields are required!')
      return
    }

    setIsAdding(true)
    setError(null)

    try {
      // 1. Get current user's ID token
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("You must be logged in to adding a doctor.");
      }

      const token = await currentUser.getIdToken();

      // 2. Call the secure API
      const response = await fetch('/api/admin/create-doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          email,
          password,
          speciality,
          address,
          number
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create doctor');
      }

      toast.success('Doctor Added Successfully!');
      clearValues();
    } catch (error) {
      console.error(error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4 w-full overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800">

      <Note note='Admin you can just add Doctor here, Rest of doctors details will be updated by doctor.' />

      <div className=" flex flex-col items-center justify-between p-3 font-medium group">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Doctor Name"
          className=" input-field"
        ></input>
        <div className="py-4"></div>
        <input
          value={speciality}
          onChange={(e) => setSpeciality(e.target.value)}
          type="text"
          placeholder="Doctor Speciality"
          className="input-field"
        ></input>
        <div className="py-4"></div>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type="text"
          placeholder="Address"
          className="input-field"
        ></textarea>
      </div>

      <div className=" flex flex-col items-center justify-between p-3 font-medium group">
        <input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          type="number"
          placeholder="Number"
          className="input-field"
        ></input>
        <div className="py-4"></div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="Email"
          className="input-field"
        ></input>
        <div className="py-4"></div>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="text"
          placeholder="Password"
          className="input-field"
        ></input>
      </div>
      <div className=" flex flex-col items-center justify-center p-3 font-medium group">
        {err && (
          <div className="text-sm w-full border-red-500 border text-center border-solid text-red-500 py-2">
            {err}
          </div>
        )}
        <div className="py-2"></div>
        <button
          onClick={addHandler}
          className=" px-6 w-full h-10 flex justify-center py-2 duration-300 relative after:absolute after:top-0 after:right-full bg-green-500 after:z-10 after:w-full after:h-full overflow-hidden hover:after:translate-x-full after:duration-300 hover:text-slate-900"
        >
          {isAdding && (
            <FaSpinner className=" animate-spin text-white" size={22} />
          )}
          {!isAdding && <span className="text-gray1 cursor-pointer">Add</span>}
        </button>
      </div>
    </div>
  );
}


