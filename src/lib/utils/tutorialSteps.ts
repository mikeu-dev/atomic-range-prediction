/**
 * Tutorial steps for onboarding first-time users
 * Using Driver.js for interactive product tour
 */

import type { DriveStep } from 'driver.js';

export const tutorialSteps: DriveStep[] = [
    // Welcome
    {
        element: '.title',
        popover: {
            title: '👋 Selamat Datang!',
            description: 'Selamat datang di <strong>Atomic Range Prediction</strong> - simulator interaktif untuk mempelajari dampak bom atom. Mari saya tunjukkan cara menggunakannya!',
            side: 'bottom',
            align: 'center'
        }
    },

    // Bomb Selector
    {
        element: '.bomb-selector',
        popover: {
            title: '💣 Pilih Bom',
            description: 'Mulai dengan memilih jenis bom dari dropdown ini. Tersedia berbagai tipe dari <strong>Little Boy</strong> (15kt) hingga <strong>Tsar Bomba</strong> (50,000kt)!',
            side: 'bottom',
            align: 'start'
        }
    },

    // Comparison Mode
    {
        element: '.comparison-toggle',
        popover: {
            title: '📊 Mode Perbandingan',
            description: 'Aktifkan <strong>Comparison Mode</strong> untuk membandingkan 2 bom secara side-by-side. Lihat perbedaan dampak dengan jelas!',
            side: 'bottom',
            align: 'start'
        }
    },

    // Location Search
    {
        element: '.search-wrapper',
        popover: {
            title: '🔍 Cari Lokasi',
            description: 'Gunakan search box untuk mencari kota atau negara. Peta akan zoom otomatis ke lokasi yang dipilih!',
            side: 'bottom',
            align: 'start'
        }
    },

    // Map Interaction
    {
        element: '.map-container',
        popover: {
            title: '🗺️ Peta Interaktif',
            description: 'Klik pada <strong>negara mana saja</strong> di peta untuk memulai simulasi. Animasi blast zones akan muncul dengan 6 zona berbeda warna!',
            side: 'top',
            align: 'center'
        }
    },

    // Export Menu
    {
        element: '.export-btn',
        popover: {
            title: '📤 Export & Share',
            description: 'Export hasil simulasi sebagai <strong>PNG, PDF, JSON, atau CSV</strong>. Atau share via link untuk collaboration!',
            side: 'left',
            align: 'start'
        }
    },

    // Blast Info (conditional - only show if visible)
    {
        element: '.blast-info',
        popover: {
            title: '📊 Hasil Simulasi',
            description: 'Setelah klik peta, panel ini menampilkan detail dampak per zona, estimasi korban berdasarkan <strong>population density real</strong>, dan breakdown lengkap.',
            side: 'top',
            align: 'start'
        }
    },

    // History
    {
        element: '.blast-history',
        popover: {
            title: '📜 Riwayat Simulasi',
            description: 'Semua simulasi Anda tersimpan di sini (maksimal 10 terakhir). Klik untuk melihat detail atau hapus jika tidak diperlukan.',
            side: 'top',
            align: 'start'
        }
    },

    // Finish
    {
        popover: {
            title: '🎉 Siap Menjelajah!',
            description: 'Anda sudah siap menggunakan aplikasi! <br><br>Mulai dengan <strong>memilih bom</strong>, lalu <strong>klik negara di peta</strong>. Tutorial ini bisa diulang kapan saja dengan klik tombol Help (❓) di header.',
            align: 'center'
        }
    }
];

/**
 * Configuration for driver.js instance
 */
export const tutorialConfig = {
    showProgress: true,
    progressText: 'Langkah {{current}} dari {{total}}',
    nextBtnText: 'Selanjutnya →',
    prevBtnText: '← Sebelumnya',
    doneBtnText: 'Selesai ✓',
    popoverClass: 'tutorial-popover',
    animate: true,
    overlayColor: 'rgba(0, 0, 0, 0.75)',
    allowClose: true,
    onDestroyStarted: () => {
        // Will be overridden in component
    }
};
