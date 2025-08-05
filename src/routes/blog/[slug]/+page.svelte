<script lang="ts">
	let { data } = $props();
</script>

<p><a href="/blog">Back to blog</a></p>
<article>
	<h3>{data.title}</h3>
	<p>
		Created: {new Date(data.created).toLocaleDateString()}
		{#if data.updated && data.updated !== data.created}
			| Updated: {new Date(data.updated).toLocaleDateString()}
		{/if}
	</p>
	{@html data.content}
</article>
