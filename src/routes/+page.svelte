<script lang="ts">
    import BombSelector from "$lib/components/BombSelector.svelte";
    import MapChart from "$lib/components/MapChart.svelte";
    import BlastInfo from "$lib/components/BlastInfo.svelte";
    import BlastHistory from "$lib/components/BlastHistory.svelte";
    import DarkModeToggle from "$lib/components/DarkModeToggle.svelte";
    import LocationSearch from "$lib/components/LocationSearch.svelte";
    import ExportMenu from "$lib/components/ExportMenu.svelte";
    import ComparisonToggle from "$lib/components/ComparisonToggle.svelte";
    import ComparisonPanel from "$lib/components/ComparisonPanel.svelte";
    import TutorialButton from "$lib/components/TutorialButton.svelte";
    import LanguageSwitcher from "$lib/components/LanguageSwitcher.svelte";
    import EducationalPanel from "$lib/components/EducationalPanel.svelte";
    import HistoricalEvents from "$lib/components/HistoricalEvents.svelte";
    import PlaybackControl from "$lib/components/PlaybackControl.svelte";
    import { comparisonMode } from "$lib/stores/appStore";

    let mapChartRef: any;

    function handleHistoricalSimulation(event: CustomEvent) {
        const { lat, lon, bombId } = event.detail;
        // Pan map to historical location
        if (mapChartRef && mapChartRef.panToLocation) {
            mapChartRef.panToLocation(lat, lon, 8);
        }
        // Trigger click on map would be ideal but we can just pan
    }
</script>

<div id="app-container">
    <main class="container">
        <header class="header fade-in">
            <div class="title-section">
                <h1 class="title">
                    <span class="icon">☢️</span>
                    Atomic Range Prediction
                </h1>
                <p class="subtitle">
                    Simulasi Interaktif Prediksi Luas Sebaran Bom Atom dengan
                    Peta Global
                </p>
            </div>
            <div class="header-actions">
                <LanguageSwitcher />
                <HistoricalEvents on:simulate={handleHistoricalSimulation} />
                <EducationalPanel />
                <TutorialButton />
                <ExportMenu />
            </div>
        </header>

        <div class="controls-section glass">
            <BombSelector />
            <ComparisonToggle />
            <LocationSearch
                on:select={(e) => {
                    // Pan map to selected location if mapChartRef is available
                    if (mapChartRef && mapChartRef.panToLocation) {
                        mapChartRef.panToLocation(e.detail.lat, e.detail.lon);
                    }
                }}
            />
            <div class="instructions">
                <h3>📍 Cara Menggunakan:</h3>
                <ol>
                    <li>Pilih jenis bom dari dropdown di atas</li>
                    <li>
                        Cari lokasi dengan search box atau klik langsung pada
                        peta
                    </li>
                    <li>Lihat animasi dan data prediksi dampak</li>
                    <li>Aktifkan Comparison Mode untuk membandingkan 2 bom</li>
                </ol>
            </div>
        </div>

        <div class="map-section">
            <MapChart bind:this={mapChartRef} />
        </div>

        {#if $comparisonMode}
            <ComparisonPanel />
        {:else}
            <div class="info-grid">
                <BlastInfo />
                <BlastHistory />
            </div>
        {/if}

        <PlaybackControl
            on:seek={(e) => mapChartRef?.seekSimulation(e.detail.progress)}
            on:replay={() => mapChartRef?.replaySimulation()}
        />

        <footer class="footer">
            <p>
                💡 <strong>Atomic Range Prediction</strong> - Eksplorasi dampak bom
                atom dengan peta interaktif dan animasi modern!
            </p>
            <p class="disclaimer">
                ⚠️ Data simulasi ini hanya untuk tujuan edukasi. Formula yang
                digunakan adalah pendekatan sederhana dan bukan perhitungan
                militer yang sebenarnya.
            </p>
        </footer>
    </main>
</div>

<style>
    #app-container {
        min-height: 100vh;
    }

    .container {
        min-height: 100vh;
        padding: var(--space-2xl) var(--space-lg);
        max-width: 1400px;
        margin: 0 auto;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--space-2xl);
        gap: var(--space-lg);
    }

    .title-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: var(--space-md);
    }

    .title {
        display: flex;
        align-items: center;
        gap: var(--space-md);
        font-size: var(--font-size-3xl);
        font-weight: 700;
        color: var(--color-text-primary);
        margin: 0;
        line-height: 1.2;
    }

    .title .icon {
        font-size: 3rem;
        animation: pulse 2s ease-in-out infinite;
    }

    .subtitle {
        font-size: var(--font-size-lg);
        color: var(--color-text-secondary);
        margin: 0;
        line-height: 1.5;
    }

    .controls-section {
        display: flex;
        flex-direction: column;
        gap: var(--space-lg);
        padding: var(--space-xl);
        border-radius: var(--radius-lg);
        margin-bottom: var(--space-xl);
        animation: fadeIn 0.5s ease-out 0.2s both;
    }

    .instructions {
        padding: var(--space-md) var(--space-lg);
        background: var(--color-bg-tertiary);
        border-left: 4px solid var(--color-primary);
        border-radius: var(--radius-md);
    }

    .instructions h3 {
        margin: 0 0 var(--space-md) 0;
        font-size: var(--font-size-lg);
        color: var(--color-text-primary);
    }

    .instructions ol {
        margin: 0;
        padding-left: var(--space-lg);
        line-height: 1.8;
        color: var(--color-text-secondary);
    }

    .instructions li {
        margin-bottom: var(--space-xs);
    }

    .map-section {
        margin-bottom: var(--space-2xl);
        animation: fadeIn 0.5s ease-out 0.4s both;
    }

    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--space-xl);
        margin-bottom: var(--space-2xl);
        animation: fadeIn 0.5s ease-out 0.6s both;
    }

    .footer {
        text-align: center;
        padding: var(--space-xl) 0;
        border-top: 1px solid var(--color-border);
        margin-top: var(--space-2xl);
    }

    .footer p {
        margin: var(--space-sm) 0;
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
        line-height: 1.6;
    }

    .footer strong {
        color: var(--color-primary);
    }

    .disclaimer {
        max-width: 600px;
        margin: var(--space-md) auto 0;
        padding: var(--space-md);
        background: hsla(40, 90%, 55%, 0.1);
        border-radius: var(--radius-md);
        font-size: var(--font-size-xs);
    }

    /* Responsive */
    @media (max-width: 768px) {
        .container {
            padding: var(--space-xl) var(--space-md);
        }

        .header {
            flex-direction: column;
            align-items: flex-start;
        }

        .header-actions {
            width: 100%;
        }

        .title {
            font-size: var(--font-size-2xl);
        }

        .subtitle {
            font-size: var(--font-size-base);
        }

        .controls-section {
            padding: var(--space-lg);
        }

        .info-grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 480px) {
        .title {
            font-size: var(--font-size-xl);
        }

        .title .icon {
            font-size: 2rem;
        }
    }
</style>
