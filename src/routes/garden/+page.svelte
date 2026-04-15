<script lang="ts">
	let { data } = $props();
</script>

<h2>Garden</h2>

<p>There are {data.entries.length} notes.</p>

<ul>
	{#each data.entries as entry}
		<li><a href={`/garden/${entry.slug}`}>{entry.title}</a></li>
	{/each}
</ul>
