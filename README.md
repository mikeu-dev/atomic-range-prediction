# Atomic Range Prediction

## 📌 Deskripsi
**Atomic Range Prediction** adalah aplikasi web interaktif yang dibangun dengan **SvelteKit** untuk mensimulasikan dan memprediksi luas sebaran dampak bom atom pada area tertentu di seluruh dunia. Aplikasi ini menampilkan peta interaktif dengan berbagai proyeksi geografis, animasi real-time, dan perhitungan ilmiah untuk tujuan edukasi.

## ✨ Fitur Utama

### 🗺️ Peta Interaktif
- **5 Proyeksi Peta**: geoEqualEarth, geoEquirectangular, geoMercator, geoNaturalEarth1, geoOrthographic
- **Toggle Globe/Map**: Beralih antara tampilan peta flat dan globe 3D
- **Zoom Controls**: Kontrol zoom dengan home button untuk reset
- **Click-to-Simulate**: Klik negara untuk simulasi ledakan

### 💣 Simulasi Bom
- **5 Jenis Bom**: Little Boy, Fat Man, Tsar Bomba, W87, Castle Bravo
- **Data Historis**: Setiap bom memiliki informasi yield dan deskripsi
- **Custom Selector**: Dropdown interaktif dengan keyboard navigation

### 📊 Visualisasi Data
- **Blast Circles**: Animasi lingkaran dampak thermal dengan smooth transition
- **Info Table**: Data lengkap fireball, shockwave, thermal radius
- **Population Estimate**: Estimasi populasi terdampak
- **Infrastructure Damage**: Progress bar kerusakan infrastruktur

### 🎨 UI/UX Modern
- **Dark Mode**: Toggle light/dark theme dengan localStorage persistence
- **Glassmorphism**: Efek kaca modern dengan backdrop blur
- **Smooth Animations**: Fade-in, slide, dan micro-interactions
- **Responsive Design**: Mobile-first design untuk semua device
- **Google Fonts**: Typography modern dengan Inter font

### 📜 Fitur Tambahan
- **Blast History**: Riwayat 10 simulasi terakhir
- **Copy to Clipboard**: Export data simulasi
- **Clear History**: Hapus semua atau per-item
- **Accessibility**: ARIA labels dan keyboard navigation

## 🛠️ Teknologi yang Digunakan

### Core
- **SvelteKit** `^2.49.1` - Full-stack framework dengan SSR
- **Svelte 5** `^5.45.6` - Reactive UI components
- **TypeScript** `^5.9.3` - Static type checking
- **Vite** `^7.2.6` - Lightning-fast build tool

### Libraries
- **@amcharts/amcharts5** `^5.14.4` - Interactive maps dan charts
- **@amcharts/amcharts5-geodata** - World map geodata

### Styling
- **Vanilla CSS** - Custom design system dengan CSS variables
- **Google Fonts** - Inter font family

## 🚀 Instalasi & Development

### Prerequisites
- Node.js 18+ dan npm

### Clone Repository
```sh
git clone https://github.com/username/atomic-range-prediction.git
cd atomic-range-prediction
```

### Install Dependencies
```sh
npm install
```

### Development Server
```sh
npm run dev

# Atau buka otomatis di browser
npm run dev -- --open
```

Aplikasi akan berjalan di `http://localhost:5173`

### Build Production
```sh
npm run build
```

### Preview Production Build
```sh
npm run preview
```

### Type Checking
```sh
npm run check

# Watch mode
npm run check:watch
```

## 📁 Struktur Proyek

```
atomic-range-prediction/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── BombSelector.svelte
│   │   │   ├── BlastInfo.svelte
│   │   │   ├── BlastHistory.svelte
│   │   │   ├── DarkModeToggle.svelte
│   │   │   └── MapChart.svelte
│   │   ├── stores/
│   │   │   └── appStore.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── utils/
│   │       ├── blastCalculator.ts
│   │       └── constants.ts
│   ├── routes/
│   │   ├── +layout.svelte
│   │   └── +page.svelte
│   ├── app.css
│   └── app.html
├── static/
│   └── images/
├── old/
│   └── main.html (backup HTML original)
├── package.json
├── svelte.config.js
├── tsconfig.json
└── vite.config.ts
```

## 📷 Preview

![Screenshot](static/images/preview.jpg)

## 🎯 Cara Menggunakan

1. **Buka aplikasi** di browser
2. **Pilih jenis bom** dari dropdown selector
3. **Klik pada negara** di peta interaktif
4. **Lihat animasi** blast circle yang muncul
5. **Periksa data** di tabel informasi
6. **Cek riwayat** simulasi di panel history

## 🌐 Deployment

### Vercel (Recommended)
```sh
npm install -g vercel
vercel
```

### Netlify
```sh
npm run build
# Upload folder build/ ke Netlify
```

### Static Hosting
Untuk hosting static seperti GitHub Pages, update `svelte.config.js`:
```js
import adapter from '@sveltejs/adapter-static';
```

Kemudian:
```sh
npm run build
# Deploy folder build/
```

## 💡 Catatan Penting

### ⚠️ Disclaimer
Data simulasi ini **hanya untuk tujuan edukasi**. Formula yang digunakan adalah pendekatan sederhana dan **bukan perhitungan militer yang sebenarnya**.

### 🔬 Formula Blast Radius
- **Fireball**: `0.62 × yield^0.4` km
- **Shockwave**: `1.8 × yield^0.33` km  
- **Thermal**: `3.2 × yield^0.4` km

*(yield dalam kiloton)*

## 🤝 Contributing

Kontribusi sangat diterima! Silakan:
1. Fork repository
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Author

Created with ❤️ using SvelteKit

---

💡 **Atomic Range Prediction** - Eksplorasi dampak bom atom dengan peta interaktif dan animasi modern!
