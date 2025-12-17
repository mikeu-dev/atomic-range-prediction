/**
 * Population Density Data
 * Static lookup table for major cities and countries
 * 
 * Sources:
 * - UN World Urbanization Prospects 2024
 * - World Bank Open Data
 * - Wikipedia city data
 */

export interface PopulationDensityData {
    city?: string;
    country: string;
    density: number; // people per km²
    lat: number;
    lon: number;
    radius?: number; // coverage radius in km
}

/**
 * Population density data for major cities and countries
 * Sorted by density (highest first) for better matching
 */
export const POPULATION_DATA: PopulationDensityData[] = [
    // ===== MAJOR CITIES (Top 50 by density) =====

    // Asia
    { city: 'Manila', country: 'Philippines', density: 46178, lat: 14.5995, lon: 120.9842, radius: 25 },
    { city: 'Mumbai', country: 'India', density: 31700, lat: 19.0760, lon: 72.8777, radius: 35 },
    { city: 'Dhaka', country: 'Bangladesh', density: 29069, lat: 23.8103, lon: 90.4125, radius: 30 },
    { city: 'Karachi', country: 'Pakistan', density: 24000, lat: 24.8607, lon: 67.0011, radius: 40 },
    { city: 'Hong Kong', country: 'China', density: 17311, lat: 22.3193, lon: 114.1694, radius: 20 },
    { city: 'Singapore', country: 'Singapore', density: 8358, lat: 1.3521, lon: 103.8198, radius: 25 },
    { city: 'Jakarta', country: 'Indonesia', density: 15342, lat: -6.2088, lon: 106.8456, radius: 30 },
    { city: 'Seoul', country: 'South Korea', density: 16000, lat: 37.5665, lon: 126.9780, radius: 35 },
    { city: 'Tokyo', country: 'Japan', density: 6158, lat: 35.6762, lon: 139.6503, radius: 50 },
    { city: 'Shanghai', country: 'China', density: 3800, lat: 31.2304, lon: 121.4737, radius: 45 },
    { city: 'Beijing', country: 'China', density: 1300, lat: 39.9042, lon: 116.4074, radius: 50 },
    { city: 'Bangkok', country: 'Thailand', density: 5300, lat: 13.7563, lon: 100.5018, radius: 30 },
    { city: 'Taipei', country: 'Taiwan', density: 9575, lat: 25.0330, lon: 121.5654, radius: 20 },
    { city: 'Kuala Lumpur', country: 'Malaysia', density: 8157, lat: 3.1390, lon: 101.6869, radius: 25 },
    { city: 'Ho Chi Minh City', country: 'Vietnam', density: 4363, lat: 10.8231, lon: 106.6297, radius: 25 },
    { city: 'Delhi', country: 'India', density: 29259, lat: 28.7041, lon: 77.1025, radius: 40 },
    { city: 'Bangalore', country: 'India', density: 11371, lat: 12.9716, lon: 77.5946, radius: 30 },
    { city: 'Kolkata', country: 'India', density: 24252, lat: 22.5726, lon: 88.3639, radius: 25 },
    { city: 'Chennai', country: 'India', density: 26553, lat: 13.0827, lon: 80.2707, radius: 25 },

    // Middle East
    { city: 'Cairo', country: 'Egypt', density: 19376, lat: 30.0444, lon: 31.2357, radius: 35 },
    { city: 'Tehran', country: 'Iran', density: 11800, lat: 35.6892, lon: 51.3890, radius: 35 },
    { city: 'Istanbul', country: 'Turkey', density: 2976, lat: 41.0082, lon: 28.9784, radius: 40 },
    { city: 'Dubai', country: 'UAE', density: 762, lat: 25.2048, lon: 55.2708, radius: 30 },
    { city: 'Riyadh', country: 'Saudi Arabia', density: 2200, lat: 24.7136, lon: 46.6753, radius: 35 },

    // Europe
    { city: 'Paris', country: 'France', density: 21498, lat: 48.8566, lon: 2.3522, radius: 30 },
    { city: 'London', country: 'United Kingdom', density: 5701, lat: 51.5074, lon: -0.1278, radius: 40 },
    { city: 'Madrid', country: 'Spain', density: 5400, lat: 40.4168, lon: -3.7038, radius: 30 },
    { city: 'Barcelona', country: 'Spain', density: 16000, lat: 41.3851, lon: 2.1734, radius: 25 },
    { city: 'Rome', country: 'Italy', density: 2232, lat: 41.9028, lon: 12.4964, radius: 30 },
    { city: 'Berlin', country: 'Germany', density: 4100, lat: 52.5200, lon: 13.4050, radius: 35 },
    { city: 'Moscow', country: 'Russia', density: 4900, lat: 55.7558, lon: 37.6173, radius: 40 },
    { city: 'Amsterdam', country: 'Netherlands', density: 5135, lat: 52.3676, lon: 4.9041, radius: 20 },
    { city: 'Brussels', country: 'Belgium', density: 7400, lat: 50.8503, lon: 4.3517, radius: 20 },

    // Americas
    { city: 'New York', country: 'USA', density: 10715, lat: 40.7128, lon: -74.0060, radius: 40 },
    { city: 'Los Angeles', country: 'USA', density: 3206, lat: 34.0522, lon: -118.2437, radius: 45 },
    { city: 'Chicago', country: 'USA', density: 4572, lat: 41.8781, lon: -87.6298, radius: 35 },
    { city: 'San Francisco', country: 'USA', density: 7174, lat: 37.7749, lon: -122.4194, radius: 25 },
    { city: 'Mexico City', country: 'Mexico', density: 6000, lat: 19.4326, lon: -99.1332, radius: 40 },
    { city: 'São Paulo', country: 'Brazil', density: 7821, lat: -23.5505, lon: -46.6333, radius: 40 },
    { city: 'Buenos Aires', country: 'Argentina', density: 14000, lat: -34.6037, lon: -58.3816, radius: 35 },
    { city: 'Rio de Janeiro', country: 'Brazil', density: 5265, lat: -22.9068, lon: -43.1729, radius: 30 },
    { city: 'Toronto', country: 'Canada', density: 4266, lat: 43.6532, lon: -79.3832, radius: 30 },
    { city: 'Lima', country: 'Peru', density: 3200, lat: -12.0464, lon: -77.0428, radius: 30 },
    { city: 'Bogotá', country: 'Colombia', density: 4300, lat: 4.7110, lon: -74.0721, radius: 30 },

    // Africa
    { city: 'Lagos', country: 'Nigeria', density: 13123, lat: 6.5244, lon: 3.3792, radius: 30 },
    { city: 'Kinshasa', country: 'DR Congo', density: 12691, lat: -4.4419, lon: 15.2663, radius: 25 },
    { city: 'Johannesburg', country: 'South Africa', density: 2364, lat: -26.2041, lon: 28.0473, radius: 35 },
    { city: 'Nairobi', country: 'Kenya', density: 4509, lat: -1.2864, lon: 36.8172, radius: 25 },

    // Oceania
    { city: 'Sydney', country: 'Australia', density: 433, lat: -33.8688, lon: 151.2093, radius: 40 },
    { city: 'Melbourne', country: 'Australia', density: 508, lat: -37.8136, lon: 144.9631, radius: 35 },
    { city: 'Auckland', country: 'New Zealand', density: 360, lat: -36.8485, lon: 174.7633, radius: 30 },

    // ===== COUNTRIES (Fallback for non-city areas) =====

    // Asia
    { country: 'Singapore', density: 8358, lat: 1.3521, lon: 103.8198 },
    { country: 'Bangladesh', density: 1265, lat: 23.685, lon: 90.3563 },
    { country: 'Taiwan', density: 673, lat: 23.5, lon: 121 },
    { country: 'South Korea', density: 527, lat: 36.5, lon: 127.5 },
    { country: 'Philippines', density: 368, lat: 12.8797, lon: 121.774 },
    { country: 'India', density: 464, lat: 20.5937, lon: 78.9629 },
    { country: 'Japan', density: 347, lat: 36.2048, lon: 138.2529 },
    { country: 'Vietnam', density: 314, lat: 14.0583, lon: 108.2772 },
    { country: 'Pakistan', density: 287, lat: 30.3753, lon: 69.3451 },
    { country: 'China', density: 153, lat: 35.8617, lon: 104.1954 },
    { country: 'Indonesia', density: 151, lat: -2.5, lon: 118 },
    { country: 'Thailand', density: 137, lat: 15.8700, lon: 100.9925 },
    { country: 'Malaysia', density: 99, lat: 4.2105, lon: 101.9758 },

    // Middle East
    { country: 'Bahrain', density: 2239, lat: 26.0667, lon: 50.5577 },
    { country: 'Lebanon', density: 667, lat: 33.8547, lon: 35.8623 },
    { country: 'Israel', density: 400, lat: 31.0461, lon: 34.8516 },
    { country: 'Kuwait', density: 254, lat: 29.3117, lon: 47.4818 },
    { country: 'UAE', density: 118, lat: 23.4241, lon: 53.8478 },
    { country: 'Turkey', density: 110, lat: 38.9637, lon: 35.2433 },
    { country: 'Iran', density: 52, lat: 32.4279, lon: 53.6880 },
    { country: 'Saudi Arabia', density: 16, lat: 23.8859, lon: 45.0792 },

    // Europe
    { country: 'Monaco', density: 26337, lat: 43.7384, lon: 7.4246 },
    { country: 'Netherlands', density: 508, lat: 52.1326, lon: 5.2913 },
    { country: 'Belgium', density: 383, lat: 50.5039, lon: 4.4699 },
    { country: 'United Kingdom', density: 281, lat: 55.3781, lon: -3.4360 },
    { country: 'Germany', density: 240, lat: 51.1657, lon: 10.4515 },
    { country: 'Italy', density: 206, lat: 41.8719, lon: 12.5674 },
    { country: 'Switzerland', density: 219, lat: 46.8182, lon: 8.2275 },
    { country: 'France', density: 119, lat: 46.2276, lon: 2.2137 },
    { country: 'Spain', density: 94, lat: 40.4637, lon: -3.7492 },
    { country: 'Poland', density: 124, lat: 51.9194, lon: 19.1451 },
    { country: 'Russia', density: 9, lat: 61.5240, lon: 105.3188 },

    // Americas
    { country: 'USA', density: 36, lat: 37.0902, lon: -95.7129 },
    { country: 'Mexico', density: 66, lat: 23.6345, lon: -102.5528 },
    { country: 'Brazil', density: 25, lat: -14.2350, lon: -51.9253 },
    { country: 'Colombia', density: 46, lat: 4.5709, lon: -74.2973 },
    { country: 'Argentina', density: 17, lat: -38.4161, lon: -63.6167 },
    { country: 'Canada', density: 4, lat: 56.1304, lon: -106.3468 },
    { country: 'Peru', density: 26, lat: -9.1900, lon: -75.0152 },
    { country: 'Chile', density: 26, lat: -35.6751, lon: -71.5430 },

    // Africa
    { country: 'Nigeria', density: 226, lat: 9.0820, lon: 8.6753 },
    { country: 'Egypt', density: 103, lat: 26.8206, lon: 30.8025 },
    { country: 'Kenya', density: 94, lat: -0.0236, lon: 37.9062 },
    { country: 'South Africa', density: 49, lat: -30.5595, lon: 22.9375 },
    { country: 'DR Congo', density: 40, lat: -4.0383, lon: 21.7587 },
    { country: 'Ethiopia', density: 115, lat: 9.1450, lon: 40.4897 },

    // Oceania
    { country: 'Australia', density: 3, lat: -25.2744, lon: 133.7751 },
    { country: 'New Zealand', density: 19, lat: -40.9006, lon: 174.8860 },
];

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Find nearest city within its coverage radius
 */
function findNearestCity(lat: number, lon: number): PopulationDensityData | null {
    let nearest: PopulationDensityData | null = null;
    let minDistance = Infinity;

    for (const data of POPULATION_DATA) {
        if (!data.city || !data.radius) continue;

        const distance = calculateDistance(lat, lon, data.lat, data.lon);

        // Must be within city's coverage radius
        if (distance <= data.radius && distance < minDistance) {
            minDistance = distance;
            nearest = data;
        }
    }

    return nearest;
}

/**
 * Find country data by name (fuzzy match)
 */
function findCountryByName(countryName: string): PopulationDensityData | null {
    const normalized = countryName.toLowerCase().trim();

    return POPULATION_DATA.find(d =>
        !d.city && d.country.toLowerCase() === normalized
    ) || null;
}

/**
 * Get population density for specific coordinates
 * 
 * Priority:
 * 1. Nearest major city (if within coverage radius)
 * 2. Country average (if country name provided)
 * 3. Global average (50/km² fallback)
 * 
 * @param lat - Latitude
 * @param lon - Longitude
 * @param countryName - Optional country name for fallback
 * @returns Population density in people per km²
 */
export function getPopulationDensity(
    lat: number,
    lon: number,
    countryName?: string
): number {
    // 1. Try to find nearest major city
    const nearestCity = findNearestCity(lat, lon);
    if (nearestCity) {
        console.log(`Using city density: ${nearestCity.city}, ${nearestCity.country} (${nearestCity.density}/km²)`);
        return nearestCity.density;
    }

    // 2. Fallback to country average
    if (countryName) {
        const countryData = findCountryByName(countryName);
        if (countryData) {
            console.log(`Using country density: ${countryData.country} (${countryData.density}/km²)`);
            return countryData.density;
        }
    }

    // 3. Global average fallback
    console.log('Using global average density (50/km²)');
    return 50;
}

/**
 * Get detailed density info for display
 */
export function getPopulationDensityInfo(
    lat: number,
    lon: number,
    countryName?: string
): {
    density: number;
    source: 'city' | 'country' | 'global';
    name: string;
} {
    const nearestCity = findNearestCity(lat, lon);
    if (nearestCity) {
        return {
            density: nearestCity.density,
            source: 'city',
            name: `${nearestCity.city}, ${nearestCity.country}`
        };
    }

    if (countryName) {
        const countryData = findCountryByName(countryName);
        if (countryData) {
            return {
                density: countryData.density,
                source: 'country',
                name: countryData.country
            };
        }
    }

    return {
        density: 50,
        source: 'global',
        name: 'Global Average'
    };
}
