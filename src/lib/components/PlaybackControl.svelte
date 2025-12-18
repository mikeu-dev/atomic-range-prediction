<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { currentBlastData } from "$lib/stores/appStore";

    const dispatch = createEventDispatcher();

    let isPlaying = false;
    let progress = 0;
    let timer: any;

    const DURATION = 5000; // 5 seconds for full animation

    function togglePlay() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            startTimer();
        } else {
            stopTimer();
        }
    }

    function startTimer() {
        if (progress >= 100) progress = 0;

        timer = setInterval(() => {
            progress += 1;
            if (progress >= 100) {
                progress = 100;
                stopTimer();
                isPlaying = false;
            }
            dispatch("seek", { progress });
        }, DURATION / 100);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    function handleSeek(e: any) {
        progress = parseInt(e.target.value);
        dispatch("seek", { progress });
    }

    function replay() {
        progress = 0;
        isPlaying = true;
        startTimer();
        dispatch("replay");
    }

    $: if (!$currentBlastData) {
        progress = 0;
        isPlaying = false;
        stopTimer();
    }
</script>

{#if $currentBlastData}
    <div class="playback-control card fade-in">
        <div class="header">
            <span class="title">Timeline Playback</span>
            <span class="time"
                >T + {((progress * DURATION) / 100000).toFixed(2)}s</span
            >
        </div>

        <div class="controls">
            <button class="control-btn" on:click={replay} title="Replay">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><path
                        d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
                    /><path d="M3 3v5h5" /></svg
                >
            </button>

            <button class="control-btn play-pause" on:click={togglePlay}>
                {#if isPlaying}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        ><rect x="6" y="4" width="4" height="16" /><rect
                            x="14"
                            y="4"
                            width="4"
                            height="16"
                        /></svg
                    >
                {:else}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        ><polygon points="5 3 19 12 5 21 5 3" /></svg
                    >
                {/if}
            </button>

            <input
                type="range"
                min="0"
                max="100"
                value={progress}
                on:input={handleSeek}
                class="seek-bar"
            />
        </div>

        <div class="milestones">
            <span class="milestone {progress > 5 ? 'reached' : ''}"
                >Detonation</span
            >
            <span class="milestone {progress > 30 ? 'reached' : ''}"
                >Shockwave</span
            >
            <span class="milestone {progress > 70 ? 'reached' : ''}"
                >Thermal</span
            >
            <span class="milestone {progress > 90 ? 'reached' : ''}"
                >Fallout</span
            >
        </div>
    </div>
{/if}

<style>
    .playback-control {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 600px;
        background: var(--color-bg-secondary);
        padding: var(--space-md);
        z-index: 100;
        box-shadow: var(--shadow-xl);
        border: 1px solid var(--color-border);
    }

    .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: var(--space-sm);
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .controls {
        display: flex;
        align-items: center;
        gap: var(--space-md);
    }

    .control-btn {
        background: none;
        border: none;
        color: var(--color-text-primary);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--space-xs);
        border-radius: 50%;
        transition: all var(--transition-fast);
    }

    .control-btn:hover {
        background: var(--color-bg-tertiary);
        color: var(--color-primary);
    }

    .play-pause {
        background: var(--color-primary);
        color: white;
        padding: var(--space-sm);
    }

    .play-pause:hover {
        background: var(--color-secondary);
        color: white;
        transform: scale(1.1);
    }

    .seek-bar {
        flex: 1;
        accent-color: var(--color-primary);
    }

    .milestones {
        display: flex;
        justify-content: space-between;
        margin-top: var(--space-sm);
    }

    .milestone {
        font-size: 10px;
        color: var(--color-text-tertiary);
        position: relative;
    }

    .milestone::before {
        content: "";
        position: absolute;
        top: -8px;
        left: 50%;
        width: 4px;
        height: 4px;
        background: var(--color-border);
        border-radius: 50%;
        transform: translateX(-50%);
    }

    .milestone.reached {
        color: var(--color-primary);
        font-weight: 600;
    }

    .milestone.reached::before {
        background: var(--color-primary);
        box-shadow: 0 0 5px var(--color-primary);
    }
</style>
