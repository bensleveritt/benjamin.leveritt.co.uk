<script lang="ts">
	let { data } = $props();

	const sortedEntries = $derived(
		data.entries.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
	);

</script>

{#each sortedEntries as entry}
	<a class="listing-title" href={`/blog/${entry.slug}`}>{entry.title}</a>
	{#if entry.created}
		<time class="margin-note" datetime={entry.created}>{entry.created}</time>
	{/if}
{:else}
	<p>Nothing here yet. Check back soon.</p>
{/each}
