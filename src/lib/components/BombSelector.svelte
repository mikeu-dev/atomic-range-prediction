<script lang="ts">
    import { selectedBomb } from "$lib/stores/appStore";
    import { BOMB_TYPES } from "$lib/utils/constants";
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
    <label for="bomb-select">Pilih Jenis Bom:</label>
    <div class="select-wrapper">
        <button
            class="select-button"
            on:click|stopPropagation={toggleDropdown}
            id="bomb-select"
        >
            <span class="selected-value">
                <strong>{$selectedBomb.name}</strong>
                <span class="yield"
                    >({$selectedBomb.yieldKt.toLocaleString("id-ID")} kt)</span
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
                                {bomb.yieldKt.toLocaleString("id-ID")} kiloton
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
</div>

<style>
    .bomb-selector {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
        width: 100%;
        max-width: 400px;
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
