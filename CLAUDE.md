# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm check` - Type checking with svelte-check
- `pnpm check:watch` - Type checking in watch mode
- `pnpm test` - Run all tests once
- `pnpm test:unit` - Run tests in watch mode (vitest)
- `pnpm lint` - Run ESLint and Prettier checks
- `pnpm format` - Format code with Prettier

Use pnpm as the package manager (configured with packageManager field).

## Architecture

This is a SvelteKit-based personal website/blog that processes AsciiDoc content. Key architectural elements:

### Content System
- Blog posts: `src/content/blog/*.adoc` - AsciiDoc files with metadata
- Garden notes: `src/content/notes/*.asciidoc` - Digital garden style notes (served at `/garden`)
- Custom AsciiDoc preprocessor at `src/lib/preprocessors/asciidoc.js` handles conversion to HTML
- File-based routing with server-side loading of content metadata

### Key Files
- `svelte.config.js` - Includes custom AsciiDoc preprocessor, extends file extensions to `.asciidoc`
- `src/lib/preprocessors/asciidoc.js` - Core AsciiDoc to HTML conversion using asciidoctor.js
- `src/routes/blog/+page.server.ts` - Loads blog entries from filesystem with metadata extraction
- `src/routes/garden/+page.server.ts` - Similar pattern for garden notes

### Design Philosophy
Follows Swiss functional design principles (see `docs/design-philosophy.md`):
- Form follows function with mathematical precision
- Typography as information design 
- Minimal, content-focused approach
- Grid systems for predictable hierarchy

### Content Patterns
- AsciiDoc files use metadata attributes: `title`, `created`, `updated`
- Slugs are generated from filenames
- Server-side content loading for performance
- File extensions: `.adoc` for blog, `.asciidoc` for notes

When adding content features, prioritize content clarity over visual complexity, following the established Swiss design principles.

## Digital Garden Workflow

When the user says "tend the garden", "find me something to post", or similar:

1. **Discover**: Scan `~/org/roam/` for notes with real content (not stubs). Prioritise notes that are personally meaningful, interesting to others, and recently touched. Look for clusters of related notes.
2. **Suggest**: Present 3-5 candidates with a one-line reason each. Let the user pick.
3. **Draft**: Reshape the chosen org-mode note into an `.asciidoc` file in `src/content/notes/`. This is collaborative — not a mechanical conversion. Preserve the user's voice and keep it concise.
4. **Verify**: Build the site to confirm the note renders.

Notes should follow the existing format: `:title:`, `:created:` metadata, then AsciiDoc content. Filename becomes the slug.

The user's org-roam collection has ~1,800+ notes dating back to 2019, covering technology, design, note-taking, science, and personal interests. Strong clusters exist around knowledge management, the indie/open web, and design practice.