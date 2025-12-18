<script lang="ts">
	import "../app.css";
	import DarkModeToggle from "$lib/components/DarkModeToggle.svelte";
	import Toast from "$lib/components/Toast.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<title
		>Atomic Range Prediction - Simulasi Interaktif Jangkauan Bom Atom</title
	>
</svelte:head>

<DarkModeToggle />
<Toast />

{@render children()}
