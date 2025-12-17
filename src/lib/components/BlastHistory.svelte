<script lang="ts">
    import {
        blastHistory,
        clearBlastHistory,
        removeBlastFromHistory,
    } from "$lib/stores/appStore";
    import { formatNumber } from "$lib/utils/blastCalculator";

    function handleClearAll() {
        if (confirm("Hapus semua riwayat simulasi?")) {
            clearBlastHistory();
        }
    }

    function handleRemove(id: string) {
        removeBlastFromHistory(id);
    }

    function formatTime(timestamp: number): string {
        const date = new Date(timestamp);
        return date.toLocaleString("id-ID", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
</script>

{#if $blastHistory.length > 0}
    <div class="blast-history card fade-in">
        <div class="header">
            <h3>
                <span class="icon">📜</span>
                Riwayat Simulasi
                <span class="count">({$blastHistory.length})</span>
            </h3>
            <button class="clear-btn" on:click={handleClearAll}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path
                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                    ></path>
                </svg>
                Hapus Semua
            </button>
        </div>

        <div class="history-list">
            {#each $blastHistory as event (event.id)}
                <div class="history-item fade-in">
                    <div class="item-content">
                        <div class="item-header">
                            <strong class="location">{event.countryName}</strong
                            >
                            <span class="time"
                                >{formatTime(event.timestamp)}</span
                            >
                        </div>
                        <div class="item-details">
                            <span class="bomb-name">{event.bombType.name}</span>
                            <span class="separator">•</span>
                            <span class="yield"
                                >{formatNumber(event.bombType.yieldKt)} kt</span
                            >
                            <span class="separator">•</span>
                            <span class="thermal"
                                >☢️ {event.blastData.thermal} km</span
                            >
                        </div>
                    </div>
                    <button
                        class="remove-btn"
                        on:click={() => handleRemove(event.id)}
                        title="Hapus"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            {/each}
        </div>
    </div>
{/if}

<style>
    .blast-history {
        width: 100%;
        max-width: 500px;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--space-md);
        padding-bottom: var(--space-md);
        border-bottom: 2px solid var(--color-border);
    }

    h3 {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        font-size: var(--font-size-lg);
        color: var(--color-text-primary);
        margin: 0;
    }

    .icon {
        font-size: var(--font-size-xl);
    }

    .count {
        font-size: var(--font-size-sm);
        color: var(--color-text-tertiary);
        font-weight: 400;
    }

    .clear-btn {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        padding: var(--space-xs) var(--space-sm);

        background: var(--color-danger);
        color: white;
        border: none;
        border-radius: var(--radius-sm);

        font-size: var(--font-size-sm);
        font-weight: 500;
        cursor: pointer;
        transition: all var(--transition-fast);
    }

    .clear-btn:hover {
        opacity: 0.9;
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
    }

    .history-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
        max-height: 400px;
        overflow-y: auto;
    }

    .history-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-md);
        padding: var(--space-md);

        background: var(--color-bg-tertiary);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);

        transition: all var(--transition-fast);
    }

    .history-item:hover {
        background: var(--color-border);
        transform: translateX(4px);
    }

    .item-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
    }

    .item-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-md);
    }

    .location {
        font-size: var(--font-size-base);
        color: var(--color-text-primary);
    }

    .time {
        font-size: var(--font-size-xs);
        color: var(--color-text-tertiary);
    }

    .item-details {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
    }

    .bomb-name {
        font-weight: 600;
    }

    .separator {
        color: var(--color-border);
    }

    .yield {
        color: var(--color-primary);
        font-weight: 500;
    }

    .thermal {
        color: var(--color-danger);
        font-weight: 500;
    }

    .remove-btn {
        flex-shrink: 0;
        width: 32px;
        height: 32px;

        display: flex;
        align-items: center;
        justify-content: center;

        background: transparent;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        color: var(--color-text-tertiary);

        cursor: pointer;
        transition: all var(--transition-fast);
    }

    .remove-btn:hover {
        background: var(--color-danger);
        border-color: var(--color-danger);
        color: white;
    }
</style>
