<script lang="ts">
    import {
        HISTORICAL_EVENTS,
        type HistoricalEvent,
    } from "$lib/data/historicalEvents";
    import { selectedBomb } from "$lib/stores/appStore";
    import { BOMB_TYPES } from "$lib/utils/constants";
    import { t, locale } from "$lib/i18n";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let showPanel = false;

    function simulateEvent(event: HistoricalEvent) {
        // Set the bomb type
        const bomb = BOMB_TYPES.find((b) => b.id === event.bombId);
        if (bomb) {
            selectedBomb.set(bomb);
        }

        // Dispatch event to parent to pan map and simulate
        dispatch("simulate", {
            lat: event.location.lat,
            lon: event.location.lon,
            bombId: event.bombId,
        });

        showPanel = false;
    }

    // Separate events by category
    const warfareEvents = HISTORICAL_EVENTS.filter(
        (e) => e.category === "warfare",
    );
    const testEvents = HISTORICAL_EVENTS.filter((e) => e.category === "test");
</script>

<button class="panel-trigger" on:click={() => (showPanel = !showPanel)}>
    <span class="icon">📜</span>
    <span class="text">History</span>
</button>

{#if showPanel}
    <div
        class="historical-overlay"
        on:click={() => (showPanel = false)}
        on:keydown={(e) => e.key === "Escape" && (showPanel = false)}
        role="dialog"
        aria-modal="true"
        tabindex="-1"
    >
        <div
            class="historical-panel glass"
            on:click|stopPropagation
            on:keydown={(e) => e.stopPropagation()}
            role="document"
        >
            <div class="panel-header">
                <h3>📜 Historical Nuclear Events</h3>
                <button class="close-btn" on:click={() => (showPanel = false)}
                    >✕</button
                >
            </div>

            <div class="panel-content">
                <div class="category-section">
                    <h4 class="category-title">⚔️ Warfare (World War II)</h4>
                    <div class="events-grid">
                        {#each warfareEvents as event}
                            <div class="event-card warfare">
                                <div class="event-header">
                                    <h5>
                                        {$locale === "en"
                                            ? event.name
                                            : event.nameId}
                                    </h5>
                                    <span class="event-date">{event.date}</span>
                                </div>
                                <div class="event-body">
                                    <p class="event-location">
                                        📍 {event.location.city}, {event
                                            .location.country}
                                    </p>
                                    <p class="event-description">
                                        {$locale === "en"
                                            ? event.description
                                            : event.descriptionId}
                                    </p>
                                    <div class="event-stats">
                                        <div class="stat">
                                            <span class="stat-label"
                                                >Immediate Deaths:</span
                                            >
                                            <span class="stat-value"
                                                >{event.casualties.immediate.toLocaleString()}</span
                                            >
                                        </div>
                                        <div class="stat">
                                            <span class="stat-label"
                                                >Total Deaths:</span
                                            >
                                            <span class="stat-value"
                                                >{event.casualties.total.toLocaleString()}</span
                                            >
                                        </div>
                                    </div>
                                </div>
                                <button
                                    class="simulate-btn"
                                    on:click={() => simulateEvent(event)}
                                >
                                    🎯 Simulate This Event
                                </button>
                            </div>
                        {/each}
                    </div>
                </div>

                <div class="category-section">
                    <h4 class="category-title">🧪 Nuclear Tests</h4>
                    <div class="events-grid">
                        {#each testEvents as event}
                            <div class="event-card test">
                                <div class="event-header">
                                    <h5>
                                        {$locale === "en"
                                            ? event.name
                                            : event.nameId}
                                    </h5>
                                    <span class="event-date">{event.date}</span>
                                </div>
                                <div class="event-body">
                                    <p class="event-location">
                                        📍 {event.location.city}, {event
                                            .location.country}
                                    </p>
                                    <p class="event-description">
                                        {$locale === "en"
                                            ? event.description
                                            : event.descriptionId}
                                    </p>
                                </div>
                                <button
                                    class="simulate-btn"
                                    on:click={() => simulateEvent(event)}
                                >
                                    🎯 Simulate This Event
                                </button>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .panel-trigger {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        padding: var(--space-xs) var(--space-sm);

        background: var(--color-bg-secondary);
        border: 2px solid var(--color-border);
        border-radius: var(--radius-md);

        cursor: pointer;
        transition: all var(--transition-fast);
    }

    .panel-trigger:hover {
        background: var(--color-primary);
        border-color: var(--color-primary);
        color: white;
        transform: translateY(-2px);
    }

    .icon {
        font-size: 1.2rem;
    }

    .text {
        font-size: var(--font-size-sm);
        font-weight: 600;
    }

    .historical-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(4px);

        display: flex;
        align-items: center;
        justify-content: center;

        z-index: 1000;
        animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .historical-panel {
        width: 90%;
        max-width: 1000px;
        max-height: 85vh;

        padding: var(--space-2xl);
        border-radius: var(--radius-lg);

        overflow: hidden;
        display: flex;
        flex-direction: column;

        animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--space-lg);
    }

    .panel-header h3 {
        margin: 0;
        font-size: var(--font-size-xl);
        color: var(--color-text-primary);
    }

    .close-btn {
        width: 32px;
        height: 32px;

        background: var(--color-bg-tertiary);
        border: none;
        border-radius: 50%;

        font-size: var(--font-size-lg);
        color: var(--color-text-secondary);
        cursor: pointer;

        transition: all var(--transition-fast);
    }

    .close-btn:hover {
        background: var(--color-danger);
        color: white;
    }

    .panel-content {
        flex: 1;
        overflow-y: auto;
    }

    .category-section {
        margin-bottom: var(--space-2xl);
    }

    .category-title {
        font-size: var(--font-size-lg);
        color: var(--color-primary);
        margin-bottom: var(--space-md);
    }

    .events-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--space-lg);
    }

    .event-card {
        background: var(--color-bg-secondary);
        border: 2px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: var(--space-lg);

        display: flex;
        flex-direction: column;
        gap: var(--space-md);

        transition: all var(--transition-fast);
    }

    .event-card.warfare {
        border-color: hsl(0, 70%, 50%);
    }

    .event-card.test {
        border-color: hsl(200, 70%, 50%);
    }

    .event-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
    }

    .event-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--space-sm);
    }

    .event-header h5 {
        margin: 0;
        font-size: var(--font-size-base);
        color: var(--color-text-primary);
    }

    .event-date {
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
        white-space: nowrap;
    }

    .event-location {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        margin: 0;
    }

    .event-description {
        font-size: var(--font-size-sm);
        line-height: 1.6;
        color: var(--color-text-primary);
        margin: 0;
    }

    .event-stats {
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
        padding: var(--space-sm);
        background: var(--color-bg-tertiary);
        border-radius: var(--radius-sm);
    }

    .stat {
        display: flex;
        justify-content: space-between;
        font-size: var(--font-size-xs);
    }

    .stat-label {
        color: var(--color-text-secondary);
    }

    .stat-value {
        font-weight: 700;
        color: var(--color-danger);
    }

    .simulate-btn {
        padding: var(--space-sm) var(--space-md);

        background: var(--color-primary);
        color: white;
        border: none;
        border-radius: var(--radius-md);

        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-fast);
    }

    .simulate-btn:hover {
        background: hsl(24, 100%, 55%);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }

    @media (max-width: 768px) {
        .historical-panel {
            width: 95%;
            padding: var(--space-lg);
        }

        .events-grid {
            grid-template-columns: 1fr;
        }

        .text {
            display: none;
        }
    }
</style>
