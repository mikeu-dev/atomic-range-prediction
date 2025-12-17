/**
 * Internationalization (i18n) setup
 * Supports English and Indonesian
 */

import { derived, writable } from 'svelte/store';
import { browser } from '$app/environment';

// Supported languages
export const locales = ['en', 'id'] as const;
export type Locale = typeof locales[number];

// Translation imports
import en from './translations/en.json';
import id from './translations/id.json';

const translations: Record<Locale, any> = { en, id };

// Current locale store with localStorage persistence
const storedLocale = browser ? localStorage.getItem('locale') : null;
const validStoredLocale = storedLocale === 'en' || storedLocale === 'id' ? storedLocale : null;

export const locale = writable<Locale>(validStoredLocale || 'id'); // Default to Indonesian

// Update localStorage when locale changes
if (browser) {
    locale.subscribe(value => {
        localStorage.setItem('locale', value);
    });
}

/**
 * Translation function derived store
 * Usage: $t('app.title')
 */
export const t = derived(locale, ($locale) => {
    return (key: string): string => {
        const keys = key.split('.');
        let value: any = translations[$locale];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                // Key not found, return key itself
                return key;
            }
        }

        // Return found value or fall back to key
        return typeof value === 'string' ? value : key;
    };
});

/**
 * Language switcher function
 */
export function setLocale(newLocale: Locale): void {
    locale.set(newLocale);
}

/**
 * Get current locale value
 */
export function getLocale(): Locale {
    let currentLocale: Locale = 'id';
    locale.subscribe(value => {
        currentLocale = value;
    })();
    return currentLocale;
}
