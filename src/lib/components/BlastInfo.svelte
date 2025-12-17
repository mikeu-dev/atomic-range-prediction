<script lang="ts">
    import { currentBlastData } from "$lib/stores/appStore";
    import { formatNumber } from "$lib/utils/blastCalculator";

    let copySuccess = false;

    function copyToClipboard() {
        if (!$currentBlastData) return;

        const text = `
Atomic Range Prediction - Data Simulasi

Wilayah: ${$currentBlastData.countryName}
Dampak Fireball: ${$currentBlastData.blastData.fireball} km
Dampak Shockwave: ${$currentBlastData.blastData.shockwave} km
Dampak Thermal: ${$currentBlastData.blastData.thermal} km
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

        <table class="info-table">
            <tbody>
                <tr>
                    <th>Wilayah</th>
                    <td class="highlight">{$currentBlastData.countryName}</td>
                </tr>
                <tr class="danger-row">
                    <th>
                        <span class="icon">🔥</span>
                        Dampak Fireball
                    </th>
                    <td
                        ><strong
                            >{$currentBlastData.blastData.fireball} km</strong
                        ></td
                    >
                </tr>
                <tr class="warning-row">
                    <th>
                        <span class="icon">💥</span>
                        Dampak Shockwave
                    </th>
                    <td
                        ><strong
                            >{$currentBlastData.blastData.shockwave} km</strong
                        ></td
                    >
                </tr>
                <tr class="danger-row">
                    <th>
                        <span class="icon">☢️</span>
                        Dampak Thermal
                    </th>
                    <td
                        ><strong
                            >{$currentBlastData.blastData.thermal} km</strong
                        ></td
                    >
                </tr>
                <tr>
                    <th>
                        <span class="icon">👥</span>
                        Populasi Terdampak
                    </th>
                    <td>{formatNumber($currentBlastData.population)} orang</td>
                </tr>
                <tr>
                    <th>
                        <span class="icon">🏗️</span>
                        Kerusakan Infrastruktur
                    </th>
                    <td>
                        <div class="progress-bar">
                            <div
                                class="progress-fill"
                                style="width: {$currentBlastData.infrastructure}%"
                            ></div>
                            <span class="progress-text"
                                >{$currentBlastData.infrastructure}%</span
                            >
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
{/if}

<style>
    .blast-info {
        width: 100%;
        max-width: 600px;
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

    .info-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
    }

    .info-table tr {
        transition: background-color var(--transition-fast);
    }

    .info-table tr:hover {
        background: var(--color-bg-tertiary);
    }

    .info-table th,
    .info-table td {
        padding: var(--space-md);
        text-align: left;
        border-bottom: 1px solid var(--color-border);
    }

    .info-table tr:last-child th,
    .info-table tr:last-child td {
        border-bottom: none;
    }

    .info-table th {
        font-weight: 600;
        color: var(--color-text-secondary);
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: var(--space-sm);
    }

    .info-table td {
        color: var(--color-text-primary);
        font-size: var(--font-size-base);
    }

    .icon {
        font-size: var(--font-size-lg);
    }

    .highlight {
        font-weight: 700;
        color: var(--color-primary);
        font-size: var(--font-size-lg);
    }

    .danger-row {
        background: hsla(0, 70%, 50%, 0.05);
    }

    .warning-row {
        background: hsla(40, 90%, 55%, 0.05);
    }

    .progress-bar {
        position: relative;
        width: 100%;
        height: 28px;
        background: var(--color-bg-tertiary);
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
</style>
