<script lang="ts">
    import { comparisonBombs, currentBlastData } from "$lib/stores/appStore";
    import {
        calculateBlastRadius,
        estimatePopulationAffected,
    } from "$lib/utils/blastCalculator";
    import { getPopulationDensityInfo } from "$lib/utils/populationData";
    import type { BlastData } from "$lib/types";

    function formatNumber(num: number): string {
        return new Intl.NumberFormat("id-ID").format(num);
    }

    function formatDifference(val1: number, val2: number): string {
        const diff = ((val2 - val1) / val1) * 100;
        const sign = diff > 0 ? "+" : "";
        return `${sign}${diff.toFixed(1)}%`;
    }

    $: bomb1 = $comparisonBombs[0];
    $: bomb2 = $comparisonBombs[1];

    $: bomb1Data = bomb1 ? calculateBlastRadius(bomb1.yieldKt) : null;
    $: bomb2Data = bomb2 ? calculateBlastRadius(bomb2.yieldKt) : null;

    // Get location for population estimation
    $: location = $currentBlastData
        ? {
              lat: 0, // Will use from map click
              lon: 0,
              country: $currentBlastData.countryName,
          }
        : null;

    $: bomb1Pop =
        bomb1Data && location
            ? estimatePopulationAffected(
                  bomb1Data.thermal,
                  undefined,
                  undefined,
                  location.country,
              )
            : 0;
    $: bomb2Pop =
        bomb2Data && location
            ? estimatePopulationAffected(
                  bomb2Data.thermal,
                  undefined,
                  undefined,
                  location.country,
              )
            : 0;
</script>

{#if bomb1Data && bomb2Data}
    <div class="comparison-panel glass">
        <h3 class="panel-title">
            <span class="title-icon">📊</span>
            Comparison Analysis
        </h3>

        <div class="bomb-headers">
            <div class="bomb-header bomb1">
                <span class="bomb-badge">Bomb 1</span>
                <span class="bomb-name">{bomb1.name}</span>
                <span class="bomb-yield">{formatNumber(bomb1.yieldKt)} kt</span>
            </div>
            <div class="bomb-header bomb2">
                <span class="bomb-badge">Bomb 2</span>
                <span class="bomb-name">{bomb2.name}</span>
                <span class="bomb-yield">{formatNumber(bomb2.yieldKt)} kt</span>
            </div>
        </div>

        <div class="comparison-table-wrapper">
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Zone</th>
                        <th class="bomb1-col">{bomb1.name}</th>
                        <th class="bomb2-col">{bomb2.name}</th>
                        <th>Difference</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="zone-name">
                            <span class="zone-icon">🔥</span>
                            Fireball
                        </td>
                        <td class="value bomb1-col"
                            >{bomb1Data.fireball.toFixed(2)} km</td
                        >
                        <td class="value bomb2-col"
                            >{bomb2Data.fireball.toFixed(2)} km</td
                        >
                        <td
                            class="diff {bomb2Data.fireball > bomb1Data.fireball
                                ? 'positive'
                                : 'negative'}"
                        >
                            {formatDifference(
                                bomb1Data.fireball,
                                bomb2Data.fireball,
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td class="zone-name">
                            <span class="zone-icon">☢️</span>
                            Radiation
                        </td>
                        <td class="value bomb1-col"
                            >{bomb1Data.radiation.toFixed(2)} km</td
                        >
                        <td class="value bomb2-col"
                            >{bomb2Data.radiation.toFixed(2)} km</td
                        >
                        <td
                            class="diff {bomb2Data.radiation >
                            bomb1Data.radiation
                                ? 'positive'
                                : 'negative'}"
                        >
                            {formatDifference(
                                bomb1Data.radiation,
                                bomb2Data.radiation,
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td class="zone-name">
                            <span class="zone-icon">💥</span>
                            Heavy Blast
                        </td>
                        <td class="value bomb1-col"
                            >{bomb1Data.heavyBlast.toFixed(2)} km</td
                        >
                        <td class="value bomb2-col"
                            >{bomb2Data.heavyBlast.toFixed(2)} km</td
                        >
                        <td
                            class="diff {bomb2Data.heavyBlast >
                            bomb1Data.heavyBlast
                                ? 'positive'
                                : 'negative'}"
                        >
                            {formatDifference(
                                bomb1Data.heavyBlast,
                                bomb2Data.heavyBlast,
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td class="zone-name">
                            <span class="zone-icon">💣</span>
                            Moderate Blast
                        </td>
                        <td class="value bomb1-col"
                            >{bomb1Data.moderateBlast.toFixed(2)} km</td
                        >
                        <td class="value bomb2-col"
                            >{bomb2Data.moderateBlast.toFixed(2)} km</td
                        >
                        <td
                            class="diff {bomb2Data.moderateBlast >
                            bomb1Data.moderateBlast
                                ? 'positive'
                                : 'negative'}"
                        >
                            {formatDifference(
                                bomb1Data.moderateBlast,
                                bomb2Data.moderateBlast,
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td class="zone-name">
                            <span class="zone-icon">🌊</span>
                            Light Blast
                        </td>
                        <td class="value bomb1-col"
                            >{bomb1Data.lightBlast.toFixed(2)} km</td
                        >
                        <td class="value bomb2-col"
                            >{bomb2Data.lightBlast.toFixed(2)} km</td
                        >
                        <td
                            class="diff {bomb2Data.lightBlast >
                            bomb1Data.lightBlast
                                ? 'positive'
                                : 'negative'}"
                        >
                            {formatDifference(
                                bomb1Data.lightBlast,
                                bomb2Data.lightBlast,
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td class="zone-name">
                            <span class="zone-icon">🌡️</span>
                            Thermal
                        </td>
                        <td class="value bomb1-col"
                            >{bomb1Data.thermal.toFixed(2)} km</td
                        >
                        <td class="value bomb2-col"
                            >{bomb2Data.thermal.toFixed(2)} km</td
                        >
                        <td
                            class="diff {bomb2Data.thermal > bomb1Data.thermal
                                ? 'positive'
                                : 'negative'}"
                        >
                            {formatDifference(
                                bomb1Data.thermal,
                                bomb2Data.thermal,
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="summary-stats">
            <div class="stat-item">
                <span class="stat-label">Estimated Casualties:</span>
                <div class="stat-values">
                    <span class="stat-value bomb1-text"
                        >{formatNumber(bomb1Pop)}</span
                    >
                    <span class="stat-vs">vs</span>
                    <span class="stat-value bomb2-text"
                        >{formatNumber(bomb2Pop)}</span
                    >
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .comparison-panel {
        padding: var(--space-xl);
        border-radius: var(--radius-lg);
    }

    .panel-title {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        margin: 0 0 var(--space-lg) 0;
        font-size: var(--font-size-xl);
        color: var(--color-text-primary);
    }

    .title-icon {
        font-size: 1.5rem;
    }

    .bomb-headers {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-md);
        margin-bottom: var(--space-lg);
    }

    .bomb-header {
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
        padding: var(--space-md);
        border-radius: var(--radius-md);
        border: 2px solid;
    }

    .bomb-header.bomb1 {
        border-color: hsl(24, 100%, 50%);
        background: hsla(24, 100%, 50%, 0.1);
    }

    .bomb-header.bomb2 {
        border-color: hsl(200, 100%, 50%);
        background: hsla(200, 100%, 50%, 0.1);
    }

    .bomb-badge {
        font-size: var(--font-size-xs);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        opacity: 0.7;
    }

    .bomb-name {
        font-size: var(--font-size-lg);
        font-weight: 700;
        color: var(--color-text-primary);
    }

    .bomb-yield {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
    }

    .comparison-table-wrapper {
        overflow-x: auto;
    }

    .comparison-table {
        width: 100%;
        border-collapse: collapse;
    }

    .comparison-table th,
    .comparison-table td {
        padding: var(--space-sm) var(--space-md);
        text-align: left;
        border-bottom: 1px solid var(--color-border);
    }

    .comparison-table thead th {
        background: var(--color-bg-tertiary);
        font-weight: 600;
        font-size: var(--font-size-sm);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--color-text-secondary);
    }

    .comparison-table tbody tr:hover {
        background: var(--color-bg-tertiary);
    }

    .zone-name {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        font-weight: 600;
    }

    .zone-icon {
        font-size: 1.2rem;
    }

    .value {
        font-family: "Courier New", monospace;
        font-weight: 600;
    }

    .bomb1-col {
        color: hsl(24, 100%, 50%);
    }

    .bomb2-col {
        color: hsl(200, 100%, 50%);
    }

    .bomb1-text {
        color: hsl(24, 100%, 50%);
    }

    .bomb2-text {
        color: hsl(200, 100%, 50%);
    }

    .diff {
        font-weight: 700;
        font-family: "Courier New", monospace;
    }

    .diff.positive {
        color: hsl(120, 60%, 50%);
    }

    .diff.positive::before {
        content: "↑ ";
    }

    .diff.negative {
        color: hsl(0, 60%, 50%);
    }

    .diff.negative::before {
        content: "↓ ";
    }

    .summary-stats {
        margin-top: var(--space-lg);
        padding: var(--space-md);
        background: var(--color-bg-tertiary);
        border-radius: var(--radius-md);
    }

    .stat-item {
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
    }

    .stat-label {
        font-size: var(--font-size-sm);
        font-weight: 600;
        color: var(--color-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .stat-values {
        display: flex;
        align-items: center;
        gap: var(--space-md);
        font-size: var(--font-size-xl);
        font-weight: 700;
    }

    .stat-vs {
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
    }

    @media (max-width: 768px) {
        .comparison-table {
            font-size: var(--font-size-xs);
        }

        .comparison-table th,
        .comparison-table td {
            padding: var(--space-xs) var(--space-sm);
        }

        .bomb-headers {
            grid-template-columns: 1fr;
        }

        .stat-values {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-xs);
        }
    }
</style>
