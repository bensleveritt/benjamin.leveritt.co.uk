import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import asciidoc from './src/lib/preprocessors/asciidoc.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess(), asciidoc()],

	kit: {
		// Pin the function runtime: adapter-vercel 6.x only infers it on Node 20, 22 or 24,
		// and Vercel builds with a newer Node.
		adapter: adapter({ runtime: 'nodejs24.x' })
	},

	extensions: ['.svelte', '.svx', '.asciidoc']
};

export default config;
