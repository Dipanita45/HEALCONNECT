import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@lib/firebase';
import { 
  getCurrentLocation, 
  sortDoctorsByDistance, 
  formatDistance 
} from '@lib/locationUtils';
import { FaSearch, FaUserMd, FaMapMarkerAlt, FaPhone, FaEnvelope, FaSpinner, FaLocationArrow } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

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

  useEffect(() => {
    filterDoctors();
  }, [searchTerm, locationFilter, specialityFilter, doctors, sortByDistance]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'users'),
        where('role', '!=', 'patient') /
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

  const filterDoctors = async () => {
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
          {/* Search Input */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or speciality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Locations</option>
            {availableLocations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          {/* Speciality Filter */}
          <select
            value={specialityFilter}
            onChange={(e) => setSpecialityFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Specialities</option>
            {availableSpecialities.map(speciality => (
              <option key={speciality} value={speciality}>{speciality}</option>
            ))}
          </select>

          {/* Get Location Button */}
          <button
            onClick={getUserLocation}
            disabled={locationLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 flex items-center justify-center"
          >
            {locationLoading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <>
                <FaLocationArrow className="mr-2" />
                Near Me
              </>
            )}
          </button>

          {/* Clear Filters Button */}
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Clear Filters
          </button>
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

const DoctorCard = ({ doctor, showDistance = false }) => {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-600">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
          <FaUserMd className="text-white" size={24} />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Dr. {doctor.name}
          </h3>
          <p className="text-blue-600 dark:text-blue-400 font-medium">
            {doctor.speciality}
          </p>
          {showDistance && doctor.distance !== undefined && (
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              {formatDistance(doctor.distance)}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {doctor.address && (
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <FaMapMarkerAlt className="mr-2 text-red-500" size={14} />
            <span className="text-sm">{doctor.address}</span>
          </div>
        )}

        {doctor.number && (
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <FaPhone className="mr-2 text-green-500" size={14} />
            <span className="text-sm">{doctor.number}</span>
          </div>
        )}

        {doctor.email && (
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <FaEnvelope className="mr-2 text-purple-500" size={14} />
            <span className="text-sm">{doctor.email}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex space-x-2">
          {doctor.number && (
            <a
              href={`tel:${doctor.number}`}
              className="flex-1 bg-green-500 text-white text-center py-2 px-3 rounded-md text-sm font-medium hover:bg-green-600 transition-colors"
            >
              Call
            </a>
          )}
          {doctor.email && (
            <a
              href={`mailto:${doctor.email}`}
              className="flex-1 bg-blue-500 text-white text-center py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Email
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
