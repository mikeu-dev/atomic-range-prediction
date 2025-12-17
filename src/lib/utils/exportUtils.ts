/**
 * Export utilities for Atomic Range Prediction
 * Handles screenshot export (PNG/PDF) and data export (JSON/CSV)
 */

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Export DOM element as PNG image
 * 
 * @param elementId - ID of element to capture
 * @param filename - Output filename
 * @returns Promise that resolves when export complete
 */
export async function exportAsPNG(
    elementId: string,
    filename: string = 'atomic-blast-simulation.png'
): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with ID "${elementId}" not found`);
    }

    try {
        const canvas = await html2canvas(element, {
            scale: 2, // High quality (2x resolution)
            backgroundColor: getComputedStyle(document.body).backgroundColor || '#1a1a1a',
            logging: false,
            useCORS: true, // Handle external images
            allowTaint: false
        });

        // Convert to blob for download
        canvas.toBlob((blob) => {
            if (!blob) {
                throw new Error('Failed to create image blob');
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = filename;
            link.href = url;
            link.click();

            // Cleanup
            setTimeout(() => URL.revokeObjectURL(url), 100);
        }, 'image/png');

    } catch (error) {
        console.error('PNG export failed:', error);
        throw new Error('Failed to export as PNG');
    }
}

/**
 * Export DOM element as PDF document
 * 
 * @param elementId - ID of element to capture
 * @param filename - Output filename
 * @returns Promise that resolves when export complete
 */
export async function exportAsPDF(
    elementId: string,
    filename: string = 'atomic-blast-simulation.pdf'
): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with ID "${elementId}" not found`);
    }

    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: getComputedStyle(document.body).backgroundColor || '#1a1a1a',
            logging: false,
            useCORS: true
        });

        const imgData = canvas.toDataURL('image/png');

        // Calculate PDF dimensions
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // Determine orientation
        const orientation = imgWidth > imgHeight ? 'landscape' : 'portrait';

        // Create PDF with proper size
        const pdf = new jsPDF({
            orientation,
            unit: 'px',
            format: [imgWidth, imgHeight],
            compress: true
        });

        // Add image to PDF
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        // Save PDF
        pdf.save(filename);

    } catch (error) {
        console.error('PDF export failed:', error);
        throw new Error('Failed to export as PDF');
    }
}

/**
 * Export data as JSON file
 * 
 * @param data - Data to export
 * @param filename - Output filename
 */
export function exportAsJSON(data: any, filename: string = 'blast-data.json'): void {
    try {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();

        // Cleanup
        setTimeout(() => URL.revokeObjectURL(url), 100);

    } catch (error) {
        console.error('JSON export failed:', error);
        throw new Error('Failed to export as JSON');
    }
}

/**
 * Export array of objects as CSV file
 * 
 * @param data - Array of objects to export
 * @param filename - Output filename
 */
export function exportAsCSV(data: any[], filename: string = 'blast-data.csv'): void {
    if (!data || data.length === 0) {
        throw new Error('No data to export');
    }

    try {
        // Get headers from first object
        const headers = Object.keys(data[0]);

        // Build CSV string
        const csv = [
            // Header row
            headers.join(','),
            // Data rows
            ...data.map(row =>
                headers.map(header => {
                    const value = row[header];
                    // Handle values with commas or quotes
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value ?? '';
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();

        // Cleanup
        setTimeout(() => URL.revokeObjectURL(url), 100);

    } catch (error) {
        console.error('CSV export failed:', error);
        throw new Error('Failed to export as CSV');
    }
}

/**
 * Prepare blast history data for CSV export
 */
export function prepareBlastHistoryForCSV(history: any[]): any[] {
    return history.map(event => ({
        Timestamp: new Date(event.timestamp).toISOString(),
        Country: event.countryName,
        Bomb: event.bombType.name,
        Yield_KT: event.bombType.yieldKt,
        Fireball_KM: event.blastData.fireball,
        Radiation_KM: event.blastData.radiation,
        Heavy_Blast_KM: event.blastData.heavyBlast,
        Moderate_Blast_KM: event.blastData.moderateBlast,
        Light_Blast_KM: event.blastData.lightBlast,
        Thermal_KM: event.blastData.thermal,
        Latitude: event.coordinates[1],
        Longitude: event.coordinates[0]
    }));
}
