import { writable, derived } from 'svelte/store';
import type { BombType, BlastEvent, BlastData } from '$lib/types';
import { DEFAULT_BOMB } from '$lib/utils/constants';

/**
 * Currently selected bomb type
 */
export const selectedBomb = writable<BombType>(DEFAULT_BOMB);

/**
 * History of all blast simulations
 */
export const blastHistory = writable<BlastEvent[]>([]);

// Comparison mode state
export const comparisonMode = writable<boolean>(false);
export const comparisonBombs = writable<BombType[]>([]);

// Derived store: get active bombs for simulation
// In comparison mode, returns selected bombs; otherwise returns current selected bomb
export const activeBombs = derived(
    [comparisonMode, selectedBomb, comparisonBombs],
    ([$comparisonMode, $selectedBomb, $comparisonBombs]) => {
        if ($comparisonMode && $comparisonBombs.length === 2) {
            return $comparisonBombs;
        }
        return [$selectedBomb];
    }
);

/**
 * Current blast data (if any)
 */
export const currentBlastData = writable<{
    countryName: string;
    blastData: BlastData;
    population: number;
    infrastructure: number;
} | null>(null);

/**
 * Dark mode state
 */
const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
export const isDarkMode = writable<boolean>(storedTheme === 'dark');

// Sync dark mode with DOM and localStorage
if (typeof window !== 'undefined') {
    isDarkMode.subscribe((value) => {
        const theme = value ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });
}

/**
 * Add a blast event to history
 */
export function addBlastToHistory(event: BlastEvent) {
    blastHistory.update((history) => {
        // Keep only last 10 blasts
        const updated = [event, ...history].slice(0, 10);
        return updated;
    });
}

/**
 * Clear all blast history
 */
export function clearBlastHistory() {
    blastHistory.set([]);
}

/**
 * Remove specific blast from history
 */
export function removeBlastFromHistory(id: string) {
    blastHistory.update((history) => history.filter((event) => event.id !== id));
}

/**
 * Derived store: Total blasts count
 */
export const totalBlasts = derived(blastHistory, ($history) => $history.length);
