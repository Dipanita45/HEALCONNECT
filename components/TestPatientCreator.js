import { useState } from 'react';
import { db } from '@lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

export default function TestPatientCreator() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addTestPatient = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber || !name) {
      toast.error('Phone number and name are required!');
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setIsAdding(true);

    const patientData = {
      // Personal Information
      first: name.split(' ')[0] || 'Test',
      middle: name.split(' ')[1] || '',
      last: name.split(' ')[2] || 'Patient',
      aadhar: Math.floor(Math.random() * 1000000000000).toString(),
      dob: "1990-01-01T00:00:00.000Z",
      gender: "male",
      married: "no",
      
      // Contact Information
      number: `+91${phoneNumber}`,
      email: `test${phoneNumber}@example.com`,
      
      // Address Information
      address: "Test Address for Demo",
      city: "Mumbai",
      state: "Maharashtra",
      pin: "400001",
      
      // Health Information
      height: "170",
      weight: "70",
      bloodGroup: "O+",
      
      // System Information
      role: "patient",
      createdAt: new Date(),
      updatedAt: new Date(),
      
      // Test flag
      isTestAccount: true
    };

    try {
      const docRef = doc(db, "patients", `+91${phoneNumber}`);
      await setDoc(docRef, patientData);
      toast.success(`✅ Test patient created! You can now login with +91${phoneNumber}`);
      setPhoneNumber('');
      setName('');
    } catch (error) {
      console.error("Error adding test patient:", error);
      toast.error('Failed to create test patient: ' + error.message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Create Test Patient Account
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Add a test patient account to login and test the system features.
      </p>
      
      <form onSubmit={addTestPatient} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter patient name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number (10 digits)
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
              +91
            </span>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="1234567890"
              pattern="[0-9]{10}"
              maxLength="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isAdding}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isAdding 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }`}
        >
          {isAdding ? 'Creating Account...' : 'Create Test Patient'}
        </button>
      </form>
      
      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>⚠️ Note:</strong> This creates a test account for development purposes only. 
          After creation, you can login using the phone number with any 6-digit OTP in Firebase test mode.
        </p>
      </div>
    </div>
  );
}
