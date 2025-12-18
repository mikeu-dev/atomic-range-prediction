# ☢️ Atomic Range Prediction

**Simulator interaktif untuk mempelajari dampak bom atom dengan visualisasi peta global**

> Educational tool untuk memahami radius dan efek dari berbagai jenis senjata nuklir menggunakan data dan formula yang realistis.

[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=flat&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![amCharts](https://img.shields.io/badge/amCharts-0093D7?style=flat)](https://www.amcharts.com/)

---

## ✨ Features

### 🎯 Core Features

- **6 Blast Zones Visualization** - Fireball, Radiation, Heavy Blast, Moderate Blast, Light Blast, dan Thermal Radiation
- **Interactive World Map** - Click anywhere untuk simulasi dengan animasi real-time
- **Multiple Bomb Types** - Dari Little Boy (15kt) hingga Tsar Bomba (50,000kt)
- **Wind & Fallout System** - Visualisasi pattern radioactive fallout berdasarkan arah angin
- **Real Population Density** - Estimasi korban berdasarkan data 50+ cities dan 40+ countries

### 🚀 Advanced Features

- **📊 Comparison Mode** - Bandingkan 2 bom secara side-by-side
- **📤 Export & Share** - Export sebagai PNG/PDF/JSON/CSV atau share via link
- **🔍 Location Search** - Cari kota/negara dengan autocomplete
- **📜 Simulation History** - Track 10 simulasi terakhir
- **🎓 Interactive Tutorial** - Guided tour untuk first-time users
- **🌓 Dark Mode** - Support light dan dark theme

---

## 🎬 Preview

### Main Interface
![Main Interface](docs/screenshots/main-interface.png)

### Comparison Mode
![Comparison Mode](docs/screenshots/comparison-mode.png)

### Export Options
![Export Menu](docs/screenshots/export-menu.png)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm atau yarn

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/atomic-range-prediction.git
cd atomic-range-prediction

# Install dependencies
npm install

# Start development server
npm run dev
```

Buka browser di `http://localhost:5173`

### 🌐 Deployment

Proyek ini siap di-deploy ke **Vercel** dengan konfigurasi otomatis:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fatomic-range-prediction)

Untuk detail lebih lanjut, lihat [DEPLOYMENT.md](file:///var/www/html/atomic-range-prediction/DEPLOYMENT.md).

---

## 📖 Usage Guide

### Basic Simulation

1. **Pilih Bom** - Gunakan dropdown untuk memilih jenis bom
2. **Klik Peta** - Click pada negara mana saja di peta
3. **Lihat Hasil** - Blast zones akan muncul dengan animasi
4. **Analisis Data** - Panel info menampilkan detail lengkap

### Comparison Mode

1. Click **"Comparison Mode"** toggle
2. Pilih **2 bombs** dari grid selector
3. Click lokasi di peta
4. Lihat perbandingan detail di comparison panel

### Export Results

1. Click **"Export & Share"** button
2. Pilih format: PNG, PDF, JSON, atau CSV
3. File akan otomatis download

### Share Simulation

1. Run simulasi
2. Click **"Copy Share Link"** dari Export menu
3. Share URL dengan orang lain
4. Mereka akan melihat exact same simulation

---

## 🏗️ Tech Stack

### Frontend

- **SvelteKit** - Full-stack framework
- **TypeScript** - Type safety
- **amCharts 5** - Interactive maps & visualizations
- **Vite** - Build tool

### Libraries

- **html2canvas** - Screenshot export
- **jsPDF** - PDF generation
- **driver.js** - Interactive tutorials
- **Nominatim API** - Location search

---

## 📊 Data Sources

### Population Density

Data kepadatan populasi dari:
- UN World Urbanization Prospects 2024
- World Bank Open Data
- Wikipedia city statistics

**Coverage:**
- 50+ major cities worldwide
- 40+ countries
- Hierarchical fallback system

### Nuclear Physics Formulas

Blast radius calculations based on:
- Scaling law: `R = C × Y^(1/3)`
- Different zones menggunakan konstanta berbeda
- Pressure overpressure models (PSI)

---

## 🛠️ Development

### Project Structure

```
src/
├── lib/
│   ├── components/       # Svelte components
│   │   ├── MapChart.svelte
│   │   ├── BombSelector.svelte
│   │   ├── BlastInfo.svelte
│   │   ├── ComparisonPanel.svelte
│   │   └── ...
│   ├── stores/          # Svelte stores
│   │   └── appStore.ts
│   ├── utils/           # Utility functions
│   │   ├── blastCalculator.ts
│   │   ├── populationData.ts
│   │   ├── exportUtils.ts
│   │   └── ...
│   └── types/           # TypeScript types
│       └── index.ts
├── routes/              # SvelteKit routes
│   └── +page.svelte
└── app.css             # Global styles
```

### Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Build
npm run build            # Production build
npm run preview          # Preview production build

# Linting
npm run check            # Type checking
npm run lint             # Lint code
```

### Adding New Bomb Types

Edit `src/lib/utils/constants.ts`:

```typescript
export const BOMB_TYPES: BombType[] = [
    // ...existing bombs
    {
        id: 'new-bomb',
        name: 'New Bomb Name',
        yieldKt: 1000, // yield in kilotons
        description: 'Description here'
    }
];
```

---

## 📈 Performance

### Bundle Size

- **Initial Load:** ~450KB (gzipped)
- **Dependencies:** 325KB
- **Application Code:** 125KB

### Load Times

- **First Paint:** < 1s
- **Interactive:** < 2s
- **Map Load:** ~2s

### Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 🔒 Security

### Input Validation

- Coordinate validation (lat/lon ranges)
- Yield validation (0.001kt - 100,000kt)
- Country name sanitization
- XSS prevention

### Data Privacy

- No user data collected
- No analytics tracking
- No external API calls (except Nominatim for search)
- All calculations client-side

---

## 🎓 Educational Purpose

**Disclaimer:** Aplikasi ini dibuat untuk tujuan **edukasi dan awareness** tentang efek destruktif senjata nuklir. Data dan formula yang digunakan adalah pendekatan sederhana dan bukan perhitungan militer yang sebenarnya.

### Learning Objectives

- Memahami skala dampak senjata nuklir
- Membandingkan destructive power antar bomb types
- Awareness tentang bahaya radiasi dan fallout
- Memahami konsep blast pressure dan thermal effects

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Guidelines

- Follow existing code style
- Add comments untuk complex logic
- Update documentation jika perlu
- Test thoroughly before PR

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 👥 Credits

### Developer

- **Your Name** - Initial work

### Data Sources

- Nuclear weapons data from public sources
- Population data from UN & World Bank
- Map data from amCharts

### Libraries

- [SvelteKit](https://kit.svelte.dev/)
- [amCharts](https://www.amcharts.com/)
- [html2canvas](https://html2canvas.hertzen.com/)
- [jsPDF](https://github.com/parallax/jsPDF)
- [driver.js](https://driverjs.com/)

---

## 📧 Contact

- Email: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)
- Website: https://yourwebsite.com

---

## 🙏 Acknowledgments

- Inspired by [NUKEMAP](https://nuclearsecrecy.com/nukemap/) by Alex Wellerstein
- Nuclear physics formulas from scientific literature
- Community feedback and contributions

---

**⚠️ Remember:** Nuclear weapons are catastrophic. This tool is meant to educate about their dangers, not glorify their use.
