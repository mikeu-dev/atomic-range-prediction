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
    fireball: number; // Radius in km
    radiation: number; // Radius in km
    heavyBlast: number; // Radius in km
    moderateBlast: number; // Radius in km
    lightBlast: number; // Radius in km
    thermal: number; // Radius in km
}

export interface DetailedBlastData extends BlastData {
    fatalities: number;
    injuries: number;
    infrastructureDamage: number;
    zones: BlastZone[];
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
    fatalities?: number;
    injuries?: number;
    infrastructure?: number;
}

export type MapProjectionType =
    | 'geoEqualEarth'
    | 'geoEquirectangular'
    | 'geoMercator'
    | 'geoNaturalEarth1'
    | 'geoOrthographic'
    | 'geoGlobe'; // Added 3D Globe mode

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
    direction: number; // degree
    speed: number; // km/h
    isRealTime?: boolean; // New: indicates if using real-time weather
}

export interface FalloutPattern {
    centerLat: number;
    centerLon: number;
    windDirection: number;
    windSpeed: number;
    intensity: number;
    length: number;
    width: number;
}

export interface BlastZone {
    type: 'fireball' | 'radiation' | 'heavyBlast' | 'moderateBlast' | 'lightBlast' | 'thermal';
    name: string;
    radius: number;
    color: string;
    opacity: number;
    description: string;
    descriptionId?: string; // Multilingual description
    fatalities?: number;
    injuries?: number;
    damage?: number; // Infrastructure damage % in this zone
    overpressure?: number;
}
