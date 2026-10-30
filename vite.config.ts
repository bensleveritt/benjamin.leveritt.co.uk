import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import asciidoc from './src/lib/preprocessors/asciidoc.js';

export default defineConfig({
	plugins: [
		sveltekit({
			// Consult https://svelte.dev/docs/kit/integrations#preprocessors
			// for more information about preprocessors
			preprocess: [vitePreprocess(), asciidoc()],

			// Pin the function runtime to the Node version Vercel builds with.
			adapter: adapter({ runtime: 'nodejs26.x' }),

			extensions: ['.svelte', '.svx', '.asciidoc']
		})
	],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
