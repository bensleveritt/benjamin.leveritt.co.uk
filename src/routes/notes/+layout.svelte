<script lang="ts">
	const { children } = $props();
	import Page from '$lib/components/Page.svelte';
</script>

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
