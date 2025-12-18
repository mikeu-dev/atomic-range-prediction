<script lang="ts">
    import { toasts } from "$lib/stores/toastStore";
    import { flip } from "svelte/animate";
    import { fly } from "svelte/transition";
</script>

<div class="toast-container">
    {#each $toasts as toast (toast.id)}
        <div
            class="toast {toast.type}"
            animate:flip={{ duration: 300 }}
            in:fly={{ y: 50, duration: 300 }}
            out:fly={{ x: 100, duration: 200 }}
        >
            <span class="icon">
                {#if toast.type === "success"}
                    ✅
                {:else if toast.type === "error"}
                    ❌
                {:else if toast.type === "warning"}
                    ⚠️
                {:else}
                    ℹ️
                {/if}
            </span>
            <p class="message">{toast.message}</p>
            <button class="close" onclick={() => toasts.remove(toast.id)}>
                ✕
            </button>
        </div>
    {/each}
</div>

<style>
    .toast-container {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 12px;
        pointer-events: none;
    }

    .toast {
        pointer-events: auto;
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 280px;
        max-width: 450px;
        padding: 16px;
        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        border-left: 4px solid var(--color-primary);
    }

    .toast.success {
        border-left-color: #10b981;
    }
    .toast.error {
        border-left-color: var(--color-danger);
    }
    .toast.warning {
        border-left-color: var(--color-warning);
    }
    .toast.info {
        border-left-color: var(--color-primary);
    }

    .icon {
        font-size: 1.25rem;
        flex-shrink: 0;
    }

    .message {
        flex: 1;
        margin: 0;
        font-size: var(--font-size-sm);
        font-weight: 500;
        color: var(--color-text-primary);
        line-height: 1.4;
    }

    .close {
        background: none;
        border: none;
        color: var(--color-text-tertiary);
        font-size: 1rem;
        cursor: pointer;
        padding: 4px;
        transition: color 0.2s;
        line-height: 1;
    }

    .close:hover {
        color: var(--color-danger);
    }

    @media (max-width: 640px) {
        .toast-container {
            bottom: 12px;
            right: 12px;
            left: 12px;
        }
        .toast {
            min-width: 0;
            width: 100%;
        }
    }
</style>
