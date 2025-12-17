import type { FalloutPattern, WindConfig } from '$lib/types';

/**
 * Generate random wind configuration
 * Mensimulasikan kondisi angin realistis
 */
export function generateRandomWind(): WindConfig {
    return {
        direction: Math.floor(Math.random() * 360), // 0-360 derajat
        speed: Math.floor(10 + Math.random() * 40) // 10-50 km/jam
    };
}

/**
 * Get wind direction name in Indonesian
 */
export function getWindDirectionName(degrees: number): string {
    const directions = [
        'Utara', 'Timur Laut', 'Timur', 'Tenggara',
        'Selatan', 'Barat Daya', 'Barat', 'Barat Laut'
    ];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

/**
 * Calculate fallout pattern based on wind and blast data
 * 
 * @param centerLat - Latitude pusat ledakan
 * @param centerLon - Longitude pusat ledakan
 * @param yieldKt - Yield bom dalam kiloton
 * @param wind - Konfigurasi angin
 * @returns Pola fallout radioaktif
 */
export function calculateFalloutPattern(
    centerLat: number,
    centerLon: number,
    yieldKt: number,
    wind: WindConfig
): FalloutPattern {
    // Panjang fallout pattern bergantung pada yield dan kecepatan angin
    // Formula simplified: length scales dengan Y^0.5 dan wind speed
    const baseLength = Math.pow(yieldKt, 0.5) * 2; // Base length dalam km
    const windFactor = wind.speed / 20; // Normalisasi wind speed
    const length = baseLength * windFactor;

    // Lebar fallout sekitar 10-20% dari panjangnya
    const width = length * (0.1 + Math.random() * 0.1);

    // Intensitas radiasi berbanding lurus dengan yield
    // Tapi inverse dengan jarak (untuk visualisasi)
    const intensity = Math.min(yieldKt / 1000, 1.0); // Cap at 1.0

    return {
        centerLat,
        centerLon,
        windDirection: wind.direction,
        windSpeed: wind.speed,
        intensity,
        length,
        width
    };
}

/**
 * Calculate radiation intensity at a specific point
 * 
 * @param pointLat - Latitude titik yang dihitung
 * @param pointLon - Longitude titik yang dihitung
 * @param fallout - Pola fallout
 * @returns Intensitas radiasi (0-1, 0 = aman, 1 = sangat berbahaya)
 */
export function calculateRadiationIntensity(
    pointLat: number,
    pointLon: number,
    fallout: FalloutPattern
): number {
    // Simplified distance calculation (not accurate for large distances)
    const latDiff = pointLat - fallout.centerLat;
    const lonDiff = pointLon - fallout.centerLon;
    const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111; // Rough km conversion

    // Calculate angle from center to point
    const angle = Math.atan2(lonDiff, latDiff) * (180 / Math.PI);
    const normalizedAngle = (angle + 360) % 360;

    // Calculate angle difference with wind direction
    let angleDiff = Math.abs(normalizedAngle - fallout.windDirection);
    if (angleDiff > 180) angleDiff = 360 - angleDiff;

    // Point is in fallout zone if:
    // 1. It's in the direction of wind (within +/- 30 degrees)
    // 2. Within the length of fallout pattern
    if (angleDiff > 30) return 0;

    if (distance > fallout.length) return 0;

    // Intensity decreases with distance
    const distanceFactor = 1 - (distance / fallout.length);

    // Intensity decreases with angle from center
    const angleFactor = 1 - (angleDiff / 30);

    return fallout.intensity * distanceFactor * angleFactor;
}

/**
 * Generate polygon points for fallout visualization
 * 
 * @param fallout - Pola fallout
 * @returns Array of [lon, lat] coordinates untuk polygon
 */
export function generateFalloutPolygon(fallout: FalloutPattern): number[][] {
    const points: number[][] = [];
    const segments = 20; // Jumlah segmen untuk smooth curve

    // Convert wind direction to radians
    const windRad = (fallout.windDirection * Math.PI) / 180;

    // Convert km to approximate degrees (rough approximation)
    const kmToDeg = 1 / 111;

    // Create ellipse-like shape pointing in wind direction
    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;

        // Radius varies: longer in wind direction, shorter perpendicular
        const r = i < segments / 2 || i > segments * 3 / 4
            ? fallout.length * kmToDeg
            : fallout.width * kmToDeg;

        const x = r * Math.cos(angle + windRad);
        const y = r * Math.sin(angle + windRad);

        points.push([
            fallout.centerLon + x,
            fallout.centerLat + y
        ]);
    }

    return points;
}

/**
 * Estimate population affected by fallout
 * 
 * @param fallout - Pola fallout
 * @param populationDensity - Kepadatan populasi per km²
 * @returns Estimasi jumlah orang terkena radiasi
 */
export function estimateFalloutCasualties(
    fallout: FalloutPattern,
    populationDensity: number = 50
): number {
    // Approximate area of ellipse: π × length × width
    const area = Math.PI * fallout.length * fallout.width;

    // Total people in area
    const totalPopulation = area * populationDensity;

    // Fatality rate based on intensity
    // High intensity (>0.7) = 80% fatality
    // Medium intensity (0.3-0.7) = 40% fatality
    // Low intensity (<0.3) = 10% fatality
    let fatalityRate = 0.1;
    if (fallout.intensity > 0.7) fatalityRate = 0.8;
    else if (fallout.intensity > 0.3) fatalityRate = 0.4;

    return Math.round(totalPopulation * fatalityRate);
}
