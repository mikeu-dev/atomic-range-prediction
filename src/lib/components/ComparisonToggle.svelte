<script lang="ts">
    import { comparisonMode, comparisonBombs } from "$lib/stores/appStore";
    import { BOMB_TYPES } from "$lib/utils/constants";
    import { t } from "$lib/i18n";

    let selectedBombIds: string[] = [];

    // Update comparison bombs when selection changes
    $: if ($comparisonMode && selectedBombIds.length === 2) {
        $comparisonBombs = BOMB_TYPES.filter((b) =>
            selectedBombIds.includes(b.id),
        );
    }

    function toggleComparison() {
        $comparisonMode = !$comparisonMode;

        if (!$comparisonMode) {
            // Reset when exiting comparison mode
            selectedBombIds = [];
            $comparisonBombs = [];
        }
    }

    $: isValid = selectedBombIds.length === 2;
</script>

<div class="comparison-toggle">
    <button
        class="toggle-btn {$comparisonMode ? 'active' : ''}"
        on:click={toggleComparison}
    >
        <span class="toggle-icon">{$comparisonMode ? "✅" : "⚪"}</span>
        <span class="toggle-text">{$t("comparison.mode")}</span>
    </button>

    {#if $comparisonMode}
        <div class="bomb-selector">
            <p class="selector-label">{$t("comparison.selectLabel")}</p>
            <div class="bomb-grid">
                {#each BOMB_TYPES as bomb}
                    <label class="bomb-checkbox">
                        <input
                            type="checkbox"
                            value={bomb.id}
                            bind:group={selectedBombIds}
                            disabled={!selectedBombIds.includes(bomb.id) &&
                                selectedBombIds.length >= 2}
                        />
                        <span class="bomb-name">
                            {$t(`bomb.${bomb.id}`)}
                            <span class="bomb-yield">({bomb.yieldKt}kt)</span>
                        </span>
                    </label>
                {/each}
            </div>

            {#if !isValid}
                <p class="validation-message">
                    {$t("comparison.validation")}
                </p>
            {/if}
        </div>
    {/if}
</div>

<style>
    .comparison-toggle {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
    }

    .toggle-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-sm);
        padding: var(--space-sm) var(--space-lg);

        background: var(--color-bg-secondary);
        border: 2px solid var(--color-border);
        border-radius: var(--radius-md);

        font-size: var(--font-size-sm);
        font-weight: 600;
        color: var(--color-text-primary);
        cursor: pointer;

        transition: all var(--transition-fast);
    }

    .toggle-btn:hover {
        border-color: var(--color-primary);
        background: var(--color-bg-tertiary);
    }

    .toggle-btn.active {
        background: var(--color-primary);
        border-color: var(--color-primary);
        color: white;
    }

    .toggle-icon {
        font-size: 1.2rem;
    }

    .bomb-selector {
        padding: var(--space-md);
        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);

        animation: slideDown 0.2s ease;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .selector-label {
        margin: 0 0 var(--space-sm) 0;
        font-size: var(--font-size-sm);
        font-weight: 600;
        color: var(--color-text-primary);
    }

    .bomb-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: var(--space-sm);
    }

    .bomb-checkbox {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        padding: var(--space-xs) var(--space-sm);

        background: var(--color-bg-tertiary);
        border-radius: var(--radius-sm);
        cursor: pointer;

        transition: background var(--transition-fast);
    }

    .bomb-checkbox:has(input:checked) {
        background: hsla(24, 100%, 50%, 0.1);
        border: 1px solid var(--color-primary);
    }

    .bomb-checkbox:has(input:disabled) {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .bomb-checkbox:hover:not(:has(input:disabled)) {
        background: var(--color-bg-primary);
    }

    .bomb-checkbox input {
        cursor: pointer;
    }

    .bomb-name {
        font-size: var(--font-size-sm);
        color: var(--color-text-primary);
    }

    .bomb-yield {
        color: var(--color-text-secondary);
        font-size: var(--font-size-xs);
    }

    .validation-message {
        margin: var(--space-sm) 0 0 0;
        padding: var(--space-xs) var(--space-sm);

        background: hsla(40, 90%, 55%, 0.1);
        border: 1px solid hsla(40, 90%, 55%, 0.3);
        border-radius: var(--radius-sm);

        font-size: var(--font-size-xs);
        color: var(--color-warning);
        text-align: center;
    }

    @media (max-width: 768px) {
        .bomb-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
