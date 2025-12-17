<script lang="ts">
    import { locale, setLocale, type Locale } from "$lib/i18n";
</script>

<div class="lang-switcher">
    <button
        class="lang-btn {$locale === 'id' ? 'active' : ''}"
        on:click={() => setLocale("id")}
        title="Bahasa Indonesia"
    >
        <span class="flag">🇮🇩</span>
        <span class="lang-code">ID</span>
    </button>
    <button
        class="lang-btn {$locale === 'en' ? 'active' : ''}"
        on:click={() => setLocale("en")}
        title="English"
    >
        <span class="flag">🇬🇧</span>
        <span class="lang-code">EN</span>
    </button>
</div>

<style>
    .lang-switcher {
        display: flex;
        gap: var(--space-xs);
        background: var(--color-bg-secondary);
        border: 2px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: 2px;
    }

    .lang-btn {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        padding: var(--space-xs) var(--space-sm);

        background: transparent;
        border: none;
        border-radius: var(--radius-sm);

        cursor: pointer;
        transition: all var(--transition-fast);
    }

    .lang-btn:hover {
        background: var(--color-bg-tertiary);
    }

    .lang-btn.active {
        background: var(--color-primary);
        color: white;
    }

    .flag {
        font-size: 1.2rem;
        line-height: 1;
    }

    .lang-code {
        font-size: var(--font-size-xs);
        font-weight: 700;
        letter-spacing: 0.5px;
    }

    @media (max-width: 768px) {
        .lang-code {
            display: none;
        }

        .lang-btn {
            padding: var(--space-xs);
        }
    }
</style>
