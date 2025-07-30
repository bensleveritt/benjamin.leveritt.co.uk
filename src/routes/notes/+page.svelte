<script lang="ts">
	let { data } = $props();
</script>

<h1>Notes</h1>

<p>There are {data.entries.length} notes.</p>

<ul>
	{#each data.entries as entry}
		<li><a href={`/notes/${entry.slug}`}>{entry.title}</a></li>
	{/each}
</ul>
