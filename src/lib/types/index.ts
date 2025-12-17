/**
 * Type definitions for Atomic Range Prediction
 */

export interface BombType {
    id: string;
    name: string;
    yieldKt: number; // Yield in kilotons
    description?: string;
}

export interface BlastData {
    fireball: number; // Radius in km (zona inti dengan suhu ekstrem)
    radiation: number; // Radius in km (zona radiasi langsung mematikan)
    heavyBlast: number; // Radius in km (zona ledakan kuat, 20 psi)
    moderateBlast: number; // Radius in km (zona ledakan moderat, 5 psi)
    lightBlast: number; // Radius in km (zona ledakan ringan, 1 psi)
    thermal: number; // Radius in km (zona radiasi termal, luka bakar tingkat 3)
}

export interface CountryData {
    id: string;
    name: string;
    geometry: {
        type: string;
        coordinates: number[];
    };
}

export interface BlastEvent {
    id: string;
    countryName: string;
    bombType: BombType;
    blastData: BlastData;
    timestamp: number;
    coordinates: number[];
}

export type MapProjectionType =
    | 'geoEqualEarth'
    | 'geoEquirectangular'
    | 'geoMercator'
    | 'geoNaturalEarth1'
    | 'geoOrthographic';

export interface MapConfig {
    projection: MapProjectionType;
    panX: 'rotateX' | 'translateX';
    panY: 'rotateY' | 'translateY';
    homeGeoPoint: {
        latitude: number;
        longitude: number;
    };
}

export interface WindConfig {
    direction: number; // Arah angin dalam derajat (0-360, 0 = utara)
    speed: number; // Kecepatan angin dalam km/jam
}

export interface FalloutPattern {
    centerLat: number;
    centerLon: number;
    windDirection: number;
    windSpeed: number;
    intensity: number; // Intensitas radiasi (0-1)
    length: number; // Panjang pola fallout dalam km
    width: number; // Lebar pola fallout dalam km
}

export interface BlastZone {
    name: string;
    radius: number;
    color: string;
    opacity: number;
    description: string;
    casualties?: number; // Estimasi korban di zona ini
    overpressure?: number; // Tekanan ledakan dalam psi
}
