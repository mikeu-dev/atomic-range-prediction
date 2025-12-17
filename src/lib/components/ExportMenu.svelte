<script lang="ts">
    import { blastHistory, currentBlastData } from "$lib/stores/appStore";
    import {
        exportAsPNG,
        exportAsPDF,
        exportAsJSON,
        exportAsCSV,
        prepareBlastHistoryForCSV,
    } from "$lib/utils/exportUtils";
    import { generateShareLink, copyToClipboard } from "$lib/utils/shareUtils";
    import type { BlastEvent } from "$lib/types";

    let showMenu = false;
    let isExporting = false;
    let copySuccess = false;
    let errorMessage = "";

    // Get latest blast event for sharing
    $: latestBlast =
        $blastHistory.length > 0
            ? $blastHistory[$blastHistory.length - 1]
            : null;

    async function handleExportPNG() {
        isExporting = true;
        errorMessage = "";

        try {
            await exportAsPNG(
                "app-container",
                `blast-simulation-${Date.now()}.png`,
            );
        } catch (error) {
            errorMessage = "PNG export failed";
            console.error(error);
        } finally {
            isExporting = false;
            showMenu = false;
        }
    }

    async function handleExportPDF() {
        isExporting = true;
        errorMessage = "";

        try {
            await exportAsPDF(
                "app-container",
                `blast-simulation-${Date.now()}.pdf`,
            );
        } catch (error) {
            errorMessage = "PDF export failed";
            console.error(error);
        } finally {
            isExporting = false;
            showMenu = false;
        }
    }

    function handleExportJSON() {
        errorMessage = "";

        try {
            if ($currentBlastData) {
                // Export current simulation
                exportAsJSON(
                    $currentBlastData,
                    `blast-data-${Date.now()}.json`,
                );
            } else if ($blastHistory.length > 0) {
                // Export all history
                exportAsJSON($blastHistory, `blast-history-${Date.now()}.json`);
            } else {
                errorMessage = "No data to export";
                return;
            }
        } catch (error) {
            errorMessage = "JSON export failed";
            console.error(error);
        } finally {
            showMenu = false;
        }
    }

    function handleExportCSV() {
        errorMessage = "";

        try {
            if ($blastHistory.length === 0) {
                errorMessage = "No history to export";
                return;
            }

            const csvData = prepareBlastHistoryForCSV($blastHistory);
            exportAsCSV(csvData, `blast-history-${Date.now()}.csv`);
        } catch (error) {
            errorMessage = "CSV export failed";
            console.error(error);
        } finally {
            showMenu = false;
        }
    }

    async function handleCopyShareLink() {
        errorMessage = "";

        try {
            if (!latestBlast) {
                errorMessage = "No simulation to share";
                return;
            }

            const shareUrl = generateShareLink(latestBlast);
            const success = await copyToClipboard(shareUrl);

            if (success) {
                copySuccess = true;
                setTimeout(() => {
                    copySuccess = false;
                }, 2000);
            } else {
                errorMessage = "Failed to copy link";
            }
        } catch (error) {
            errorMessage = "Share link generation failed";
            console.error(error);
        }
    }

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest(".export-container")) {
            showMenu = false;
        }
    }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="export-container">
    <button
        class="export-btn"
        on:click|stopPropagation={() => (showMenu = !showMenu)}
        disabled={isExporting}
    >
        {#if isExporting}
            <span class="btn-spinner"></span>
            Exporting...
        {:else}
            📤 Export & Share
            <span class="arrow">{showMenu ? "▲" : "▼"}</span>
        {/if}
    </button>

    {#if showMenu}
        <div
            class="export-menu"
            on:click|stopPropagation
            on:keydown={(e) => e.key === "Escape" && (showMenu = false)}
            role="menu"
            tabindex="-1"
        >
            <div class="menu-section">
                <div class="menu-label">📸 Screenshot</div>
                <button
                    class="menu-item"
                    on:click={handleExportPNG}
                    disabled={isExporting}
                >
                    <span class="item-icon">🖼️</span>
                    <span class="item-text">Export as PNG</span>
                </button>
                <button
                    class="menu-item"
                    on:click={handleExportPDF}
                    disabled={isExporting}
                >
                    <span class="item-icon">📄</span>
                    <span class="item-text">Export as PDF</span>
                </button>
            </div>

            <div class="menu-divider"></div>

            <div class="menu-section">
                <div class="menu-label">📊 Data</div>
                <button
                    class="menu-item"
                    on:click={handleExportJSON}
                    disabled={!$currentBlastData && $blastHistory.length === 0}
                >
                    <span class="item-icon">📋</span>
                    <span class="item-text">Export JSON</span>
                </button>
                <button
                    class="menu-item"
                    on:click={handleExportCSV}
                    disabled={$blastHistory.length === 0}
                >
                    <span class="item-icon">📊</span>
                    <span class="item-text">Export CSV</span>
                </button>
            </div>

            <div class="menu-divider"></div>

            <div class="menu-section">
                <div class="menu-label">🔗 Share</div>
                <button
                    class="menu-item"
                    on:click={handleCopyShareLink}
                    disabled={!latestBlast}
                >
                    <span class="item-icon">{copySuccess ? "✅" : "🔗"}</span>
                    <span class="item-text">
                        {copySuccess ? "Link Copied!" : "Copy Share Link"}
                    </span>
                </button>
            </div>

            {#if errorMessage}
                <div class="error-message">
                    ⚠️ {errorMessage}
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    .export-container {
        position: relative;
        display: inline-block;
    }

    .export-btn {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        padding: var(--space-sm) var(--space-md);

        background: var(--color-primary);
        color: white;
        border: none;
        border-radius: var(--radius-md);

        font-size: var(--font-size-sm);
        font-weight: 600;
        cursor: pointer;

        transition: all var(--transition-fast);
    }

    .export-btn:hover:not(:disabled) {
        background: hsl(24, 100%, 55%);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }

    .export-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .arrow {
        font-size: 10px;
        transition: transform var(--transition-fast);
    }

    .btn-spinner {
        width: 14px;
        height: 14px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    /* Export Menu */
    .export-menu {
        position: absolute;
        top: calc(100% + var(--space-xs));
        right: 0;
        min-width: 220px;

        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);

        z-index: 1000;

        animation: menuSlideIn 0.2s ease;
    }

    @keyframes menuSlideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .menu-section {
        padding: var(--space-sm);
    }

    .menu-label {
        font-size: var(--font-size-xs);
        font-weight: 600;
        color: var(--color-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: var(--space-xs) var(--space-sm);
        margin-bottom: var(--space-xs);
    }

    .menu-item {
        width: 100%;
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        padding: var(--space-sm) var(--space-md);

        background: transparent;
        border: none;
        border-radius: var(--radius-sm);

        text-align: left;
        cursor: pointer;

        transition: all var(--transition-fast);
    }

    .menu-item:hover:not(:disabled) {
        background: var(--color-bg-tertiary);
    }

    .menu-item:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .item-icon {
        font-size: 1.2rem;
        flex-shrink: 0;
    }

    .item-text {
        font-size: var(--font-size-sm);
        color: var(--color-text-primary);
        font-weight: 500;
    }

    .menu-divider {
        height: 1px;
        background: var(--color-border);
        margin: var(--space-xs) 0;
    }

    .error-message {
        padding: var(--space-sm);
        margin: var(--space-xs);
        background: hsla(0, 70%, 50%, 0.1);
        border: 1px solid hsla(0, 70%, 50%, 0.3);
        border-radius: var(--radius-sm);
        font-size: var(--font-size-xs);
        color: var(--color-danger);
    }

    @media (max-width: 768px) {
        .export-menu {
            right: auto;
            left: 0;
        }
    }
</style>
