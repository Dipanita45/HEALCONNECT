import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@lib/firebase';
import { getCurrentLocation, sortDoctorsByDistance } from '@lib/locationUtils';
import { FaSearch, FaUserMd, FaMapMarkerAlt, FaSpinner, FaLocationArrow } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import DoctorCard from './DoctorCard';

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
    <div className="w-full p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <FaUserMd className="mr-2 text-blue-500" />
          Find Doctors in Your Area
        </h2>

        {/* Search and Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {/* Name / Speciality search */}
          <div className="md:col-span-2 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or speciality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Location filter */}
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">All Locations</option>
              {availableLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Speciality filter */}
          <div className="relative">
            <FaUserMd className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={specialityFilter}
              onChange={(e) => setSpecialityFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">All Specialities</option>
              {availableSpecialities.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={getUserLocation}
              disabled={locationLoading}
              title="Sort by distance from my location"
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white rounded-lg transition-colors text-sm font-medium"
            >
              {locationLoading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaLocationArrow />
              )}
              <span className="hidden sm:inline">Near Me</span>
            </button>
            <button
              onClick={clearFilters}
              title="Clear all filters"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Clear
            </button>
          </div>
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
