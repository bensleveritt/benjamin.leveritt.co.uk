<script lang="ts">
	import '../app.css';

	const { children } = $props();
	import Page from '#lib/components/Page.svelte';
</script>

<svelte:head>
	<title>Benjamin S. Leveritt</title>
	<link rel="alternate" type="application/rss+xml" title="Benjamin S. Leveritt" href="/feed.xml" />
</svelte:head>

<div class="plate">
	<!-- Specimen: Monstera deliciosa, Atkinson-dithered by scripts/dither.mjs -->
	<div class="specimen" aria-hidden="true"></div>

	<Page>
		<header>
			<nav>
				<a href="/">Home</a>
				<!-- <a href="/portfolio">Portfolio</a> -->
				<a href="/garden">Garden</a>
				<a href="/blog">Blog</a>
				<a href="/about">About</a>
			</nav>
		</header>
		{@render children()}
	</Page>
</div>

<style>
	/* The plate is the page sheet: the specimen is printed on it and scrolls with it.
	   It clips the specimen, so the leaf never adds width or height to the document. */
	.plate {
		--specimen-ink: rgb(38 98 56);

		position: relative;
		isolation: isolate;
		box-sizing: border-box;
		min-height: 100svh;
		overflow: clip;
	}

	/* The 1-bit dither is a mask; the ink colour fills it at full strength, and the dot
	   density gives the tone. Its left edge sits on the start of the margin columns
	   (10-12) of the centred grid. */
	.specimen {
		position: absolute;
		inset: 0;
		z-index: -1;
		pointer-events: none;
		background-color: var(--specimen-ink);
		-webkit-mask: url('/monstera.png') no-repeat left calc(50vw + 12rem) top 3rem / auto
			min(92svh, 60rem);
		mask: url('/monstera.png') no-repeat left calc(50vw + 12rem) top 3rem / auto min(92svh, 60rem);
	}

	/* On phones the text runs the full width, so the leaf becomes a tailpiece: the
	   plate keeps room for it after the content, and no text sits on full-strength ink. */
	@media (max-width: 480px) {
		.plate {
			padding-bottom: 80vw;
		}

		.specimen {
			-webkit-mask-position: right -30vw bottom -45vw;
			mask-position: right -30vw bottom -45vw;
			-webkit-mask-size: 100vw auto;
			mask-size: 100vw auto;
		}
	}

	@media print {
		.specimen {
			display: none;
		}
	}
</style>
