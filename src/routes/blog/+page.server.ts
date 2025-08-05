import type { PageServerLoad } from './$types';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { loadFile } from '$lib/preprocessors/asciidoc';

export const load: PageServerLoad = () => {
	const blogDir = join(process.cwd(), 'src', 'content', 'blog');
	let entries: any[] = [];

	try {
		const files = readdirSync(blogDir);

		entries = files
			.filter((file) => file.endsWith('.adoc'))
			.map((file) => {
				const filePath = join(blogDir, file);
				const doc = loadFile(filePath);

				// Extract title from AsciiDoc metadata
				const title = doc.getAttribute('title');

				// Create slug from filename
				const slug = file.replace('.adoc', '');

				return {
					title,
					created: doc.getAttribute('created'),
					updated: doc.getAttribute('updated'),
					slug,
					content: doc.getContent()
				};
			});
	} catch (error) {
		console.error('Error reading blog directory:', error);
	}

	return {
		entries
	};
};
