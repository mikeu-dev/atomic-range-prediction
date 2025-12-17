<script lang="ts">
	import { isDarkMode } from '$lib/stores/appStore';

	function toggleDarkMode() {
		isDarkMode.update((v) => !v);
	}
</script>

<button
	class="dark-mode-toggle"
	on:click={toggleDarkMode}
	aria-label="Toggle dark mode"
	title={$isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
>
	<div class="icon-wrapper">
		{#if $isDarkMode}
			<!-- Moon Icon -->
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
			>
				<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
			</svg>
		{:else}
			<!-- Sun Icon -->
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
			>
				<circle cx="12" cy="12" r="5"></circle>
				<line x1="12" y1="1" x2="12" y2="3"></line>
				<line x1="12" y1="21" x2="12" y2="23"></line>
				<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
				<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
				<line x1="1" y1="12" x2="3" y2="12"></line>
				<line x1="21" y1="12" x2="23" y2="12"></line>
				<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
				<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
			</svg>
		{/if}
	</div>
</button>

<style>
	.dark-mode-toggle {
		position: fixed;
		top: var(--space-lg);
		right: var(--space-lg);
		z-index: 1000;
		
		width: 48px;
		height: 48px;
		border-radius: var(--radius-full);
		border: 1px solid var(--color-border);
		background: var(--glass-bg);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		
		transition: all var(--transition-base);
		box-shadow: var(--shadow-md);
	}

	.dark-mode-toggle:hover {
		transform: scale(1.05);
		box-shadow: var(--shadow-lg);
		border-color: var(--color-primary);
	}

	.dark-mode-toggle:active {
		transform: scale(0.95);
	}

	.icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-primary);
		transition: transform var(--transition-base);
	}

	.dark-mode-toggle:hover .icon-wrapper {
		transform: rotate(20deg);
	}

	svg {
		width: 20px;
		height: 20px;
	}
</style>
