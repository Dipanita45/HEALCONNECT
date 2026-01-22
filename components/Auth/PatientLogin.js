import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

export default function PatientLoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userCredential, setUserCredential] = useState(null);

  const signInWithPhone = async (e) => {
    e.preventDefault()
    if (/^\d{10}$/.test(phoneNumber)) {
      try {
        setIsLoading(true);

        //   Function if document name or ref is phoneNumber
        const docRef = doc(db, 'patients', `+91${phoneNumber}`);
        const docSnap = await getDoc(docRef);

        //   Function if phoneNumber is field in document
        const collectionRef = collection(db, 'patients');
        const q = query(collectionRef, where('number', '==', `+91${phoneNumber}`));
        const snapshotQuery = await getDocs(q);

        // if (docSnap.exists()) {}
        if (snapshotQuery.size > 0 || docSnap.exists()) {
          const applicationVerifier = new RecaptchaVerifier(
            'sign-in-button',
            {
              size: 'invisible',
            },
            auth,
          );
          const provider = new PhoneAuthProvider(auth);
          const vId = await provider.verifyPhoneNumber(`+91${phoneNumber}`, applicationVerifier);
          setVerificationId(vId);
          toast.success('OTP sent successfully');
          setShowOtpInput(true);
          setIsLoading(false);
        } else {
          toast.error('Please authorize your number first.');
          setError('Please authorize your number first.');
          setIsLoading(false);
        }
      } catch (error) {
        toast.error(error.message);
        setIsLoading(false);
      }
    }else{
      toast.error('Please enter a valid phone number');
      setError('Please enter a valid phone number');
    }
  };

  const verify = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(code) || code.length !== 6) {
      toast.error('Please enter a valid OTP');
      setError('Please enter a valid OTP');
    } else {
      setIsLoading(true);
      const authCredential = PhoneAuthProvider.credential(verificationId, code);
      const userCredential = await signInWithCredential(auth, authCredential);

      console.log(userCredential);
      //   Update user UID in document
      const userUID = userCredential.user.uid;
      const ref = doc(db, 'patients', `+91${phoneNumber}`);
      await updateDoc(ref, { uid: userUID });
    }
  };

  return (
    <form className="flex w-full pt-2 px-4 md:py-4 h-96 flex-col justify-between">
      <h1 className=" text-center font-extrabold text-gray6 dark:text-gray2 select-none text-2xl sm:text-4xl">
      Patient Login
      </h1>
      <p>Patient should be login using there registred mobile number.</p>
        {/* Error Messege */}
        {error && (
          <div className=" my-2 text-sm w-full border-red-500 border text-center border-solid text-red-500 py-2">
            {error}
          </div>
        )}
        <div className={`mb-4  transition-opacity ${showOtpInput ? 'opacity-50' : ''} `}>
        <input
          type="tel"
          id="phone-number"
          name="phone-number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter your phone number"
          className="input-field"
        />
      </div>
      {showOtpInput && (      
      <div
        className={`mb-4 duration-75 transition-transform ${
          showOtpInput ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
        }`}
      >
        <label htmlFor="otp" className="block text-gray-700 font-bold mb-2">
          OTP
        </label>
        <input
          type="text"
          id="otp"
          name="otp"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your 6-digit OTP"
          className="input-field"/>
      </div>)}
      {showOtpInput ? <button
        type="submit"
        id="sign-in-button"
        onClick={verify}
        className={" bg-green-500 hover:bg-green-700 flex justify-center text-center text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"}>
        {(isLoading) && (
          <FaSpinner className=' animate-spin text-white' size={22} />
        )}
        {(!isLoading) && (
          <span className="text-gray1 cursor-pointer">Verify OTP</span>
        )}</button>
         : 
        <button
        type="submit"
        id="sign-in-button"
        onClick={signInWithPhone}
        className={" bg-blue-500 hover:bg-blue-700 flex justify-center items-center text-center text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"}>
          {(isLoading) && (
          <FaSpinner className=' animate-spin text-white' size={22} />

        )}
        {(!isLoading) && (
          <span className="text-gray1 cursor-pointer">Request OTP</span>
        )}</button>
        }
    </form>
  );
}
