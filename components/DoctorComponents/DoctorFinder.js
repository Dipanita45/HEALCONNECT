import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@lib/firebase';
import {
  getCurrentLocation,
  sortDoctorsByDistance,
  formatDistance
} from '@lib/locationUtils';
import { FaSearch, FaUserMd, FaMapMarkerAlt, FaPhone, FaEnvelope, FaSpinner, FaLocationArrow } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import DoctorCard from './DoctorCard';

// Remove unused Image import if not using <Image />

export default function DoctorFinder() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [specialityFilter, setSpecialityFilter] = useState('');
  const [availableLocations, setAvailableLocations] = useState([]);
  const [availableSpecialities, setAvailableSpecialities] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [sortByDistance, setSortByDistance] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  // FIX: Memoize filterDoctors so reference doesn't change on every render
  const filterDoctors = useCallback(async () => {
    let filtered = doctors;

    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(doctor =>
        doctor.address && doctor.address.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (specialityFilter) {
      filtered = filtered.filter(doctor =>
        doctor.speciality.toLowerCase().includes(specialityFilter.toLowerCase())
      );
    }

    if (sortByDistance && userLocation) {
      try {
        filtered = await sortDoctorsByDistance(filtered, userLocation);
      } catch (error) {
        console.error('Error sorting by distance:', error);
        toast.error('Could not sort by distance');
      }
    }

    setFilteredDoctors(filtered);
  }, [searchTerm, locationFilter, specialityFilter, doctors, sortByDistance, userLocation]);

  useEffect(() => {
    filterDoctors();
    // Now filterDoctors reference remains stable, removing exhaustive-deps warning
  }, [filterDoctors]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'users'),
        where('role', '!=', 'patient')
      );

      const querySnapshot = await getDocs(q);
      const doctorsList = [];
      const locations = new Set();
      const specialities = new Set();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.name && data.speciality) {
          doctorsList.push({
            id: doc.id,
            ...data
          });

          if (data.address) {
            const addressParts = data.address.split(',');
            const city = addressParts[addressParts.length - 1]?.trim();
            if (city) locations.add(city);
          }

          if (data.speciality) {
            specialities.add(data.speciality);
          }
        }
      });

      setDoctors(doctorsList);
      setAvailableLocations(Array.from(locations).sort());
      setAvailableSpecialities(Array.from(specialities).sort());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
      setLoading(false);
    }
  };

  const getUserLocation = async () => {
    try {
      setLocationLoading(true);
      const location = await getCurrentLocation();
      setUserLocation(location);
      setSortByDistance(true);
      toast.success('Location found! Sorting doctors by distance.');
    } catch (error) {
      console.error('Error getting location:', error);
      toast.error('Could not get your location. Please check your browser settings.');
    } finally {
      setLocationLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setSpecialityFilter('');
    setSortByDistance(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-500" size={40} />
        <span className="ml-2 text-gray-600">Loading doctors...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <FaUserMd className="mr-2 text-blue-500" />
          Find Doctors in Your Area
        </h2>

        {/* Search and Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {/* ... all your filter/search JSX ... */}
        </div>

        {/* Results Count and Sort Info */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400">
            Found {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
            {sortByDistance && userLocation && ' (sorted by distance)'}
          </p>
          {sortByDistance && userLocation && (
            <p className="text-sm text-blue-600 dark:text-blue-400">
              📍 Location-based results
            </p>
          )}
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <FaUserMd className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Try adjusting your search criteria or clear the filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} showDistance={sortByDistance} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Your DoctorCard component stays the same
