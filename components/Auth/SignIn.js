import { useState, useEffect } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "@/lib/firebase";

export default function SignIn() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  // Initialize reCAPTCHA once on mount (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined" && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA solved", response);
          },
        }
      );
    }
  }, []);

  const sendOTP = async () => {
    if (!phone.match(/^[6-9]\d{9}$/)) {
      alert("Please enter a valid 10-digit Indian phone number without +91");
      return;
    }

    try {
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = "+91" + phone;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier
      );
      setConfirmation(confirmationResult);
      alert("OTP sent!");
    } catch (error) {
      alert("Error sending OTP: " + error.message);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }
    try {
      await confirmation.confirm(otp);
      alert("Login successful!");
      // Redirect logic here
    } catch (error) {
      alert("Incorrect OTP: " + error.message);
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-2">Patient Login</h2>

      <input
        type="text"
        placeholder="Enter 10-digit phone number"
        className="border px-2 py-1 w-full mb-2"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        maxLength={10}
      />
      <button
        onClick={sendOTP}
        className="bg-blue-500 text-white px-4 py-1 rounded w-full mb-2"
      >
        Send OTP
      </button>

      {confirmation && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            className="border px-2 py-1 w-full mb-2"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />
          <button
            onClick={verifyOTP}
            className="bg-green-500 text-white px-4 py-1 rounded w-full"
          >
            Verify OTP
          </button>
        </>
      )}

      {/* reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </div>
  );
}
