import TestPatientCreator from '@components/TestPatientCreator';
import { Toaster } from 'react-hot-toast';

export default function TestSetup() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            🧪 Test Account Setup
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create test accounts to access and review the implemented features
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Test Patient Creator */}
          <div>
            <TestPatientCreator />
          </div>

          {/* Feature Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              🎯 Available Features After Login
            </h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800 dark:text-white">Patient Features</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                  <li>• Health Dashboard with live monitoring</li>
                  <li>• Doctor Finder (location-based search)</li>
                  <li>• Health Reports and History</li>
                  <li>• Real-time Arduino health data</li>
                  <li>• Notifications system</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800 dark:text-white">Doctor Features</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                  <li>• Patient management dashboard</li>
                  <li>• Live patient monitoring</li>
                  <li>• Health reports generation</li>
                  <li>• Patient assignments</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-800 dark:text-white">Admin Features</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                  <li>• Complete system management</li>
                  <li>• User account creation</li>
                  <li>• System reports and analytics</li>
                  <li>• Doctor and patient oversight</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>✅ Recently Implemented:</strong>
                <br />• Fixed all typos throughout the system
                <br />• Added Doctor Finder with location search
                <br />• Enhanced patient dashboard interface
              </p>
            </div>
          </div>
        </div>

        {/* Arduino Hardware Status */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            🔧 Arduino Hardware Integration
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Hardware Components</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• ESP32 Microcontroller</li>
                <li>• MAX30105 Heart Rate Sensor</li>
                <li>• MAX30205 Temperature Sensor</li>
                <li>• SH1106 OLED Display</li>
                <li>• WiFi connectivity for data transmission</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Measured Parameters</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Heart Rate (BPM)</li>
                <li>• Blood Oxygen Level (SpO2)</li>
                <li>• Body Temperature (°C/°F)</li>
                <li>• Real-time pulse detection</li>
                <li>• Finger placement detection</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>📡 Data Flow:</strong> Arduino → Firebase → Web Dashboard → Doctor/Patient Interface
            </p>
          </div>
        </div>

        {/* Quick Access Links */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Access</h3>
          <div className="flex justify-center space-x-4">
            <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              Login Page
            </a>
            <a href="/admin/add" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
              Add Patient (Admin)
            </a>
            <a href="/" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md">
              Home Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
