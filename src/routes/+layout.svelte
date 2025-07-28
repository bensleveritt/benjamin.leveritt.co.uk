<script lang="ts">
	import '../app.css';

	const { children } = $props();
	import Page from '$lib/components/Page.svelte';
</script>

<svelte:head>
	<title>Benjamin S. Leveritt</title>
</svelte:head>

<Page>
	<header>
		<nav>
			<a href="/">Home</a>
			<a href="/portfolio">Portfolio</a>
			<a href="/notes">Notes</a>
		</nav>
	</header>
	{@render children()}
</Page>
