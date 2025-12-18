<script lang="ts">
    import { currentBlastData } from "$lib/stores/appStore";
    import {
        formatNumber,
        calculateOverpressure,
        estimateCasualtiesByZone,
    } from "$lib/utils/blastCalculator";
    import {
        BLAST_ZONE_COLORS,
        BLAST_ZONE_OPACITY,
    } from "$lib/utils/constants";
    import { getPopulationDensityInfo } from "$lib/utils/populationData";
    import { getWindDirectionName } from "$lib/utils/windEffects";

    let copySuccess = false;

    function copyToClipboard() {
        if (!$currentBlastData) return;

        const text = `
Atomic Range Prediction - Data Simulasi

Wilayah: ${$currentBlastData.countryName}
Zona Fireball: ${$currentBlastData.blastData.fireball} km
Zona Radiasi: ${$currentBlastData.blastData.radiation} km
Heavy Blast (20 psi): ${$currentBlastData.blastData.heavyBlast} km
Moderate Blast (5 psi): ${$currentBlastData.blastData.moderateBlast} km
Light Blast (1 psi): ${$currentBlastData.blastData.lightBlast} km
Zona Thermal: ${$currentBlastData.blastData.thermal} km
Populasi Terdampak: ${formatNumber($currentBlastData.population)} orang
Kerusakan Infrastruktur: ${$currentBlastData.infrastructure}%
		`.trim();

        navigator.clipboard.writeText(text).then(() => {
            copySuccess = true;
            setTimeout(() => {
                copySuccess = false;
            }, 2000);
        });
    }
</script>

{#if $currentBlastData}
    <div class="blast-info card fade-in">
        <div class="header">
            <h2>Data Simulasi</h2>
            <button
                class="copy-btn"
                on:click={copyToClipboard}
                title="Salin ke clipboard"
            >
                {#if copySuccess}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Tersalin!</span>
                {:else}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"
                        ></rect>
                        <path
                            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                        ></path>
                    </svg>
                    <span>Salin</span>
                {/if}
            </button>
        </div>

        <!-- Wilayah Info -->
        <div class="country-info">
            <h3>Wilayah Target</h3>
            <p class="country-name">{$currentBlastData.countryName}</p>

            <!-- Population Density Info -->
            {#if $currentBlastData.blastData}
                {@const densityInfo = getPopulationDensityInfo(
                    $currentBlastData.blastData.thermal || 0,
                    0,
                    $currentBlastData.countryName,
                )}
                <div class="density-badge">
                    <span class="density-icon">📊</span>
                    <div class="density-text">
                        <span class="density-label">Kepadatan Populasi:</span>
                        <span class="density-value"
                            >{formatNumber(densityInfo.density)} orang/km²</span
                        >
                        <span class="density-source">({densityInfo.name})</span>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Lokasi & Cuaca Section -->
        <div class="weather-section">
            <div class="weather-card">
                <div class="weather-header">
                    <span class="weather-icon">🌬️</span>
                    <h3>Cuaca & Fallout</h3>
                </div>
                {#if $currentBlastData.wind}
                    <div class="weather-grid">
                        <div class="weather-item">
                            <span class="w-label">Arah Angin</span>
                            <span class="w-value">
                                {getWindDirectionName(
                                    $currentBlastData.wind.direction,
                                )}
                                ({$currentBlastData.wind.direction}°)
                            </span>
                        </div>
                        <div class="weather-item">
                            <span class="w-label">Kecepatan</span>
                            <span class="w-value"
                                >{$currentBlastData.wind.speed} km/jam</span
                            >
                        </div>
                        <div class="weather-item">
                            <span class="w-label">Sumber</span>
                            <span class="w-value"
                                >{$currentBlastData.wind.isRealTime
                                    ? "📡 Real-time"
                                    : "🎲 Simulasi"}</span
                            >
                        </div>
                    </div>
                {:else}
                    <p class="no-data">Data cuaca tidak tersedia</p>
                {/if}

                {#if $currentBlastData.falloutPattern}
                    <div class="fallout-info">
                        <div class="fallout-meter">
                            <span class="w-label"
                                >Intensitas Radiasi Fallout</span
                            >
                            <div class="progress-bar fallout">
                                <div
                                    class="progress-fill"
                                    style="width: {$currentBlastData
                                        .falloutPattern.intensity *
                                        100}%; background: #ADFF2F;"
                                ></div>
                                <span class="progress-text"
                                    >{(
                                        $currentBlastData.falloutPattern
                                            .intensity * 100
                                    ).toFixed(0)}%</span
                                >
                            </div>
                        </div>
                        <p class="fallout-desc">
                            Radiasi menyebar sejauh <strong
                                >{$currentBlastData.falloutPattern.length.toFixed(
                                    1,
                                )} km</strong
                            >
                            ke arah {getWindDirectionName(
                                $currentBlastData.falloutPattern.windDirection,
                            )}.
                        </p>
                    </div>
                {/if}
            </div>
        </div>

        <!-- Mini Visualisasi Blast Zones -->
        <div class="blast-zones-visual">
            <h3>Zona Ledakan</h3>
            <div class="zones-container">
                <div
                    class="zone-circle thermal"
                    style="width: 100%; height: 100%; background: {BLAST_ZONE_COLORS.thermal}; opacity: {BLAST_ZONE_OPACITY.thermal};"
                ></div>
                <div
                    class="zone-circle light"
                    style="width: 85%; height: 85%; background: {BLAST_ZONE_COLORS.lightBlast}; opacity: {BLAST_ZONE_OPACITY.lightBlast};"
                ></div>
                <div
                    class="zone-circle moderate"
                    style="width: 65%; height: 65%; background: {BLAST_ZONE_COLORS.moderateBlast}; opacity: {BLAST_ZONE_OPACITY.moderateBlast};"
                ></div>
                <div
                    class="zone-circle heavy"
                    style="width: 45%; height: 45%; background: {BLAST_ZONE_COLORS.heavyBlast}; opacity: {BLAST_ZONE_OPACITY.heavyBlast};"
                ></div>
                <div
                    class="zone-circle radiation"
                    style="width: 25%; height: 25%; background: {BLAST_ZONE_COLORS.radiation}; opacity: {BLAST_ZONE_OPACITY.radiation};"
                ></div>
                <div
                    class="zone-circle fireball"
                    style="width: 10%; height: 10%; background: {BLAST_ZONE_COLORS.fireball}; opacity: {BLAST_ZONE_OPACITY.fireball};"
                ></div>
            </div>
        </div>

        <!-- Detail Zona -->
        <div class="zones-detail">
            <h3>Detail Zona Dampak</h3>

            <div
                class="zone-item"
                style="border-left-color: {BLAST_ZONE_COLORS.fireball}"
            >
                <div class="zone-header">
                    <span class="icon">🔥</span>
                    <span class="zone-name">Fireball</span>
                    <span class="zone-radius"
                        >{$currentBlastData.blastData.fireball} km</span
                    >
                </div>
                <div class="zone-stats">
                    <div class="stat">
                        <span class="stat-label">Tekanan:</span>
                        <span class="stat-value"
                            >{calculateOverpressure("fireball")} psi</span
                        >
                    </div>
                    <div class="stat">
                        <span class="stat-label">Korban:</span>
                        <span class="stat-value"
                            >{formatNumber(
                                estimateCasualtiesByZone(
                                    $currentBlastData.blastData.fireball,
                                    "fireball",
                                ),
                            )}</span
                        >
                    </div>
                </div>
                <p class="zone-desc">
                    Zona inti dengan suhu jutaan derajat - vaporisasi total
                </p>
            </div>

            <div
                class="zone-item"
                style="border-left-color: {BLAST_ZONE_COLORS.radiation}"
            >
                <div class="zone-header">
                    <span class="icon">☢️</span>
                    <span class="zone-name">Radiasi Fatal</span>
                    <span class="zone-radius"
                        >{$currentBlastData.blastData.radiation} km</span
                    >
                </div>
                <div class="zone-stats">
                    <div class="stat">
                        <span class="stat-label">Dosis:</span>
                        <span class="stat-value">500+ rem</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Korban:</span>
                        <span class="stat-value"
                            >{formatNumber(
                                estimateCasualtiesByZone(
                                    $currentBlastData.blastData.radiation,
                                    "radiation",
                                ),
                            )}</span
                        >
                    </div>
                </div>
                <p class="zone-desc">
                    Radiasi langsung mematikan dalam hitungan jam
                </p>
            </div>

            <div
                class="zone-item"
                style="border-left-color: {BLAST_ZONE_COLORS.heavyBlast}"
            >
                <div class="zone-header">
                    <span class="icon">💥</span>
                    <span class="zone-name">Heavy Blast</span>
                    <span class="zone-radius"
                        >{$currentBlastData.blastData.heavyBlast} km</span
                    >
                </div>
                <div class="zone-stats">
                    <div class="stat">
                        <span class="stat-label">Tekanan:</span>
                        <span class="stat-value">20 psi</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Korban:</span>
                        <span class="stat-value"
                            >{formatNumber(
                                estimateCasualtiesByZone(
                                    $currentBlastData.blastData.heavyBlast,
                                    "heavyBlast",
                                ),
                            )}</span
                        >
                    </div>
                </div>
                <p class="zone-desc">Kehancuran total bangunan bertingkat</p>
            </div>

            <div
                class="zone-item"
                style="border-left-color: {BLAST_ZONE_COLORS.moderateBlast}"
            >
                <div class="zone-header">
                    <span class="icon">🏚️</span>
                    <span class="zone-name">Moderate Blast</span>
                    <span class="zone-radius"
                        >{$currentBlastData.blastData.moderateBlast} km</span
                    >
                </div>
                <div class="zone-stats">
                    <div class="stat">
                        <span class="stat-label">Tekanan:</span>
                        <span class="stat-value">5 psi</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Korban:</span>
                        <span class="stat-value"
                            >{formatNumber(
                                estimateCasualtiesByZone(
                                    $currentBlastData.blastData.moderateBlast,
                                    "moderateBlast",
                                ),
                            )}</span
                        >
                    </div>
                </div>
                <p class="zone-desc">
                    Kerusakan parah pada bangunan residensial
                </p>
            </div>

            <div
                class="zone-item"
                style="border-left-color: {BLAST_ZONE_COLORS.lightBlast}"
            >
                <div class="zone-header">
                    <span class="icon">🏢</span>
                    <span class="zone-name">Light Blast</span>
                    <span class="zone-radius"
                        >{$currentBlastData.blastData.lightBlast} km</span
                    >
                </div>
                <div class="zone-stats">
                    <div class="stat">
                        <span class="stat-label">Tekanan:</span>
                        <span class="stat-value">1 psi</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Korban:</span>
                        <span class="stat-value"
                            >{formatNumber(
                                estimateCasualtiesByZone(
                                    $currentBlastData.blastData.lightBlast,
                                    "lightBlast",
                                ),
                            )}</span
                        >
                    </div>
                </div>
                <p class="zone-desc">
                    Jendela pecah, kerusakan struktural ringan
                </p>
            </div>

            <div
                class="zone-item"
                style="border-left-color: {BLAST_ZONE_COLORS.thermal}"
            >
                <div class="zone-header">
                    <span class="icon">🌡️</span>
                    <span class="zone-name">Thermal Radiation</span>
                    <span class="zone-radius"
                        >{$currentBlastData.blastData.thermal} km</span
                    >
                </div>
                <div class="zone-stats">
                    <div class="stat">
                        <span class="stat-label">Intensitas:</span>
                        <span class="stat-value">100 cal/cm²</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Korban:</span>
                        <span class="stat-value"
                            >{formatNumber(
                                estimateCasualtiesByZone(
                                    $currentBlastData.blastData.thermal,
                                    "thermal",
                                ),
                            )}</span
                        >
                    </div>
                </div>
                <p class="zone-desc">Luka bakar tingkat 3, kebakaran massal</p>
            </div>
        </div>

        <!-- Summary Stats -->
        <div class="summary">
            <div class="summary-item main-stat">
                <span class="icon">☠️</span>
                <div>
                    <p class="summary-label">Estimasi Korban Jiwa</p>
                    <p class="summary-value fatalities">
                        {formatNumber($currentBlastData.fatalities)} orang
                    </p>
                </div>
            </div>

            <div class="summary-item secondary-stat">
                <span class="icon">🏥</span>
                <div>
                    <p class="summary-label">Estimasi Korban Luka</p>
                    <p class="summary-value injuries">
                        {formatNumber($currentBlastData.injuries)} orang
                    </p>
                </div>
            </div>

            <div class="summary-item">
                <span class="icon">👥</span>
                <div>
                    <p class="summary-label">Populasi Terdampak</p>
                    <p class="summary-value">
                        {formatNumber($currentBlastData.population)} orang
                    </p>
                </div>
            </div>

            <div class="summary-item">
                <span class="icon">🏗️</span>
                <div>
                    <p class="summary-label">Kerusakan Infrastruktur</p>
                    <div class="progress-bar">
                        <div
                            class="progress-fill"
                            style="width: {$currentBlastData.infrastructure}%"
                        ></div>
                        <span class="progress-text"
                            >{$currentBlastData.infrastructure}%</span
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .blast-info {
        width: 100%;
        max-width: 700px;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--space-md);
        padding-bottom: var(--space-md);
        border-bottom: 2px solid var(--color-border);
    }

    h2 {
        font-size: var(--font-size-xl);
        color: var(--color-text-primary);
        margin: 0;
    }

    h3 {
        font-size: var(--font-size-lg);
        color: var(--color-text-primary);
        margin: 0 0 var(--space-md) 0;
    }

    .copy-btn {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        padding: var(--space-xs) var(--space-sm);

        background: var(--color-bg-tertiary);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);

        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        cursor: pointer;
        transition: all var(--transition-fast);
    }

    .copy-btn:hover {
        background: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
    }

    /* Country Info */
    .country-info {
        margin-bottom: var(--space-lg);
        padding: var(--space-md);
        background: var(--color-bg-tertiary);
        border-radius: var(--radius-md);
    }

    .country-name {
        font-size: var(--font-size-xl);
        font-weight: 700;
        color: var(--color-primary);
        margin: var(--space-xs) 0 0 0;
    }

    .density-badge {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        margin-top: var(--space-md);
        padding: var(--space-sm) var(--space-md);
        background: var(--color-bg-secondary);
        border-radius: var(--radius-sm);
        border-left: 3px solid var(--color-primary);
    }

    .density-icon {
        font-size: 1.5rem;
    }

    .density-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .density-label {
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .density-value {
        font-size: var(--font-size-base);
        font-weight: 700;
        color: var(--color-text-primary);
    }

    .density-source {
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
        font-style: italic;
    }

    /* Blast Zones Visual */
    .blast-zones-visual {
        margin-bottom: var(--space-lg);
        padding: var(--space-md);
        background: var(--color-bg-tertiary);
        border-radius: var(--radius-md);
    }

    .zones-container {
        position: relative;
        width: 200px;
        height: 200px;
        margin: var(--space-md) auto;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .zone-circle {
        position: absolute;
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    /* Zones Detail */
    .zones-detail {
        margin-bottom: var(--space-lg);
    }

    .zone-item {
        background: var(--color-bg-tertiary);
        border-radius: var(--radius-md);
        padding: var(--space-md);
        margin-bottom: var(--space-md);
        border-left: 4px solid;
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
    }

    .zone-item:hover {
        transform: translateX(4px);
        box-shadow: var(--shadow-md);
    }

    .zone-header {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        margin-bottom: var(--space-sm);
    }

    .zone-name {
        font-weight: 600;
        font-size: var(--font-size-base);
        color: var(--color-text-primary);
        flex: 1;
    }

    .zone-radius {
        font-weight: 700;
        font-size: var(--font-size-lg);
        color: var(--color-primary);
    }

    .zone-stats {
        display: flex;
        gap: var(--space-lg);
        margin-bottom: var(--space-sm);
    }

    .stat {
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
    }

    .stat-label {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
    }

    .stat-value {
        font-size: var(--font-size-base);
        font-weight: 600;
        color: var(--color-text-primary);
    }

    .zone-desc {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        margin: 0;
        font-style: italic;
    }

    /* Summary */
    .summary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--space-md);
    }

    .summary-item {
        display: flex;
        gap: var(--space-md);
        padding: var(--space-md);
        background: var(--color-bg-tertiary);
        border-radius: var(--radius-md);
        align-items: center;
        border: 1px solid var(--color-border);
    }

    .summary-item.main-stat {
        border-color: var(--color-danger);
        background: rgba(255, 78, 80, 0.05);
    }

    .summary-item.secondary-stat {
        border-color: var(--color-warning);
        background: rgba(246, 211, 101, 0.05);
    }

    .summary-item .icon {
        font-size: 2rem;
    }

    .summary-label {
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
        margin: 0 0 var(--space-xs) 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .summary-value {
        font-size: var(--font-size-lg);
        font-weight: 700;
        color: var(--color-text-primary);
        margin: 0;
    }

    .summary-value.fatalities {
        color: var(--color-danger);
    }

    .summary-value.injuries {
        color: var(--color-warning);
    }

    .icon {
        font-size: var(--font-size-lg);
    }

    .progress-bar {
        position: relative;
        width: 100%;
        height: 28px;
        background: var(--color-bg-secondary);
        border-radius: var(--radius-sm);
        overflow: hidden;
    }

    .progress-fill {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: linear-gradient(
            90deg,
            var(--color-danger),
            var(--color-warning)
        );
        transition: width var(--transition-slow);
        border-radius: var(--radius-sm);
    }

    .progress-text {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        font-weight: 600;
        font-size: var(--font-size-sm);
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }

    /* Weather Section */
    .weather-section {
        margin-bottom: var(--space-lg);
    }

    .weather-card {
        background: var(--color-bg-tertiary);
        border-radius: var(--radius-md);
        padding: var(--space-md);
        border: 1px solid var(--color-border);
    }

    .weather-header {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        margin-bottom: var(--space-md);
        border-bottom: 1px solid var(--color-border);
        padding-bottom: var(--space-xs);
    }

    .weather-icon {
        font-size: 1.5rem;
    }

    .weather-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-md);
        margin-bottom: var(--space-md);
    }

    .weather-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .w-label {
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .w-value {
        font-size: var(--font-size-base);
        font-weight: 600;
        color: var(--color-text-primary);
    }

    .fallout-info {
        padding: var(--space-md);
        background: var(--color-bg-secondary);
        border-radius: var(--radius-sm);
        border-left: 3px solid #adff2f;
    }

    .fallout-meter {
        margin-bottom: var(--space-sm);
    }

    .progress-bar.fallout {
        height: 20px;
        margin-top: 4px;
    }

    .fallout-desc {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        margin: 0;
        line-height: 1.4;
    }

    .no-data {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        font-style: italic;
    }

    @media (max-width: 768px) {
        .weather-grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 768px) {
        .zone-stats {
            flex-direction: column;
            gap: var(--space-sm);
        }
    }
</style>
