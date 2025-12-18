import type { BombType } from '$lib/types';

/**
 * Available bomb types for simulation
 */
export const BOMB_TYPES: BombType[] = [
    {
        id: 'little-boy',
        name: 'Little Boy',
        yieldKt: 15,
        description: 'Bom atom yang dijatuhkan di Hiroshima (6 Agustus 1945)'
    },
    {
        id: 'fat-man',
        name: 'Fat Man',
        yieldKt: 21,
        description: 'Bom atom yang dijatuhkan di Nagasaki (9 Agustus 1945)'
    },
    {
        id: 'tsar-bomba',
        name: 'Tsar Bomba',
        yieldKt: 50000,
        description: 'Bom termonuklir terbesar yang pernah diledakkan (1961)'
    },
    {
        id: 'w87',
        name: 'W87',
        yieldKt: 300,
        description: 'Hulu ledak termonuklir modern AS'
    },
    {
        id: 'castle-bravo',
        name: 'Castle Bravo',
        yieldKt: 15000,
        description: 'Tes nuklir AS terbesar (1954)'
    }
];

/**
 * Default bomb type (Little Boy)
 */
export const DEFAULT_BOMB = BOMB_TYPES[0];

/**
 * Get bomb by ID
 */
export function getBombById(id: string): BombType | undefined {
    return BOMB_TYPES.find((bomb) => bomb.id === id);
}

/**
 * Warna untuk setiap zona blast
 */
export const BLAST_ZONE_COLORS = {
    fireball: '#FF0000',        // Merah solid (zona inti)
    radiation: '#FF4500',       // Merah-orange (radiasi mematikan)
    heavyBlast: '#FF6B00',      // Orange (ledakan kuat)
    moderateBlast: '#FF8C00',   // Orange-kuning (ledakan moderat)
    lightBlast: '#FFB700',      // Kuning (ledakan ringan)
    thermal: '#FFD700'          // Kuning cerah (radiasi termal)
} as const;

/**
 * Opacity untuk setiap zona blast
 */
export const BLAST_ZONE_OPACITY = {
    fireball: 0.9,
    radiation: 0.7,
    heavyBlast: 0.5,
    moderateBlast: 0.4,
    lightBlast: 0.3,
    thermal: 0.2
} as const;

/**
 * Warna untuk zona fallout
 */
export const FALLOUT_COLORS = {
    high: '#7FFF00',    // Intensitas tinggi
    medium: '#ADFF2F',  // Intensitas sedang
    low: '#FFFF00'      // Intensitas rendah
} as const;

/**
 * Opacity untuk zona fallout
 */
export const FALLOUT_OPACITY = {
    high: 0.4,
    medium: 0.3,
    low: 0.2
} as const;

/**
 * Konstanta animasi
 */
export const ANIMATION = {
    duration: {
        fireball: 400,      // ms
        radiation: 600,     // ms
        heavyBlast: 800,    // ms
        moderateBlast: 1000, // ms
        lightBlast: 1200,   // ms
        thermal: 1400       // ms
    },
    delay: {
        fireball: 0,        // ms
        radiation: 100,     // ms
        heavyBlast: 200,    // ms
        moderateBlast: 300, // ms
        lightBlast: 400,    // ms
        thermal: 500        // ms
    },
    pulseRepeat: 3,         // Jumlah repeat pulse animation
    pulseDuration: 800      // ms per pulse
} as const;

/**
 * Konstanta fisika nuklir
 */
export const NUCLEAR_PHYSICS = {
    overpressure: {
        fireball: 200,      // psi
        radiation: 50,      // psi
        heavyBlast: 20,     // psi
        moderateBlast: 5,   // psi
        lightBlast: 1,      // psi
        thermal: 0.5        // psi
    },
    radiationDose: {
        fireball: 10000,    // rem (instantly fatal)
        radiation: 500,     // rem (fatal within hours)
        heavyBlast: 200,    // rem (radiation sickness)
        moderateBlast: 100, // rem (mild symptoms)
        lightBlast: 50,     // rem (minimal effects)
        thermal: 10         // rem (negligible)
    }
} as const;

