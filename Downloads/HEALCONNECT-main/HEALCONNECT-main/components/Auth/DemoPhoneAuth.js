// components/Auth/DemoPhoneAuth.js
import { useState } from "react";

export default function DemoPhoneAuth() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  const sendOTP = () => {
    if (!/^\+91\d{10}$/.test(phone)) {
      alert("Please enter a valid Indian phone number starting with +91.");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);
    alert(`Demo OTP sent: ${otp}`); // In real app, never show this!
  };

  const verifyOTP = () => {
    if (otp === generatedOTP) {
      alert("OTP Verified! Login Successful.");
      setIsVerified(true);
    } else {
      alert("Invalid OTP. Try again.");
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-2">Login with Phone (Demo)</h2>

      <input
        type="text"
        placeholder="+91xxxxxxxxxx"
        className="border px-2 py-1 w-full mb-2"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={sendOTP} className="bg-blue-500 text-white px-4 py-1 rounded w-full mb-2">
        Send OTP
      </button>

      {generatedOTP && !isVerified && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            className="border px-2 py-1 w-full mb-2"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOTP} className="bg-green-500 text-white px-4 py-1 rounded w-full">
            Verify OTP
          </button>
        </>
      )}

      {isVerified && <p className="text-green-600 font-semibold mt-2">Logged in successfully!</p>}
    </div>
  );
}
