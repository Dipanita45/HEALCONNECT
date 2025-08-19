import { useState } from 'react';
import { auth, storage, STATE_CHANGED } from '@lib/firebase';
import Loader from '../Loader';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';

// Uploads images to Firebase Storage
export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  // Creates a Firebase Upload Task
  const uploadFile = async (e) => {
    // Get the file
    const file = Array.from(e.target.files)[0];
    const extension = file.type.split('/')[1];

    // Makes reference to the storage bucket location
    const fileRef = ref(storage, `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);
    setUploading(true);

    // Starts the upload
    const task = uploadBytesResumable(fileRef, file)
    const url = getDownloadURL(fileRef)
    setDownloadURL(url)

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

  return (
    <div>
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      <div className=" flex flex-col h-auto w-auto items-center justify-center font-medium group">
      <Image className=" p-1 w-24 h-24 bg-gray-200 dark:bg-gray-500 rounded-full ring-4 ring-green-500 dark:ring-white" src={downloadURL || '/hacker.png'} 
      alt="Avatar" 
      width={512}
      height={512}
      />
      {!uploading && (
          <label className=" w-1/2 text-center px-4 cursor-pointer">
            <input type="file" className='opacity-0 cursor-pointer' onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg" />
            <h2 className=' bg-gray2 py-1 text-center'>📸 Upload Img</h2>
          </label>
      )}
      </div>

      {/* {downloadURL && <code className="upload-snippet">{`![alt](${downloadURL})`}</code>} */}
    </div>
  );
}
