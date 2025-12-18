<script lang="ts">
    import { selectedBomb, useRealTimeWeather } from "$lib/stores/appStore";
    import { BOMB_TYPES } from "$lib/utils/constants";
    import { t, locale } from "$lib/i18n";
    import type { BombType } from "$lib/types";

    let isOpen = false;

    function selectBomb(bomb: BombType) {
        selectedBomb.set(bomb);
        isOpen = false;
    }

    function toggleDropdown() {
        isOpen = !isOpen;
    }

    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest(".bomb-selector")) {
            isOpen = false;
        }
    }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="bomb-selector">
    <label for="bomb-select">{$t("bomb.select")}:</label>
    <div class="select-wrapper">
        <button
            class="select-button"
            on:click|stopPropagation={toggleDropdown}
            id="bomb-select"
        >
            <span class="selected-value">
                <strong>{$selectedBomb.name}</strong>
                <span class="yield"
                    >({$selectedBomb.yieldKt.toLocaleString(
                        $locale === "id" ? "id-ID" : "en-US",
                    )} kt)</span
                >
            </span>
            <svg
                class="chevron"
                class:open={isOpen}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </button>

        {#if isOpen}
            <div class="dropdown fade-in">
                {#each BOMB_TYPES as bomb}
                    <button
                        class="dropdown-item"
                        class:active={bomb.id === $selectedBomb.id}
                        on:click={() => selectBomb(bomb)}
                    >
                        <div class="bomb-info">
                            <div class="bomb-name">{bomb.name}</div>
                            <div class="bomb-yield">
                                {bomb.yieldKt.toLocaleString(
                                    $locale === "id" ? "id-ID" : "en-US",
                                )} kt
                            </div>
                            {#if bomb.description}
                                <div class="bomb-description">
                                    {bomb.description}
                                </div>
                            {/if}
                        </div>
                        {#if bomb.id === $selectedBomb.id}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        {/if}
                    </button>
                {/each}
            </div>
        {/if}
    </div>

    <!-- Real-time Weather Toggle -->
    <div class="weather-toggle">
        <label class="switch">
            <input type="checkbox" bind:checked={$useRealTimeWeather} />
            <span class="slider round"></span>
        </label>
        <div class="weather-info">
            <span class="weather-label">{$t("bomb.useRealWeather")}</span>
            <span class="weather-desc">{$t("bomb.weatherDesc")}</span>
        </div>
    </div>
</div>

<style>
    .bomb-selector {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
        width: 100%;
        max-width: 400px;
    }

    .weather-toggle {
        display: flex;
        align-items: center;
        gap: var(--space-md);
        padding: var(--space-md);
        background: var(--color-bg-tertiary);
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
    }

    .weather-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .weather-label {
        font-size: var(--font-size-sm);
        font-weight: 600;
        color: var(--color-text-primary);
    }

    .weather-desc {
        font-size: 10px;
        color: var(--color-text-secondary);
    }

    /* Switch Style */
    .switch {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 22px;
        flex-shrink: 0;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--color-border);
        transition: 0.4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.4s;
    }

    input:checked + .slider {
        background-color: var(--color-primary);
    }

    input:focus + .slider {
        box-shadow: 0 0 1px var(--color-primary);
    }

    input:checked + .slider:before {
        transform: translateX(22px);
    }

    .slider.round {
        border-radius: 22px;
    }

    .slider.round:before {
        border-radius: 50%;
    }

    label {
        font-weight: 600;
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .select-wrapper {
        position: relative;
    }

    .select-button {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-md);
        padding: var(--space-md) var(--space-lg);

        background: var(--color-bg-secondary);
        border: 2px solid var(--color-border);
        border-radius: var(--radius-md);

        font-size: var(--font-size-base);
        cursor: pointer;
        transition: all var(--transition-base);
    }

    .select-button:hover {
        border-color: var(--color-primary);
        box-shadow: var(--shadow-md);
    }

    .select-button:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
    }

    .selected-value {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
    }

    .selected-value strong {
        color: var(--color-text-primary);
        font-size: var(--font-size-lg);
    }

    .yield {
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
    }

    .chevron {
        transition: transform var(--transition-base);
        color: var(--color-text-secondary);
        flex-shrink: 0;
    }

    .chevron.open {
        transform: rotate(180deg);
    }

    .dropdown {
        position: absolute;
        top: calc(100% + var(--space-sm));
        left: 0;
        right: 0;
        z-index: 100;

        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-xl);

        max-height: 400px;
        overflow-y: auto;

        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    }

    .dropdown-item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-md);
        padding: var(--space-md) var(--space-lg);

        background: transparent;
        border: none;
        border-bottom: 1px solid var(--color-border);

        text-align: left;
        cursor: pointer;
        transition: all var(--transition-fast);
    }

    .dropdown-item:last-child {
        border-bottom: none;
    }

    .dropdown-item:hover {
        background: var(--color-bg-tertiary);
    }

    .dropdown-item.active {
        background: hsla(210, 100%, 50%, 0.1);
    }

    .bomb-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .bomb-name {
        font-weight: 600;
        color: var(--color-text-primary);
        font-size: var(--font-size-base);
    }

    .bomb-yield {
        color: var(--color-primary);
        font-size: var(--font-size-sm);
        font-weight: 500;
    }

    .bomb-description {
        color: var(--color-text-tertiary);
        font-size: var(--font-size-xs);
        line-height: 1.4;
    }

    svg {
        flex-shrink: 0;
        color: var(--color-primary);
    }
</style>
