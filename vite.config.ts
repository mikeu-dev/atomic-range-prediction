import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Atomic Range Prediction',
				short_name: 'Atomic Range',
				description: 'Interactive nuclear bomb impact simulator',
				theme_color: '#ff6b35',
				background_color: '#1a1a1a',
				display: 'standalone',
				icons: [
					{
						src: '/icon-192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/icon-512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webp}'],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/nominatim\.openstreetmap\.org\/.*/i,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'osm-geocode-cache',
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
							}
						}
					},
					{
						urlPattern: /^https:\/\/cdn\.amcharts\.com\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'amcharts-cache',
							expiration: {
								maxEntries: 20,
								maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
							}
						}
					}
				]
			},
			devOptions: {
				enabled: false // Disable in development for faster reload
			}
		})
	]
});
