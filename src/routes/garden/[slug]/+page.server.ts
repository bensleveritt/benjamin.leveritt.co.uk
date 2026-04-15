import type { PageServerLoad, EntryGenerator } from './$types';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { loadFile } from '$lib/preprocessors/asciidoc';

const notesDir = join(process.cwd(), 'src', 'content', 'notes');

export const entries: EntryGenerator = () => {
	return readdirSync(notesDir)
		.filter((file) => file.endsWith('.asciidoc'))
		.map((file) => ({ slug: file.replace('.asciidoc', '') }));
};

export const load: PageServerLoad = ({ params }) => {
	const slug = params.slug;
	try {
		const file = join(notesDir, `${slug}.asciidoc`);
		const doc = loadFile(file);

		return {
			content: doc.toString()
		};
	} catch (error) {
		console.error('Error reading note file:', error);
	}
};
