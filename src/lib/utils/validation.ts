/**
 * Validation utilities for Atomic Range Prediction
 */

/**
 * Validate latitude coordinate
 * @param lat - Latitude value
 * @returns true if valid, false otherwise
 */
export function isValidLatitude(lat: number): boolean {
    return !isNaN(lat) && lat >= -90 && lat <= 90;
}

/**
 * Validate longitude coordinate
 * @param lon - Longitude value
 * @returns true if valid, false otherwise
 */
export function isValidLongitude(lon: number): boolean {
    return !isNaN(lon) && lon >= -180 && lon <= 180;
}

/**
 * Validate coordinates
 * @param lat - Latitude value
 * @param lon - Longitude value
 * @returns true if both are valid
 */
export function isValidCoordinates(lat: number, lon: number): boolean {
    return isValidLatitude(lat) && isValidLongitude(lon);
}

/**
 * Validate nuclear yield
 * Realistic range: 0.001kt (tactical) to 100,000kt (Tsar Bomba theoretical max)
 * @param yieldKt - Nuclear yield in kilotons
 * @returns true if valid, false otherwise
 */
export function isValidYield(yieldKt: number): boolean {
    return !isNaN(yieldKt) && yieldKt > 0 && yieldKt <= 100000;
}

/**
 * Sanitize string to prevent XSS
 * @param str - Input string
 * @returns Sanitized string
 */
export function sanitizeString(str: string): string {
    if (typeof str !== 'string') return '';

    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim();
}

/**
 * Validate and sanitize country name
 * @param name - Country name
 * @returns Sanitized country name or error message
 */
export function validateCountryName(name: string): { valid: boolean; value: string; error?: string } {
    if (!name || typeof name !== 'string') {
        return { valid: false, value: '', error: 'Nama negara tidak valid' };
    }

    const sanitized = sanitizeString(name);

    if (sanitized.length === 0) {
        return { valid: false, value: '', error: 'Nama negara tidak boleh kosong' };
    }

    if (sanitized.length > 100) {
        return { valid: false, value: '', error: 'Nama negara terlalu panjang' };
    }

    return { valid: true, value: sanitized };
}

/**
 * ValidationError class untuk custom error handling
 */
export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}
