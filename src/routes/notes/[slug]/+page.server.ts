import type { PageServerLoad } from './$types';
import { join } from 'node:path';
import { loadFile } from '$lib/preprocessors/asciidoc';

export const load: PageServerLoad = ({ params }) => {
	const notesDir = join(process.cwd(), 'src', 'content', 'notes');
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
