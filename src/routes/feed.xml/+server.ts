import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { loadFile } from '#lib/preprocessors/asciidoc.js';

export const prerender = true;

export function GET() {
	const notesDir = join(process.cwd(), 'src', 'content', 'notes');
	const entries: { title: string; slug: string; created: string; updated: string }[] = [];

	try {
		const files = readdirSync(notesDir);

		for (const file of files) {
			if (!file.endsWith('.asciidoc')) continue;
			const doc = loadFile(join(notesDir, file));
			const title = doc.getAttribute('title');
			const created = doc.getAttribute('created');
			if (!title || !created) continue;

			entries.push({
				title,
				slug: file.replace('.asciidoc', ''),
				created,
				updated: doc.getAttribute('updated') ?? created
			});
		}
	} catch (error) {
		console.error('Error reading notes for feed:', error);
	}

	entries.sort((a, b) => b.created.localeCompare(a.created));

	const siteUrl = 'https://benjamin.leveritt.co.uk';

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Benjamin S. Leveritt</title>
		<link>${siteUrl}</link>
		<description>Notes from the garden</description>
		<atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
		<language>en-gb</language>
${entries
	.map(
		(entry) => `		<item>
			<title>${escapeXml(entry.title)}</title>
			<link>${siteUrl}/garden/${entry.slug}</link>
			<guid>${siteUrl}/garden/${entry.slug}</guid>
			<pubDate>${new Date(entry.created).toUTCString()}</pubDate>
		</item>`
	)
	.join('\n')}
	</channel>
</rss>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8'
		}
	});
}

// Asciidoctor already escapes &, < and > in attribute values, so leave existing entities alone.
function escapeXml(str: string): string {
	return str
		.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}
