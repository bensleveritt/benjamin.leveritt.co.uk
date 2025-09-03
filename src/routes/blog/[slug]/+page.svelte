<script lang="ts">
	let { data } = $props();
</script>

<p><a href="/blog">&larr; Back to blog</a></p>
<article class="blog">
	<h1>{data.title}</h1>
	<p>
		<em
			>Created: {new Date(data.created).toLocaleDateString()}
			{#if data.updated && data.updated !== data.created}
				• Updated: {new Date(data.updated).toLocaleDateString()}
			{/if}
		</em>
	</p>
	{@html data.content}
</article>
