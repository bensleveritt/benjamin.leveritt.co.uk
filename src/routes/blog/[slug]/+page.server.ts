import type { PageServerLoad } from './$types';
import { join } from 'node:path';
import { loadFile } from '$lib/preprocessors/asciidoc';

export const load: PageServerLoad = ({ params }) => {
	const blogDir = join(process.cwd(), 'src', 'content', 'blog');
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
