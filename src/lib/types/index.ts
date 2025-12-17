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
    shockwave: number; // Radius in km
    thermal: number; // Radius in km
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
