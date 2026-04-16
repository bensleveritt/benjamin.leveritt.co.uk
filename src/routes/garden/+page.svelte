<script lang="ts">
	let { data } = $props();

	const sortedEntries = $derived(
		data.entries.sort((a, b) => (b.created ?? '').localeCompare(a.created ?? ''))
	);
</script>

<h2>Garden</h2>

<p>Notes I'm thinking about. Some are rough, some are nearly there. None of them are finished — that's the point.</p>

{#each sortedEntries as entry}
	<a class="listing-title" href={`/garden/${entry.slug}`}>{entry.title}</a>
	{#if entry.created}
		<time class="margin-note" datetime={entry.created}>{entry.created}</time>
	{/if}
{/each}
