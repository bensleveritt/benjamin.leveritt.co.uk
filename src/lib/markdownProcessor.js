import matter from 'gray-matter';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

/** Parse the markdown content to HTML */
async function parseMarkdown(content) {
	const processor = await unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkRehype)
		.use(rehypeSanitize)
		.use(rehypeStringify)
		.process(content);
	return processor.toString();
}

/** Get the frontmatter and the markdown content */
function frontmatter(content) {
	const { content: markdown, data } = matter(content);
	const meta = `<script context="module">export const metadata = ${JSON.stringify(data)}</script>`;

	return { markdown, meta };
}

function markdownProcessor() {
	return {
		async markup({ content, filename }) {
			if (filename.endsWith('.svx')) {
				const { markdown, meta } = frontmatter(content);
				const html = await parseMarkdown(markdown);
				return { code: meta + html };
			}
		}
	};
}

export default markdownProcessor;
