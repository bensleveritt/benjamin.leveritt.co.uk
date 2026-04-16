import type { PageServerLoad } from './$types';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadFile } from '$lib/preprocessors/asciidoc';

export const load: PageServerLoad = () => {
	const notesDir = join(process.cwd(), 'src', 'content', 'notes');
	let entries: any[] = [];

	try {
		const files = readdirSync(notesDir);

		entries = files
			.filter((file) => file.endsWith('.asciidoc'))
			.map((file) => {
				const filePath = join(notesDir, file);
				const doc = loadFile(filePath);

				// Extract title from AsciiDoc metadata
				const title = doc.getAttribute('title');

				// Create slug from filename
				const slug = file.replace('.asciidoc', '');

				return {
					title,
					slug,
					created: doc.getAttribute('created')
				};
			});
	} catch (error) {
		console.error('Error reading notes directory:', error);
	}

	return {
		entries
	};
};
