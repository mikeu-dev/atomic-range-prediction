import type { BlastData } from '$lib/types';

/**
 * Calculate blast radius based on nuclear yield
 * Formula based on simplified nuclear blast effects
 * 
 * @param yieldKt - Nuclear yield in kilotons
 * @returns Object containing fireball, shockwave, and thermal radii in kilometers
 */
export function calculateBlastRadius(yieldKt: number): BlastData {
    return {
        fireball: parseFloat((0.62 * Math.pow(yieldKt, 0.4)).toFixed(2)),
        shockwave: parseFloat((1.8 * Math.pow(yieldKt, 0.33)).toFixed(2)),
        thermal: parseFloat((3.2 * Math.pow(yieldKt, 0.4)).toFixed(2))
    };
}

/**
 * Estimate population affected (simplified random for demo)
 * In production, this would use actual population data
 */
export function estimatePopulationAffected(thermalRadius: number): number {
    // Simplified calculation based on average population density
    const avgDensityPerKm2 = 50; // Very rough global average
    const area = Math.PI * Math.pow(thermalRadius, 2);
    const estimated = Math.round(area * avgDensityPerKm2 * (1 + Math.random()));
    return Math.min(estimated, 10000000); // Cap at 10M for realism
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
