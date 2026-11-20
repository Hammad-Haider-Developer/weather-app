// Manually maintained list of countries/cities with internal coordinates.
// Latitude/longitude are used only to call the Open-Meteo API — never shown in the UI.
export const LOCATIONS = [
  // Pakistan
  { country: 'Pakistan', city: 'Lahore', latitude: 31.5204, longitude: 74.3587 },
  { country: 'Pakistan', city: 'Karachi', latitude: 24.8607, longitude: 67.0011 },
  { country: 'Pakistan', city: 'Islamabad', latitude: 33.6844, longitude: 73.0479 },
  { country: 'Pakistan', city: 'Peshawar', latitude: 34.0151, longitude: 71.5249 },
  { country: 'Pakistan', city: 'Multan', latitude: 30.1575, longitude: 71.4784 },

  // India
  { country: 'India', city: 'Delhi', latitude: 28.6139, longitude: 77.2090 },
  { country: 'India', city: 'Mumbai', latitude: 19.0760, longitude: 72.8777 },
  { country: 'India', city: 'Bangalore', latitude: 12.9716, longitude: 77.5946 },
  { country: 'India', city: 'Kolkata', latitude: 22.5726, longitude: 88.3639 },
  { country: 'India', city: 'Chennai', latitude: 13.0827, longitude: 80.2707 },

  // China
  { country: 'China', city: 'Beijing', latitude: 39.9042, longitude: 116.4074 },
  { country: 'China', city: 'Shanghai', latitude: 31.2304, longitude: 121.4737 },
  { country: 'China', city: 'Guangzhou', latitude: 23.1291, longitude: 113.2644 },
  { country: 'China', city: 'Shenzhen', latitude: 22.5431, longitude: 114.0579 },
  { country: 'China', city: 'Chengdu', latitude: 30.5728, longitude: 104.0668 },

  // France
  { country: 'France', city: 'Paris', latitude: 48.8566, longitude: 2.3522 },
  { country: 'France', city: 'Marseille', latitude: 43.2965, longitude: 5.3698 },
  { country: 'France', city: 'Lyon', latitude: 45.7640, longitude: 4.8357 },
  { country: 'France', city: 'Toulouse', latitude: 43.6047, longitude: 1.4442 },
  { country: 'France', city: 'Nice', latitude: 43.7102, longitude: 7.2620 },

  // Germany
  { country: 'Germany', city: 'Berlin', latitude: 52.5200, longitude: 13.4050 },
  { country: 'Germany', city: 'Munich', latitude: 48.1351, longitude: 11.5820 },
  { country: 'Germany', city: 'Hamburg', latitude: 53.5511, longitude: 9.9937 },
  { country: 'Germany', city: 'Frankfurt', latitude: 50.1109, longitude: 8.6821 },
  { country: 'Germany', city: 'Cologne', latitude: 50.9375, longitude: 6.9603 },

  // Bangladesh
  { country: 'Bangladesh', city: 'Dhaka', latitude: 23.8103, longitude: 90.4125 },
  { country: 'Bangladesh', city: 'Chittagong', latitude: 22.3569, longitude: 91.7832 },
  { country: 'Bangladesh', city: 'Khulna', latitude: 22.8456, longitude: 89.5403 },
  { country: 'Bangladesh', city: 'Rajshahi', latitude: 24.3745, longitude: 88.6042 },
  { country: 'Bangladesh', city: 'Sylhet', latitude: 24.8949, longitude: 91.8687 },

  // Russia
  { country: 'Russia', city: 'Moscow', latitude: 55.7558, longitude: 37.6173 },
  { country: 'Russia', city: 'Saint Petersburg', latitude: 59.9311, longitude: 30.3609 },
  { country: 'Russia', city: 'Novosibirsk', latitude: 55.0084, longitude: 82.9357 },
  { country: 'Russia', city: 'Yekaterinburg', latitude: 56.8389, longitude: 60.6057 },
  { country: 'Russia', city: 'Kazan', latitude: 55.8304, longitude: 49.0661 },

  // Sri Lanka
  { country: 'Sri Lanka', city: 'Colombo', latitude: 6.9271, longitude: 79.8612 },
  { country: 'Sri Lanka', city: 'Kandy', latitude: 7.2906, longitude: 80.6337 },
  { country: 'Sri Lanka', city: 'Galle', latitude: 6.0535, longitude: 80.2210 },
  { country: 'Sri Lanka', city: 'Jaffna', latitude: 9.6615, longitude: 80.0255 },
  { country: 'Sri Lanka', city: 'Negombo', latitude: 7.2083, longitude: 79.8358 },

  // Iran
  { country: 'Iran', city: 'Tehran', latitude: 35.6892, longitude: 51.3890 },
  { country: 'Iran', city: 'Mashhad', latitude: 36.2605, longitude: 59.6168 },
  { country: 'Iran', city: 'Isfahan', latitude: 32.6546, longitude: 51.6680 },
  { country: 'Iran', city: 'Shiraz', latitude: 29.5918, longitude: 52.5837 },
  { country: 'Iran', city: 'Tabriz', latitude: 38.0800, longitude: 46.2919 },

  // Australia
  { country: 'Australia', city: 'Sydney', latitude: -33.8688, longitude: 151.2093 },
  { country: 'Australia', city: 'Melbourne', latitude: -37.8136, longitude: 144.9631 },
  { country: 'Australia', city: 'Brisbane', latitude: -27.4698, longitude: 153.0251 },
  { country: 'Australia', city: 'Perth', latitude: -31.9505, longitude: 115.8605 },
  { country: 'Australia', city: 'Adelaide', latitude: -34.9285, longitude: 138.6007 },
]
