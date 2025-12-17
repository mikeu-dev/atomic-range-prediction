import type { BlastData } from '$lib/types';

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
 * Menggunakan area circle dan population density
 */
export function estimatePopulationAffected(thermalRadius: number): number {
    // Simplified calculation based on average population density
    const avgDensityPerKm2 = 50; // Very rough global average
    const area = Math.PI * Math.pow(thermalRadius, 2);
    const estimated = Math.round(area * avgDensityPerKm2 * (1 + Math.random()));
    return Math.min(estimated, 10000000); // Cap at 10M for realism
}

/**
 * Estimate casualties per zona blast
 * 
 * @param zoneRadius - Radius zona dalam km
 * @param zoneType - Tipe zona (fireball, radiation, dll)
 * @param populationDensity - Kepadatan populasi per km²
 * @returns Estimasi jumlah korban
 */
export function estimateCasualtiesByZone(
    zoneRadius: number,
    zoneType: 'fireball' | 'radiation' | 'heavyBlast' | 'moderateBlast' | 'lightBlast' | 'thermal',
    populationDensity: number = 50
): number {
    const area = Math.PI * Math.pow(zoneRadius, 2);
    const totalPopulation = area * populationDensity;

    // Fatality rate berdasarkan zona
    const fatalityRates: Record<string, number> = {
        fireball: 1.0,      // 100% fatality
        radiation: 0.95,    // 95% fatality (radiasi fatal)
        heavyBlast: 0.90,   // 90% fatality (20 psi)
        moderateBlast: 0.50, // 50% fatality (5 psi)
        lightBlast: 0.05,   // 5% fatality (1 psi, mostly injuries)
        thermal: 0.30       // 30% fatality (luka bakar parah)
    };

    return Math.round(totalPopulation * fatalityRates[zoneType]);
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
        fireball: 200,      // Tekanan ekstrem di zona inti
        radiation: 50,      // Radiasi tinggi dengan blast moderat
        heavyBlast: 20,     // 20 psi - kehancuran total bangunan
        moderateBlast: 5,   // 5 psi - kehancuran berat
        lightBlast: 1,      // 1 psi - kerusakan struktural ringan
        thermal: 0.5        // Tekanan minimal, damage dari radiasi termal
    };

    return overpressureMap[zoneType];
}

/**
 * Estimate infrastructure damage percentage
 */
export function estimateInfrastructureDamage(distance: number, blastRadius: number): number {
    if (distance < blastRadius * 0.3) return 100;
    if (distance < blastRadius * 0.6) return Math.round(80 + Math.random() * 20);
    if (distance < blastRadius) return Math.round(50 + Math.random() * 30);
    return Math.round(Math.random() * 20);
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
