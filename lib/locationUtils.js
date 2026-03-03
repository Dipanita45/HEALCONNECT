
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000,
      }
    );
  });
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};


export const getCoordinatesFromAddress = async (address) => {


  const cityCoordinates = {
    'mumbai': { lat: 19.0760, lng: 72.8777 },
    'delhi': { lat: 28.7041, lng: 77.1025 },
    'bangalore': { lat: 12.9716, lng: 77.5946 },
    'hyderabad': { lat: 17.3850, lng: 78.4867 },
    'chennai': { lat: 13.0827, lng: 80.2707 },
    'kolkata': { lat: 22.5726, lng: 88.3639 },
    'pune': { lat: 18.5204, lng: 73.8567 },
    'ahmedabad': { lat: 23.0225, lng: 72.5714 },
    'jaipur': { lat: 26.9124, lng: 75.7873 },
    'surat': { lat: 21.1702, lng: 72.8311 },
    'lucknow': { lat: 26.8467, lng: 80.9462 },
    'kanpur': { lat: 26.4499, lng: 80.3319 },
    'nagpur': { lat: 21.1458, lng: 79.0882 },
    'indore': { lat: 22.7196, lng: 75.8577 },
    'thane': { lat: 19.2183, lng: 72.9781 },
    'bhopal': { lat: 23.2599, lng: 77.4126 },
    'visakhapatnam': { lat: 17.6868, lng: 83.2185 },
    'pimpri': { lat: 18.6298, lng: 73.7997 },
    'patna': { lat: 25.5941, lng: 85.1376 },
    'vadodara': { lat: 22.3072, lng: 73.1812 }
  };

  const addressLower = address.toLowerCase();

  for (const [city, coords] of Object.entries(cityCoordinates)) {
    if (addressLower.includes(city)) {
      return coords;
    }
  }

  return null;
};

export const sortDoctorsByDistance = async (doctors, userLocation) => {
  if (!userLocation) return doctors;

  const doctorsWithDistance = await Promise.all(
    doctors.map(async (doctor) => {
      if (!doctor.address) {
        return { ...doctor, distance: Infinity };
      }

      const doctorCoords = await getCoordinatesFromAddress(doctor.address);
      if (!doctorCoords) {
        return { ...doctor, distance: Infinity };
      }

      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        doctorCoords.lat,
        doctorCoords.lng
      );

      return { ...doctor, distance: Math.round(distance * 10) / 10 }; // Round to 1 decimal
    })
  );

  return doctorsWithDistance.sort((a, b) => a.distance - b.distance);
};

export const formatDistance = (distance) => {
  if (distance === Infinity || distance === null || distance === undefined) {
    return 'Distance unknown';
  }

  if (distance < 1) {
    return `${Math.round(distance * 1000)}m away`;
  }

  return `${distance}km away`;
};

export const getNearbyAreas = (userLocation) => {
  return [
    'Within 5km',
    'Within 10km',
    'Within 25km',
    'Within 50km'
  ];
};
