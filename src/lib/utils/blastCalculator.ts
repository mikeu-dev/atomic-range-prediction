import type { BlastData } from '$lib/types';
import { isValidYield } from './validation';
import { getPopulationDensity } from './populationData';

/**
 * Calculate blast radius based on nuclear yield
 * Formulas based on nuclear weapons effects calculators and scientific data
 * 
 * References:
 * - NUKEMAP by Alex Wellerstein
 * - The Effects of Nuclear Weapons (Glasstone & Dolan)
 * - Federation of American Scientists (FAS)
 * 
 * @param yieldKt - Nuclear yield in kilotons
 * @returns Object containing all blast zone radii in kilometers
 */
export function calculateBlastRadius(yieldKt: number): BlastData {
    // Validate yield
    if (!isValidYield(yieldKt)) {
        throw new Error(`Invalid yield: ${yieldKt}kt. Must be between 0 and 100,000kt.`);
    }

    // Scaling factor berdasarkan cube root untuk blast effects
    // Sebagian besar efek ledakan skala dengan Y^(1/3)
    const cubeRoot = Math.pow(yieldKt, 1 / 3);

    // Untuk thermal dan radiasi, scaling lebih mendekati Y^0.41
    const thermalScale = Math.pow(yieldKt, 0.41);

    return {
        // Fireball: Zona inti dengan suhu jutaan derajat
        // Formula: 0.11 × Y^(1/3) km
        fireball: parseFloat((0.11 * cubeRoot).toFixed(2)),

        // Radiation: Zona radiasi langsung (500 rem)
        // Formula: 1.2 × Y^0.41 km
        radiation: parseFloat((1.2 * thermalScale).toFixed(2)),

        // Heavy Blast: 20 psi overpressure (kehancuran total)
        // Formula: 0.28 × Y^(1/3) km
        heavyBlast: parseFloat((0.28 * cubeRoot).toFixed(2)),

        // Moderate Blast: 5 psi overpressure (kehancuran berat)
        // Formula: 0.62 × Y^(1/3) km
        moderateBlast: parseFloat((0.62 * cubeRoot).toFixed(2)),

        // Light Blast: 1 psi overpressure (kerusakan struktural)
        // Formula: 1.5 × Y^(1/3) km
        lightBlast: parseFloat((1.5 * cubeRoot).toFixed(2)),

        // Thermal: Radiasi termal (luka bakar tingkat 3)
        // Formula: 3.5 × Y^0.41 km (untuk 100 cal/cm²)
        thermal: parseFloat((3.5 * thermalScale).toFixed(2))
    };
}

/**
 * Estimate population affected dengan breakdown per zona
 * Menggunakan area circle dan population density berdasarkan lokasi
 * 
 * @param thermalRadius - Thermal radius in km
 * @param lat - Latitude of blast location
 * @param lon - Longitude of blast location
 * @param countryName - Optional country name for density lookup
 * @returns Estimated population affected
 */
export function estimatePopulationAffected(
    thermalRadius: number,
    lat?: number,
    lon?: number,
    countryName?: string
): number {
    // Validate radius
    if (isNaN(thermalRadius) || thermalRadius < 0) {
        throw new Error(`Invalid radius: ${thermalRadius}`);
    }

    // Get population density for location
    let density: number;
    if (lat !== undefined && lon !== undefined) {
        density = getPopulationDensity(lat, lon, countryName);
    } else {
        // Fallback if coordinates not provided (backward compatibility)
        density = 50;
    }

    const area = Math.PI * Math.pow(thermalRadius, 2);
    // Add realistic variability: ±10%
    const variability = 0.9 + Math.random() * 0.2;
    const estimated = Math.round(area * density * variability);

    return Math.min(estimated, 50000000); // Cap at 50M for realism
}

/**
 * Estimate casualties and injuries per zona blast
 * 
 * @param zoneRadius - Radius zona dalam km
 * @param zoneType - Tipe zona (fireball, radiation, dll)
 * @param populationDensity - Kepadatan populasi per km²
 * @returns Object containting fatalities and injuries
 */
export function estimateDetailedCasualties(
    zoneRadius: number,
    zoneType: 'fireball' | 'radiation' | 'heavyBlast' | 'moderateBlast' | 'lightBlast' | 'thermal',
    populationDensity: number = 50
): { fatalities: number; injuries: number; damage: number } {
    const area = Math.PI * Math.pow(zoneRadius, 2);
    const totalPopulation = area * populationDensity;

    // Fatality & Injury rates berdasarkan zona (Empirical proxies)
    const rates: Record<string, { fatal: number; injury: number; infrastructure: number }> = {
        fireball: { fatal: 1.0, injury: 0.0, infrastructure: 100 },
        radiation: { fatal: 0.9, injury: 0.1, infrastructure: 10 },
        heavyBlast: { fatal: 0.8, injury: 0.15, infrastructure: 90 },
        moderateBlast: { fatal: 0.4, injury: 0.45, infrastructure: 60 },
        lightBlast: { fatal: 0.05, injury: 0.35, infrastructure: 20 },
        thermal: { fatal: 0.25, injury: 0.55, infrastructure: 15 }
    };

    const currentRate = rates[zoneType];

    return {
        fatalities: Math.round(totalPopulation * currentRate.fatal),
        injuries: Math.round(totalPopulation * currentRate.injury),
        damage: currentRate.infrastructure
    };
}

/**
 * Backward compatibility alias for estimateCasualtiesByZone
 */
export function estimateCasualtiesByZone(
    zoneRadius: number,
    zoneType: 'fireball' | 'radiation' | 'heavyBlast' | 'moderateBlast' | 'lightBlast' | 'thermal',
    populationDensity: number = 50
): number {
    return estimateDetailedCasualties(zoneRadius, zoneType, populationDensity).fatalities;
}

/**
 * Calculate overpressure untuk zona tertentu
 * 
 * @param zoneType - Tipe zona blast
 * @returns Overpressure dalam psi
 */
export function calculateOverpressure(
    zoneType: 'fireball' | 'radiation' | 'heavyBlast' | 'moderateBlast' | 'lightBlast' | 'thermal'
): number {
    const overpressureMap: Record<string, number> = {
        fireball: 200,      // Extreme pressure in core
        radiation: 50,      // High radiation, high pressure
        heavyBlast: 20,     // 20 psi - total destruction
        moderateBlast: 5,   // 5 psi - heavy damage
        lightBlast: 1,      // 1 psi - structural damage
        thermal: 0.5        // Minimal pressure, thermal damage
    };

    return overpressureMap[zoneType];
}

/**
 * Calculate detailed metrics for all blast zones
 */
export function calculateDetailedMetrics(
    blastData: BlastData,
    lat: number,
    lon: number,
    countryName?: string
): { fatalities: number; injuries: number; infrastructure: number } {
    const density = getPopulationDensity(lat, lon, countryName);

    // Total fatalities is estimated based on the most lethal zone (cumulative)
    // Detailed injuries are also estimated based on the total affected area

    // 1. Get total population in thermal radius (outermost zone)
    const totalAffectedPopulation = estimatePopulationAffected(blastData.thermal, lat, lon, countryName);

    // 2. Weighted average for fatalities based on yield and density
    // Empirical data suggests roughly 10-25% fatalities and 30-45% injuries in total affected area
    const fatalityRate = 0.25;
    const injuryRate = 0.45;

    const fatalities = Math.round(totalAffectedPopulation * fatalityRate);
    const injuries = Math.round(totalAffectedPopulation * injuryRate);

    // 3. Infrastructure damage is high near core, tapering off
    // We use a weighted average based on radii
    const infrastructure = 75; // Baseline high for the entire blast area

    return { fatalities, injuries, infrastructure };
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number): string {
    return num.toLocaleString('id-ID');
}

/**
 * Generate unique ID
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
