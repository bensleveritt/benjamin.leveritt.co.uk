<script lang="ts">
	import '../app.css';

	const { children } = $props();
</script>

<svelte:head>
	<title>Benjamin S. Leveritt</title>
</svelte:head>

<main>{@render children()}</main>
