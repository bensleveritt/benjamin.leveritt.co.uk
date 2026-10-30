<script lang="ts">
	let { data } = $props();

	// The page is rendered at build time, so fix the locale and time zone. Without them
	// the date takes the build machine's format, and a date-only value can shift a day.
	const formatDate = (date: string) =>
		new Date(date).toLocaleDateString('en-GB', { timeZone: 'UTC' });
</script>

<p><a href="/blog">&larr; Back to blog</a></p>
<article class="blog">
	<h1>{data.title}</h1>
	<p>
		<em
			>Created: {formatDate(data.created)}
			{#if data.updated && data.updated !== data.created}
				• Updated: {formatDate(data.updated)}
			{/if}
		</em>
	</p>
	{@html data.content}
</article>
