import React, { useContext, useState } from 'react'
import { storage, STATE_CHANGED, db, auth } from '@lib/firebase';
import { UserContext } from '@lib/context';
import { doc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { FaSpinner } from 'react-icons/fa';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function UpdateProfile(){
  const router = useRouter();
  const { currentUser, user } = useContext(UserContext);
  const [name, setName] = useState('')
  const [speciality, setSpeciality] = useState('') 
  const [address, setAddress] = useState('')
  const [number, setNumber] = useState('')
  const [err, setErrer] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);
  const [image, setImage] = useState();
  const [file, setFile] = useState();

  function clearValues(){
    setName('')
    setSpeciality('')
    setAddress('')
    setNumber('')
    return
  }

  const fileChange = (e) => {
    if(e.target.files.length !== 0){
      setImage(URL.createObjectURL(e.target.files[0]));
      setFile(Array.from(e.target.files)[0])
    }
}
  // Creates a Firebase Upload Task
  const uploadFile = async (e) => {

    // Get the file
    const extension = file.type.split('/')[1];

    // Makes reference to the storage bucket location
    const fileRef = ref(storage, `profiles/${auth.currentUser.uid}/${Date.now()}.${extension}`);
    setUploading(true);

    // Starts the upload
    const task = uploadBytesResumable(fileRef, file)

    // Listen to updates to upload task
    task.on(STATE_CHANGED, (snapshot) => {
      const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
      setProgress(pct);
    });

    // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
    task
      .then((d) => getDownloadURL(fileRef))
      .then((url) => {
        setDownloadURL(url);
        setUploading(false);
      });
  };
  
  async function writeDoctor(){
    const userRef = doc(db, 'users', auth.currentUser.uid)
    await updateDoc(userRef, {name: name, img: downloadURL, speciality: speciality, number: number, address: address})
  }

  async function addHandler(){
    if(!number || !address || !name || !speciality){
      setErrer('All Input fileds are required!');
      toast.error('All Input fileds are required!')
      return
    }if (!downloadURL) {
      setErrer('Upload your profile image!');
      toast.error('Profile image required!')
      return
    } 
    setIsAdding(true)
    await writeDoctor();
    toast.success('Profile updated successfuly!');
    clearValues();
    router.push('/login')
  }

  return (
    <div className="container p-8">
    <header className="mx-auto text-center mb-8 mt-6 prose dark:prose-invert md:prose-base lg:prose-lg sm:prose-sm">
      <h1 className=" text-gray6 dark:text-gray1">Update Profile</h1>
      <div className="mx-auto w-24 h-1 my-12 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"></div>
    </header>
    <div className='flex flex-col md:w-3/4 mx-auto gap-2 overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800'>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:p-4 md:gap-4 gap-2">
    
    <div className=" flex flex-col h-auto w-auto items-center justify-center font-medium group">
    <Image className=" p-1 my-2 w-5/12 bg-gray-200 dark:bg-gray-500 rounded-full ring-4 ring-green-500 dark:ring-white" src={currentUser?.img || image || '/hacker.png'} alt="Bordered avatar" width={512} height={512}/>
      {uploading && <h3>{progress}%</h3>}
      {downloadURL && (<h2 className=' text-green-500'>Profile picture updated!</h2>)}
      {!uploading && !downloadURL && (
  <>
  <input type="file" onChange={fileChange} className=' p-1 w-3/4 my-2 input-field' accept="image/x-png,image/gif,image/jpeg" />
    <label onClick={uploadFile} className="btn btn-blue">
      📸 Upload Img
    </label>
  </>
)}
    </div>


    <div className=" flex flex-col items-start justify-between p-3 font-medium group text-gray5 dark:text-gray2">
      <p>Name:</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder={currentUser?.name}
        className=" input-field"
      ></input>
      <div className="py-4"></div>
      <p>Speciality:</p>
      <input
        value={speciality}
        onChange={(e) => setSpeciality(e.target.value)}
        type="text"
        placeholder={currentUser?.speciality}
        className="input-field"
      ></input>
      <div className="py-4"></div>
      <p>Address:</p>
      <textarea
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        type="text"
        placeholder={currentUser?.address}
        className="input-field"
      ></textarea>
    </div>

    <div className=" flex flex-col justify-start p-3 font-medium group text-gray5 dark:text-gray2">
    <p>Number:</p>
      <input
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        type="number"
        placeholder={currentUser?.number}
        className="input-field"
      ></input>
    </div>
  </div>
  <div className=" flex flex-col items-center justify-center p-3 font-medium group">
    {err && (
      <div className=" mb-2 w-1/2 text-sm border-red-500 border text-center border-solid text-red-500 py-2">
        {err}
      </div>
    )}
    <div className=' flex w-full flex-row gap-4 justify-center'>
    <button
      onClick={addHandler}
      className=" px-6 w-1/5 h-10 flex justify-center py-2 duration-300 relative after:absolute after:top-0 after:right-full bg-green-500 after:z-10 after:w-full after:h-full overflow-hidden hover:after:translate-x-full after:duration-300 hover:text-slate-900"
    >
      {isAdding && (
        <FaSpinner className=" animate-spin text-white" size={22} />
      )}
      {!isAdding && <span className="text-gray1 cursor-pointer">Add</span>}
    </button>
    <button
      onClick={() => router.reload()}
      className=" px-6 w-1/5 h-10 flex justify-center py-2 text-gray1 duration-300 relative after:absolute after:top-0 after:right-full bg-red-500 after:z-10 after:w-full after:h-full overflow-hidden hover:after:translate-x-full after:duration-300 hover:text-slate-900">Cancel</button>
    </div>
    </div>
  </div>
  </div>
  );
}
