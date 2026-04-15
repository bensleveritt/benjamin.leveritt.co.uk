import type { PageServerLoad, EntryGenerator } from './$types';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { loadFile } from '$lib/preprocessors/asciidoc';

const blogDir = join(process.cwd(), 'src', 'content', 'blog');

export const entries: EntryGenerator = () => {
	return readdirSync(blogDir)
		.filter((file) => file.endsWith('.adoc'))
		.map((file) => ({ slug: file.replace('.adoc', '') }));
};

export const load: PageServerLoad = ({ params }) => {
	const slug = params.slug;
	try {
		const file = join(blogDir, `${slug}.adoc`);
		const doc = loadFile(file);

		return {
			title: doc.getAttribute('title'),
			created: doc.getAttribute('created'),
			updated: doc.getAttribute('updated'),
			slug: file.replace('.adoc', ''),
			content: doc.getContent()
		};
	} catch (error) {
		console.error('Error reading note file:', error);
	}
};
