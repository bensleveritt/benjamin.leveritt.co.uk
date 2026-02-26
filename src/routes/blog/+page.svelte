<script lang="ts">
	let { data } = $props();

	const sortedEntries = $derived(
		data.entries.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
	);
</script>

{#each sortedEntries as entry}
	<article>
		<h3><a href={`/blog/${entry.slug}`}>{entry.title}</a></h3>
	</article>
{:else}
	<p>Nothing here yet. Check back soon.</p>
{/each}
