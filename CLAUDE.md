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
- Notes: `src/content/notes/*.asciidoc` - Digital garden style notes
- Custom AsciiDoc preprocessor at `src/lib/preprocessors/asciidoc.js` handles conversion to HTML
- File-based routing with server-side loading of content metadata

### Key Files
- `svelte.config.js` - Includes custom AsciiDoc preprocessor, extends file extensions to `.asciidoc`
- `src/lib/preprocessors/asciidoc.js` - Core AsciiDoc to HTML conversion using asciidoctor.js
- `src/routes/blog/+page.server.ts` - Loads blog entries from filesystem with metadata extraction
- `src/routes/notes/+page.server.ts` - Similar pattern for notes

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