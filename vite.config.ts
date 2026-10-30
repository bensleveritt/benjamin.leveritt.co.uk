import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import asciidoc from './src/lib/preprocessors/asciidoc.js';

export default defineConfig({
	plugins: [
		sveltekit({
			// Consult https://svelte.dev/docs/kit/integrations#preprocessors
			// for more information about preprocessors
			preprocess: [vitePreprocess(), asciidoc()],

			// No options: on Vercel, adapter-static detects the build and writes the
			// Build Output API directory itself. Elsewhere it writes to build/.
			adapter: adapter(),

			extensions: ['.svelte', '.svx', '.asciidoc']
		})
	],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
