<script lang="ts">
	import Hr from '$lib/components/Hr.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div>
	<h1>Benjamin S. Leveritt</h1>
</div>

<h2>{@html data.subtitle}</h2>
<!-- This is actually a random list of sentences about me -->

<Hr />

<!-- <h3>Featured Projects</h3>

<a href="/portfolio">For more projects, visit my portfolio</a> -->
