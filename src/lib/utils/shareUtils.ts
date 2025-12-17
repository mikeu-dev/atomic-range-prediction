/**
 * Share utilities for Atomic Range Prediction
 * Handles shareable link generation and URL state encoding/decoding
 */

import type { BombType, BlastEvent } from '$lib/types';

/**
 * Shareable state structure
 */
export interface ShareableState {
    bomb: string; // bomb ID
    lat: number;
    lon: number;
    country: string;
    timestamp: number;
}

/**
 * Generate shareable URL with encoded simulation state
 * 
 * @param event - Blast event to share
 * @returns Shareable URL
 */
export function generateShareLink(event: BlastEvent): string {
    const state: ShareableState = {
        bomb: event.bombType.id,
        lat: event.coordinates[1], // lat is second element
        lon: event.coordinates[0], // lon is first element
        country: event.countryName,
        timestamp: event.timestamp
    };

    try {
        // Encode to base64 URL-safe
        const json = JSON.stringify(state);
        const encoded = btoa(json)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');

        // Generate URL
        const baseUrl = typeof window !== 'undefined'
            ? window.location.origin + window.location.pathname
            : '';

        return `${baseUrl}?share=${encoded}`;

    } catch (error) {
        console.error('Failed to generate share link:', error);
        throw new Error('Failed to generate share link');
    }
}

/**
 * Parse shared state from URL
 * 
 * @param url - URL to parse (optional, defaults to current URL)
 * @returns Parsed state or null if invalid
 */
export function parseShareLink(url?: string): ShareableState | null {
    try {
        const urlString = url || (typeof window !== 'undefined' ? window.location.href : '');
        const urlObj = new URL(urlString);
        const params = new URLSearchParams(urlObj.search);
        const encoded = params.get('share');

        if (!encoded) return null;

        // Decode from URL-safe base64
        const base64 = encoded
            .replace(/-/g, '+')
            .replace(/_/g, '/')
            + '=='.substring(0, (3 * encoded.length) % 4);

        const decoded = atob(base64);
        const state = JSON.parse(decoded) as ShareableState;

        // Validate structure
        if (!state.bomb || !state.lat || !state.lon || !state.country) {
            throw new Error('Invalid state structure');
        }

        return state;

    } catch (error) {
        console.error('Failed to parse share link:', error);
        return null;
    }
}

/**
 * Copy text to clipboard
 * 
 * @param text - Text to copy
 * @returns Promise that resolves to true if successful
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        // Modern clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }

        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const success = document.execCommand('copy');
        document.body.removeChild(textArea);

        return success;

    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
}

/**
 * Clear share parameter from URL without reload
 */
export function clearShareParam(): void {
    if (typeof window === 'undefined') return;

    try {
        const url = new URL(window.location.href);
        url.searchParams.delete('share');
        window.history.replaceState({}, '', url.toString());
    } catch (error) {
        console.error('Failed to clear share param:', error);
    }
}
