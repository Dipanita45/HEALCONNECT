import React from 'react';
import { FaUser, FaEnvelope, FaIdBadge, FaUserShield, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

/**
 * DoctorCard Component
 * Displays a doctor's information in a card format.
 * @param {object} props
 * @param {object} props.doctor - The doctor object with properties: name, speciality, email, uid, role, number, address, and optionally distance.
 * @param {boolean} [props.showDistance] - Whether to show distance (if available).
 */
export default function DoctorCard({ doctor, showDistance }) {
  const { name, speciality, email, uid, role, distance, number, address } = doctor || {};

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
      {/* Header with Avatar and Name */}
      <div className="flex items-center mb-3">
        <div className="flex justify-center items-center w-12 h-12 mr-4 bg-blue-100 dark:bg-blue-900 rounded-full">
          <FaUser className="text-blue-500 dark:text-blue-300" size={24} />
        </div>
        <div>
          <p className="font-semibold text-gray-800 dark:text-white text-lg">{name || 'N/A'}</p>
          <p className="text-sm text-blue-600 dark:text-blue-400">{speciality || 'General'}</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        {role && (
          <div className="flex items-center gap-2">
            <FaUserShield className={role === 'admin' ? 'text-green-500' : 'text-blue-500'} />
            <span className="capitalize">{role}</span>
          </div>
        )}
        {email && (
          <div className="flex items-center gap-2">
            <FaEnvelope className="shrink-0" />
            <span className="truncate" title={email}>{email}</span>
          </div>
        )}
        {number && (
          <div className="flex items-center gap-2">
            <FaPhone className="shrink-0" />
            <span>{number}</span>
          </div>
        )}
        {address && (
          <div className="flex items-start gap-2">
            <FaMapMarkerAlt className="shrink-0 mt-0.5" />
            <span className="line-clamp-2" title={address}>{address}</span>
          </div>
        )}
        {showDistance && distance !== undefined && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <FaMapMarkerAlt className="shrink-0" />
            <span>{distance.toFixed(1)} km away</span>
          </div>
        )}
        {uid && (
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <FaIdBadge className="shrink-0" />
            <span className="truncate" title={uid}>{uid.substring(0, 12)}...</span>
          </div>
        )}
      </div>

      {/* Action */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full text-center text-blue-600 dark:text-blue-400 font-medium hover:underline">
          View Profile
        </button>
      </div>
    </div>
  );
}
