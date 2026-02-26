# AGENTS.md

Guidelines for AI coding agents working in this repository.

## Quick Reference

| Task                 | Command                                      |
| -------------------- | -------------------------------------------- |
| Install dependencies | `pnpm install`                               |
| Dev server           | `pnpm dev`                                   |
| Production build     | `pnpm build`                                 |
| Preview build        | `pnpm preview`                               |
| Type check           | `pnpm check`                                 |
| Run all tests        | `pnpm test`                                  |
| Run single test      | `pnpm test:unit -- src/path/to/file.spec.ts` |
| Run tests (watch)    | `pnpm test:unit`                             |
| Lint                 | `pnpm lint`                                  |
| Format               | `pnpm format`                                |

**Package manager**: pnpm (v10.11.0) — do NOT use npm or yarn.

## Project Overview

SvelteKit personal website with AsciiDoc content processing. Follows Swiss functional design principles. Svelte 5 runes. Fluid typography (Utopia) + 12-column grid.

### Structure

```
src/
├── content/
│   ├── blog/*.adoc           # Blog posts (AsciiDoc)
│   └── notes/*.asciidoc      # Digital garden notes
├── lib/
│   ├── components/           # Page.svelte (grid wrapper), Hr.svelte
│   └── preprocessors/        # asciidoc.js — html(), loadFile(), SvelteKit preprocessor
├── routes/
│   ├── +layout.svelte        # Root layout: nav + Page wrapper
│   ├── blog/                 # Blog index + [slug] detail
│   ├── notes/                # Notes index + [slug] detail
│   ├── about/                # Static about page
│   └── portfolio/            # Stub — commented out in nav
├── app.css                   # Imports grid.css + typography.css
├── grid.css                  # 12-column grid, Swiss asymmetry (cols 1-9)
└── typography.css            # Fluid type scale (Utopia), Fraunces + Newsreader
docs/
└── design-philosophy.md      # Swiss functional design decision framework
static/
└── fonts/                    # WOFF2 variable fonts (4 files, ~716KB total)
```

### Where to Look

| Task | Location | Notes |
| --- | --- | --- |
| Add blog post | `src/content/blog/{slug}.adoc` | Must use `.adoc` extension |
| Add note | `src/content/notes/{slug}.asciidoc` | Must use `.asciidoc` extension |
| Modify content loading | `src/lib/preprocessors/asciidoc.js` | `loadFile()` returns Asciidoctor document object |
| Content metadata format | Top of `.adoc`/`.asciidoc` files | `:title:`, `:created:`, `:updated:` attributes |
| Grid layout / spacing | `src/grid.css` | `--grid-gap`, `--grid-max`, `--content-margin` |
| Typography / font scale | `src/typography.css` | `--step--2` through `--step-5` (Utopia clamp) |
| Global styles entry | `src/app.css` | Imports grid.css + typography.css only |
| Add reusable component | `src/lib/components/` | Keep minimal — only if reused 2+ times |
| Design reference | `docs/design-philosophy.md` | Decision framework for new features |

### Content System

Blog and notes use AsciiDoc with metadata attributes:

```asciidoc
:title: Post Title
:created: 2025-01-01
:updated: 2025-01-15

Content starts here...
```

- Blog posts: `.adoc` extension → loader uses `doc.getContent()` (body HTML only)
- Notes: `.asciidoc` extension → loader uses `doc.toString()` (full document HTML)
- Slugs derived from filenames (strip extension)
- Server-side loading via `loadFile()` from asciidoctor.js
- Blog extracts: title, created, updated, content. Notes extracts: title only.
- No HTML sanitization — content rendered with `{@html}` (trusted source)

## Code Style

### Formatting (Prettier)

- **Tabs** for indentation (not spaces)
- **Single quotes** for strings
- **No trailing commas**
- **100 character** line width
- Enforced via `pnpm format` and `pnpm lint`

### TypeScript

- Strict mode enabled
- Use explicit types for function parameters and return values
- Import types from `$types` for SvelteKit load functions:

```typescript
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	// ...
};
```

### Svelte 5 Patterns

This project uses **Svelte 5 with runes**. Follow these patterns:

```svelte
<script lang="ts">
	// Props - use $props() rune
	const { children } = $props();
	let { data } = $props();

	// Derived state - use $derived() rune
	const sorted = $derived(items.sort((a, b) => b.date - a.date));
</script>

<!-- Render children with {@render} -->
{@render children()}

<!-- Raw HTML -->
{@html content}
```

**DO NOT** use legacy Svelte 4 patterns:

- `export let prop`
- `$:` reactive statements
- `<slot />`

### Imports

Order imports as follows:

1. SvelteKit/Svelte imports
2. External packages
3. Internal `$lib` imports
4. Relative imports
5. Type imports (can be inline with `type` keyword)

```typescript
import type { PageServerLoad } from './$types';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { loadFile } from '$lib/preprocessors/asciidoc';
```

Use `$lib` alias for library imports, not relative paths from routes.

### Naming Conventions

| Type               | Convention             | Example                           |
| ------------------ | ---------------------- | --------------------------------- |
| Files (components) | PascalCase             | `Page.svelte`                     |
| Files (routes)     | SvelteKit convention   | `+page.svelte`, `+page.server.ts` |
| Files (content)    | kebab-case             | `how-ai-can-help.adoc`            |
| Variables          | camelCase              | `blogDir`, `sortedEntries`        |
| Types/Interfaces   | PascalCase             | `PageServerLoad`                  |
| CSS classes        | kebab-case             | `.page`, `.blog`                  |
| CSS variables      | kebab-case with prefix | `--step-0`, `--grid-gap`          |

### Error Handling

Wrap file system operations in try/catch:

```typescript
try {
	const files = readdirSync(dir);
	// process files
} catch (error) {
	console.error('Error reading directory:', error);
}
```

### CSS Architecture

- **Grid**: 12-column system in `grid.css` — content defaults to cols 1-9 (Swiss asymmetry)
- **Typography**: Fluid scale via `clamp()` — `--step-0` (18-20px body) through `--step-5` (45-84px h1)
- **Fonts**: Fraunces (headings, variable weight 100-900), Newsreader (body, variable weight 200-800)
- Grid classes: `.page` (grid container), `.wide` (cols 2-12), `.narrow` (cols 4-10)
- Responsive: Single column below 768px, no other breakpoints
- `font-display: swap` on all fonts — text renders immediately in system font

```css
/* Use existing CSS variables */
font-size: var(--step-0);
gap: var(--grid-gap);
max-width: var(--grid-max);
```

### Component Patterns

Components are minimal. Example structure:

```svelte
<script lang="ts">
	const { children } = $props();
</script>

<div class="page">
	{@render children()}
</div>
```

Scoped styles go in `<style>` blocks. Global styles in `src/*.css`.

## Anti-Patterns (This Project)

- **No `as any` / `@ts-ignore`** — fix types properly
- **No utility CSS frameworks** — use the existing grid + typography system
- **No new font dependencies** — use Fraunces (headings) and Newsreader (body)
- **No component libraries** — build minimal components; prefer semantic HTML + CSS
- **No decoration for its own sake** — every element must serve the reader
- **No Svelte 4 patterns** — `export let`, `$:`, `<slot />` are forbidden
- **No relative imports from routes** — use `$lib` alias
- **No new CSS files** — extend `grid.css` or `typography.css`, or use scoped `<style>`

## Design Philosophy

Follow Swiss functional design (see `docs/design-philosophy.md`):

1. **Form follows function** — no decoration for its own sake
2. **Typography as information design** — hierarchy serves comprehension
3. **Content-first** — technology serves the reader
4. **Minimal complexity** — simplest solution that works

When adding features, ask:

- Does this serve the reader or just look impressive?
- Is this the simplest solution?
- Would removing this improve the experience?

## Testing

Tests use **Vitest**. Place test files alongside source with `.spec.ts` or `.test.ts` extension.

```typescript
import { describe, it, expect } from 'vitest';

describe('feature', () => {
	it('does something', () => {
		expect(true).toBe(true);
	});
});
```

Run a single test file:

```bash
pnpm test:unit -- src/demo.spec.ts
```

## Before Committing

1. Run `pnpm check` — ensure no TypeScript errors
2. Run `pnpm lint` — ensure code style compliance
3. Run `pnpm test` — ensure tests pass
4. Run `pnpm build` — ensure production build succeeds

## Known Issues & Gotchas

- `src/routes/+page.svelte` uses Svelte 4 `export let data` — should use `let { data } = $props()`
- `src/routes/notes/+page.server.ts` has a stray `console.log(title)` call
- `src/content/notes/20250731-writing-to-learn.adoc` uses `.adoc` extension but the notes loader filters for `.asciidoc` — this file is invisible to the notes index
- `Hr.svelte` references `--spacing-large` CSS variable which is not defined anywhere in the CSS
- Portfolio route (`/portfolio`) and Notes route (`/notes`) are commented out in navigation
- Blog and notes loaders duplicate file-reading logic — no shared utility exists
- Loaders return `any[]` — no type-safe content schema defined
- No CI/CD pipeline (no `.github/workflows`)
- `.editorconfig` specifies 2-space indent but Prettier uses tabs — Prettier takes precedence
