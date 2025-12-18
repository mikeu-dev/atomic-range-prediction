<script lang="ts">
    import { onMount } from "svelte";
    import { driver } from "driver.js";
    import { tutorialSteps, tutorialConfig } from "$lib/utils/tutorialSteps";
    import "driver.js/dist/driver.css";

    let hasSeenTutorial = $state(false);
    let showNewBadge = $state(false);

    onMount(() => {
        // Check if user has seen tutorial
        const completed = localStorage.getItem("tutorial_completed");
        hasSeenTutorial = completed === "true";
        showNewBadge = !hasSeenTutorial;

        // Auto-start for first-time users (after short delay)
        if (!hasSeenTutorial) {
            setTimeout(() => {
                startTutorial();
            }, 1000);
        }
    });

    function startTutorial() {
        const driverObj = driver({
            ...tutorialConfig,
            steps: tutorialSteps,
            onCloseClick: () => {
                driverObj.destroy();
            },
            onNextClick: () => {
                if (driverObj.isLastStep()) {
                    driverObj.destroy();
                } else {
                    driverObj.moveNext();
                }
            },
            onDestroyed: () => {
                // Cleanup after tutorial completes or is closed
                localStorage.setItem("tutorial_completed", "true");
                hasSeenTutorial = true;
                showNewBadge = false;
            },
        });

        driverObj.drive();
    }
</script>

<button
    class="tutorial-btn"
    onclick={startTutorial}
    title="Show Tutorial"
    aria-label="Show interactive tutorial"
>
    <span class="icon">❓</span>
    {#if showNewBadge}
        <span class="badge">Baru</span>
    {/if}
</button>

<style>
    .tutorial-btn {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;

        background: var(--color-bg-secondary);
        border: 2px solid var(--color-border);
        border-radius: 50%;

        cursor: pointer;
        transition: all var(--transition-fast);
    }

    .tutorial-btn:hover {
        background: var(--color-primary);
        border-color: var(--color-primary);
        transform: scale(1.1);
        box-shadow: var(--shadow-md);
    }

    .tutorial-btn:hover .icon {
        transform: rotate(15deg);
    }

    .icon {
        font-size: 1.3rem;
        transition: transform var(--transition-fast);
    }

    .badge {
        position: absolute;
        top: -8px;
        right: -8px;
        padding: 3px 7px;

        background: hsl(350, 90%, 60%);
        color: white;
        border-radius: 12px;
        border: 2px solid var(--color-bg-primary);

        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;

        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }

    /* Custom driver.js styling */
    :global(.driver-popover) {
        background: var(--color-bg-secondary) !important;
        color: var(--color-text-primary) !important;
        border: 2px solid var(--color-primary) !important;
        box-shadow: var(--shadow-lg) !important;
        border-radius: var(--radius-md) !important;
    }

    :global(.driver-popover-title) {
        font-size: var(--font-size-lg) !important;
        font-weight: 700 !important;
        color: var(--color-primary) !important;
        margin-bottom: var(--space-sm) !important;
    }

    :global(.driver-popover-description) {
        font-size: var(--font-size-sm) !important;
        line-height: 1.6 !important;
        color: var(--color-text-primary) !important;
    }

    :global(.driver-popover-progress-text) {
        font-size: var(--font-size-xs) !important;
        color: var(--color-text-secondary) !important;
        font-weight: 600 !important;
    }

    :global(.driver-popover-next-btn),
    :global(.driver-popover-prev-btn),
    :global(.driver-popover-close-btn) {
        font-size: var(--font-size-sm) !important;
        padding: var(--space-xs) var(--space-md) !important;
        border-radius: var(--radius-sm) !important;
        font-weight: 600 !important;
        transition: all var(--transition-fast) !important;
    }

    :global(.driver-popover-next-btn) {
        background: var(--color-primary) !important;
        color: white !important;
        border: none !important;
    }

    :global(.driver-popover-next-btn:hover) {
        background: hsl(24, 100%, 55%) !important;
        transform: translateY(-2px) !important;
    }

    :global(.driver-popover-prev-btn) {
        background: var(--color-bg-tertiary) !important;
        color: var(--color-text-primary) !important;
        border: 1px solid var(--color-border) !important;
    }

    :global(.driver-popover-close-btn) {
        color: var(--color-text-secondary) !important;
    }

    :global(.driver-popover-close-btn:hover) {
        color: var(--color-danger) !important;
    }

    /* Highlighted element styling */
    :global(.driver-active-element) {
        outline: 3px solid var(--color-primary) !important;
        outline-offset: 4px !important;
    }

    @media (max-width: 768px) {
        .tutorial-btn {
            width: 40px;
            height: 40px;
        }

        .icon {
            font-size: 1.1rem;
        }

        :global(.driver-popover) {
            max-width: 90vw !important;
        }
    }
</style>
