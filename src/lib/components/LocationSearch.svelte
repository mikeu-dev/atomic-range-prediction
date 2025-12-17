<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let placeholder = "Cari lokasi (kota, negara, koordinat)...";

    const dispatch = createEventDispatcher<{
        select: { lat: number; lon: number; name: string };
    }>();

    let searchQuery = "";
    let searchResults: Array<{
        lat: number;
        lon: number;
        name: string;
        display_name: string;
    }> = [];
    let isSearching = false;
    let showResults = false;
    let searchTimeout: number;

    /**
     * Search location using Nominatim OpenStreetMap API
     * Free, no API key required
     */
    async function searchLocation() {
        if (searchQuery.trim().length < 3) {
            searchResults = [];
            showResults = false;
            return;
        }

        isSearching = true;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?` +
                    `format=json&q=${encodeURIComponent(searchQuery)}&limit=5`,
                {
                    headers: {
                        "User-Agent": "AtomicRangePrediction/1.0",
                    },
                },
            );

            if (!response.ok) {
                throw new Error("Search failed");
            }

            const data = await response.json();

            searchResults = data.map((item: any) => ({
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon),
                name: item.name,
                display_name: item.display_name,
            }));

            showResults = searchResults.length > 0;
        } catch (error) {
            console.error("Search error:", error);
            searchResults = [];
            showResults = false;
        } finally {
            isSearching = false;
        }
    }

    function handleInput() {
        // Debounce search
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(searchLocation, 500) as unknown as number;
    }

    function selectLocation(result: (typeof searchResults)[0]) {
        dispatch("select", {
            lat: result.lat,
            lon: result.lon,
            name: result.display_name,
        });

        searchQuery = result.name;
        showResults = false;
    }

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest(".search-wrapper")) {
            showResults = false;
        }
    }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="search-wrapper">
    <div class="search-input-wrapper">
        <svg
            class="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
        >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
        </svg>

        <input
            type="text"
            class="search-input"
            {placeholder}
            bind:value={searchQuery}
            on:input={handleInput}
            on:focus={() => {
                if (searchResults.length > 0) showResults = true;
            }}
        />

        {#if isSearching}
            <div class="search-spinner"></div>
        {/if}

        {#if searchQuery}
            <button
                class="clear-btn"
                on:click={() => {
                    searchQuery = "";
                    searchResults = [];
                    showResults = false;
                }}
                title="Hapus"
            >
                ×
            </button>
        {/if}
    </div>

    {#if showResults}
        <div class="search-results">
            {#each searchResults as result}
                <button
                    class="search-result-item"
                    on:click={() => selectLocation(result)}
                >
                    <svg
                        class="result-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                        ></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <div class="result-text">
                        <div class="result-name">{result.name}</div>
                        <div class="result-address">{result.display_name}</div>
                    </div>
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    .search-wrapper {
        position: relative;
        width: 100%;
        max-width: 500px;
    }

    .search-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .search-icon {
        position: absolute;
        left: var(--space-sm);
        color: var(--color-text-secondary);
        pointer-events: none;
    }

    .search-input {
        width: 100%;
        padding: var(--space-sm) var(--space-xl);
        padding-left: calc(var(--space-sm) * 2 + 20px);

        font-size: var(--font-size-base);
        font-family: inherit;

        background: var(--color-bg-secondary);
        border: 2px solid var(--color-border);
        border-radius: var(--radius-md);

        color: var(--color-text-primary);

        transition: all var(--transition-fast);
    }

    .search-input:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1);
    }

    .search-input::placeholder {
        color: var(--color-text-secondary);
    }

    .search-spinner {
        position: absolute;
        right: calc(var(--space-sm) + 30px);
        width: 16px;
        height: 16px;
        border: 2px solid var(--color-border);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .clear-btn {
        position: absolute;
        right: var(--space-sm);
        width: 24px;
        height: 24px;

        display: flex;
        align-items: center;
        justify-content: center;

        background: var(--color-bg-tertiary);
        border: none;
        border-radius: 50%;

        font-size: 20px;
        color: var(--color-text-secondary);
        cursor: pointer;

        transition: all var(--transition-fast);
    }

    .clear-btn:hover {
        background: var(--color-danger);
        color: white;
    }

    /* Search Results Dropdown */
    .search-results {
        position: absolute;
        top: calc(100% + var(--space-xs));
        left: 0;
        right: 0;

        max-height: 400px;
        overflow-y: auto;

        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);

        z-index: 1000;

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

    .search-result-item {
        width: 100%;
        padding: var(--space-sm);

        display: flex;
        align-items: flex-start;
        gap: var(--space-sm);

        background: transparent;
        border: none;
        border-bottom: 1px solid var(--color-border);

        text-align: left;
        cursor: pointer;

        transition: background var(--transition-fast);
    }

    .search-result-item:last-child {
        border-bottom: none;
    }

    .search-result-item:hover {
        background: var(--color-bg-tertiary);
    }

    .result-icon {
        flex-shrink: 0;
        margin-top: 2px;
        color: var(--color-primary);
    }

    .result-text {
        flex: 1;
        min-width: 0;
    }

    .result-name {
        font-size: var(--font-size-base);
        font-weight: 600;
        color: var(--color-text-primary);
        margin-bottom: 2px;
    }

    .result-address {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    @media (max-width: 768px) {
        .search-wrapper {
            max-width: 100%;
        }

        .search-results {
            max-height: 300px;
        }
    }
</style>
