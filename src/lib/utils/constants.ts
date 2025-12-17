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
