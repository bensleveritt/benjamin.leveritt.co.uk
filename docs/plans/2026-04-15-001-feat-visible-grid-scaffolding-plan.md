---
title: 'feat: Add visible grid scaffolding with functional marginalia'
type: feat
status: active
date: 2026-04-15
origin: docs/brainstorms/2026-04-15-visible-grid-scaffolding-requirements.md
---

# feat: Add visible grid scaffolding with functional marginalia

## Overview

Make the 12-column grid a visible, permanent design element and activate the empty right-side columns (10-12) with contextual marginalia. Grid lines express the mathematical structure honestly (brutalist). Sidenotes and metadata in the margins provide organic annotation (floral).

## Problem Frame

The site's Swiss asymmetric grid (content in columns 1-9, empty 10-12) is invisible to visitors. The empty right columns represent wasted structural potential. There is no mechanism for margin annotations or sidenotes, despite the grid already providing the space. (see origin: `docs/brainstorms/2026-04-15-visible-grid-scaffolding-requirements.md`)

## Requirements Trace

- R1. Faint vertical rules visible on the 12-column grid boundaries (desktop only)
- R2. Blog index shows `created`/`updated` dates in columns 10-12 alongside each entry
- R3. Garden index shows `created` date in columns 10-12 alongside each entry
- R4. AsciiDoc `[sidebar]` blocks render in columns 10-12 as margin sidenotes
- R5. Marginalia reflows inline when margins are too narrow (below ~1024px on desktop, below 768px on mobile)
- R6. No new CSS files — extend `grid.css` and `typography.css`
- R7. Overall effect reads as "structured and honest" not "busy and decorated"

## Scope Boundaries

- No JavaScript-based sidenote alignment
- No automatic margin content — all marginalia is explicitly authored or from metadata
- No changes to grid column ratios or max-width
- A marginalia reflow breakpoint (~1024px) is acceptable to ensure readability
- Growth-state indicators for garden notes are a separate future feature

## Context & Research

### Relevant Code and Patterns

- `src/grid.css` — 12-column grid with `.page > *` defaulting to `grid-column: 1 / 9`. Header/nav/footer at `1 / -1`. Mobile collapses to single column at 768px
- `src/typography.css` — Fraunces headings, Newsreader body. Fluid scale `--step--2` through `--step-5`. No existing sidenote or margin styles
- `src/lib/components/Page.svelte` — Wraps all content in `<div class="page">`
- `src/routes/blog/[slug]/+page.svelte` — AsciiDoc content inside `<article class="blog">`, making sidebar blocks non-direct children of `.page`
- `src/routes/garden/[slug]/+page.svelte` — Bare `{@html data.content}`, elements are direct `.page` children
- `src/routes/blog/+page.svelte` — Blog index renders title only; `created`/`updated` data is loaded but not displayed
- `src/routes/garden/+page.server.ts` — Garden loader does not extract `created` date

### Asciidoctor Sidebar Output

AsciiDoc `[sidebar]` blocks render as:

```html
<div class="sidebarblock">
	<div class="content">
		<p>Margin note text.</p>
	</div>
</div>
```

Currently used in one file: `src/content/notes/why-svelte.asciidoc`

## Key Technical Decisions

- **Subgrid chain for blog**: The blog `<main>` wrapper (from `+layout.svelte`) must get `grid-column: 1 / -1; display: grid; grid-template-columns: subgrid` to propagate the parent grid. Then `<article class="blog">` also gets subgrid. The `<h1>Blog</h1>` heading and back-link `<p>` inside `<main>` need explicit `grid-column: 1 / 9` placement. Subgrid has >95% browser support as of 2026
- **Grid lines via background gradient**: Use a CSS background pattern on `.page` (or `::before` pseudo-element) that creates thin vertical rules at column boundaries. The gradient must account for `repeat(12, 1fr)` with `gap: var(--grid-gap)`. A pseudo-element with `subgrid` may be cleanest for alignment accuracy
- **Column 9 as gutter**: Content spans 1-9, marginalia spans 10-13 (10 / -1). Column 9 already acts as a visual gutter due to the content ending there. No explicit gutter column needed
- **General descendant selector for `.sidebarblock`**: Use `.sidebarblock { grid-column: 10 / -1 }` as a general rule rather than child selectors. Asciidoctor wraps content in `.sect1 > .sectionbody` containers, so child selectors like `.blog > .sidebarblock` won't match. A general descendant rule avoids deep subgrid chains through intermediate wrappers
- **Garden detail needs wrapping**: Garden `[slug]/+page.svelte` currently uses bare `{@html}` — to get consistent sidebar behavior matching blog, wrap it in a container element that uses subgrid (or rely on `.page > .sidebarblock` direct child placement)
- **Date format**: Use short format (`15 Apr 2026`) for all margin dates. Compact enough for narrow columns, more readable than ISO format
- **Margin reflow**: Below ~1024px, margins become too narrow for readable text. Marginalia should reflow inline (appearing as footnote-style content after the relevant element) rather than being hidden

## Open Questions

### Resolved During Planning

- **Grid line colour**: Start with `rgba(0,0,0,0.06)` and tune visually. This is an implementation-time adjustment, not a planning decision
- **Multiple sidenotes at same position**: Stack vertically in the margin column. CSS Grid auto-placement handles this naturally when sidenotes are in the document flow
- **Subgrid vs absolute positioning**: Subgrid — it is the correct modern approach, avoids z-index and overflow issues, and degrades gracefully

### Deferred to Implementation

- **Exact gradient calculation**: The repeating-linear-gradient math for 12 columns + 11 gaps depends on testing the `calc()` expressions in-browser. May need a `::before` overlay with `subgrid` instead of a background on `.page` directly
- **Garden detail wrapper element**: Needs testing — if `{@html}` output elements are direct `.page` children, `.page > .sidebarblock` works without a wrapper. If Svelte adds intermediate nodes, a `<div>` wrapper with subgrid is needed

## Implementation Units

- [ ] **Unit 1: Grid line overlay**

  **Goal:** Add faint vertical rules to `.page` that make the 12-column grid visible on desktop.

  **Requirements:** R1, R6, R7

  **Dependencies:** None

  **Files:**

  - Modify: `src/grid.css`

  **Approach:**

  - Add a `::before` pseudo-element on `.page` that spans `grid-column: 1 / -1`, `grid-row: 1 / -1`
  - Use `position: relative` on `.page` and `position: absolute; inset: 0` on the pseudo for full coverage, or use grid placement to span all rows/columns
  - The pseudo-element needs to create 12 column-width regions with thin lines between them. Two approaches to evaluate: (a) `repeating-linear-gradient` with `calc()` based on column widths, or (b) give the pseudo its own `subgrid` and use nested `background-size` per column
  - `pointer-events: none` to prevent the overlay blocking interaction
  - Establish stacking context: `z-index: 0` on `.page`, `z-index: -1` on `::before` to ensure grid lines always render below all content children regardless of which children create their own stacking contexts
  - Hide at 768px breakpoint with `display: none` or `opacity: 0`
  - Colour: `rgba(0,0,0,0.06)` as starting point

  **Patterns to follow:**

  - Existing `.page` grid setup in `src/grid.css`
  - Existing 768px media query breakpoint pattern

  **Test scenarios:**

  - Test expectation: none — pure visual styling with no behavioral change. Verify visually in browser.

  **Verification:**

  - Faint vertical lines visible on desktop at 1200px and narrower widths
  - Lines disappear completely below 768px
  - Lines do not interfere with text selection or link clicks
  - Lines align with actual grid column boundaries (test by inspecting grid overlay in browser dev tools)

- [ ] **Unit 2: Marginalia typography**

  **Goal:** Define the typographic styles for margin content — dates, metadata, and sidenotes.

  **Requirements:** R6, R7

  **Dependencies:** None (can run parallel with Unit 1)

  **Files:**

  - Modify: `src/typography.css`

  **Approach:**

  - Add styles for a `.margin-note` class and `.sidebarblock` (asciidoctor's sidebar output class)
  - Font: Newsreader italic, weight 300, size `--step--1` or `--step--2`
  - Line-height: tighter than body (1.3-1.4) since margin text is auxiliary
  - Colour: `rgba(0,0,0,0.6)` or similar — present but not competing with main content
  - These styles apply to both index marginalia and in-content sidenotes

  **Patterns to follow:**

  - Existing type scale steps in `src/typography.css`
  - Newsreader font-family declaration already in use for body text

  **Test scenarios:**

  - Test expectation: none — pure styling. Verify visually that margin text is legible but clearly secondary to main content.

  **Verification:**

  - Margin text is visually distinct from body text (smaller, lighter, italic)
  - Text remains legible at the smallest supported viewport width where margins are visible (769px+)

- [ ] **Unit 3: Blog index marginalia**

  **Goal:** Display `created` and `updated` dates in the right margin columns alongside each blog entry on the blog index page.

  **Requirements:** R2, R5

  **Dependencies:** Unit 2 (typography styles)

  **Files:**

  - Modify: `src/routes/blog/+page.svelte`
  - Modify: `src/routes/blog/+layout.svelte`

  **Approach:**

  - Make `<main>` (from `+layout.svelte`) use `grid-column: 1 / -1; display: grid; grid-template-columns: subgrid` to propagate the parent 12-column grid. The `<h1>Blog</h1>` heading inside `<main>` needs explicit `grid-column: 1 / 9`
  - Each entry becomes a row with the title/link in columns 1-9 and the date in columns 10-13
  - Format dates as short format: `15 Apr 2026`. Show `updated` only when different from `created`
  - Below ~1024px: dates reflow inline below the entry title. Below 768px: single column layout
  - Add a `<time>` element with the `.margin-note` class for the date, placed as a sibling to the title element so both participate in the subgrid

  **Patterns to follow:**

  - Existing `<article>` pattern in blog index
  - No change to `src/routes/blog/+page.server.ts` is required — `created` and `updated` are already present in the loaded data

  **Test scenarios:**

  - Happy path: blog index shows date in right margin aligned with each entry title
  - Edge case: entry with no `updated` date shows only `created`
  - Edge case: entry with `updated` === `created` shows only one date
  - Edge case: entry with no `created` attribute — margin cell renders empty with no error, no broken layout
  - Reflow: dates appear inline below ~1024px and on mobile

  **Verification:**

  - Each blog entry on the index has its date visible in the right margin on desktop
  - Dates collapse inline on mobile without layout breakage
  - Build succeeds with prerendering

- [ ] **Unit 4: Garden index marginalia**

  **Goal:** Display `created` date in the right margin alongside each garden note on the garden index page.

  **Requirements:** R3, R5

  **Dependencies:** Unit 2 (typography styles)

  **Files:**

  - Modify: `src/routes/garden/+page.server.ts`
  - Modify: `src/routes/garden/+page.svelte`

  **Approach:**

  - The garden server loader currently returns only `title` and `slug`. Add `created` date extraction from the AsciiDoc document attributes (same pattern as blog loader)
  - Replace the `<ul>/<li>` list with a structure that allows grid placement — each entry needs a content area (cols 1-9) and a date area (cols 10-13)
  - Since garden index elements are direct `.page` children, they can use `grid-column` directly without subgrid
  - On mobile: dates appear inline

  **Patterns to follow:**

  - Blog index server loader's date extraction pattern (`doc.getAttribute('created')`)
  - Same marginalia typography from Unit 2

  **Test scenarios:**

  - Happy path: garden index shows date in right margin for each note
  - Edge case: note without a `created` attribute — render without a date, no error
  - Mobile: dates appear inline

  **Verification:**

  - Each garden note on the index has its date visible in the right margin on desktop
  - Notes missing dates still render correctly
  - Build succeeds with prerendering

- [ ] **Unit 5: Blog post sidenotes**

  **Goal:** Reposition AsciiDoc `[sidebar]` blocks in blog posts from inline to the right margin columns.

  **Requirements:** R4, R5

  **Dependencies:** Unit 2 (typography), Unit 3 (blog layout subgrid)

  **Files:**

  - Modify: `src/routes/blog/[slug]/+page.svelte`
  - Modify: `src/routes/blog/+layout.svelte` (coordinate with Unit 3 — may already have subgrid)
  - Modify: `src/grid.css`

  **Approach:**

  - `<main>` already has subgrid from Unit 3. Change `<article class="blog">` to `grid-column: 1 / -1; display: grid; grid-template-columns: subgrid`
  - Add `.blog > *` defaulting to `grid-column: 1 / 9` to preserve current content layout
  - Add a general `.sidebarblock { grid-column: 10 / -1 }` rule in `grid.css`. Use a descendant selector (not child) because asciidoctor nests sidebars inside `.sect1 > .sectionbody` wrappers
  - The back-link `<p>` and `<h1>Blog</h1>` inside `<main>` already have column placement from Unit 3
  - On mobile: `.sidebarblock` gets `grid-column: 1` and renders inline in the content flow
  - Verify by adding a temporary `[sidebar]` block to an existing blog `.adoc` file and checking it at the blog detail route. Do not rely on garden notes for blog-route verification — the templates and grid contexts differ

  **Patterns to follow:**

  - Existing `.page > *` column assignment pattern in `grid.css`
  - Asciidoctor's `.sidebarblock > .content` HTML structure

  **Test scenarios:**

  - Happy path: a `[sidebar]` block in a blog post appears in the right margin at the vertical position where it occurs in the document
  - Edge case: post with no sidebar blocks — no visual change, article still renders correctly
  - Edge case: multiple sidebar blocks in one post — each stacks in the margin column
  - Mobile: sidebar content appears inline in the content flow

  **Verification:**

  - A test sidebar added to a blog post appears in the right margin on the blog detail page
  - Article content (headings, paragraphs) remains in columns 1-9
  - Mobile layout shows sidebar inline

- [ ] **Unit 6: Garden note sidenotes**

  **Goal:** Ensure AsciiDoc `[sidebar]` blocks in garden notes also appear in the right margin.

  **Requirements:** R4, R5

  **Dependencies:** Unit 2 (typography), Unit 5 (sidebar CSS rules)

  **Files:**

  - Modify: `src/routes/garden/[slug]/+page.svelte`
  - Possibly modify: `src/grid.css`

  **Approach:**

  - **Prerequisite fix:** `src/routes/garden/[slug]/+page.server.ts` uses `doc.toString()` which may return a debug string rather than HTML. Change to `doc.convert()` (with title) or `doc.getContent()` (body only, matching blog pattern) before proceeding with sidebar work
  - Garden detail currently uses bare `{@html data.content}` — test whether the generated elements are direct `.page` children
  - If they are: the `.sidebarblock` rule from Unit 5 (`.page > .sidebarblock` or a general `.sidebarblock` rule in `grid.css`) may already work
  - If they are not (Svelte adds wrapper nodes): wrap `{@html}` in an element like `<article class="garden">` and apply the same subgrid pattern as blog
  - Mobile: same inline collapse as blog sidenotes

  **Patterns to follow:**

  - Blog detail subgrid pattern from Unit 5
  - Existing garden detail page structure

  **Test scenarios:**

  - Happy path: the existing sidebar in `why-svelte.asciidoc` appears in the right margin
  - Edge case: garden note with no sidebar — no visual change
  - Mobile: sidebar appears inline

  **Verification:**

  - Navigate to `/garden/why-svelte` and confirm the sidebar is in the right margin
  - Other garden notes without sidebars render normally

## System-Wide Impact

- **Interaction graph:** Grid line overlay uses `pointer-events: none` so no interaction changes. Subgrid on `<article>` may affect how child elements inherit grid placement — verify no unexpected elements jump to wrong columns
- **Error propagation:** Minimal — all changes are CSS/template. A missing `created` attribute in garden notes should render gracefully (empty margin, no error)
- **State lifecycle risks:** None — static prerendered site
- **API surface parity:** The same `.sidebarblock` margin styling should work identically in blog and garden contexts
- **Integration coverage:** The subgrid approach on `<article class="blog">` changes the grid participation of ALL child elements, not just sidebars. Every element type that asciidoctor generates (paragraphs, headings, lists, code blocks, admonitions, images) must still render correctly within the subgrid
- **Unchanged invariants:** The grid's 12-column structure, gap size, max-width, and responsive breakpoint are not changing. Content still defaults to columns 1-9. The nav and footer still span full width

## Risks & Dependencies

| Risk                                                                                                                          | Mitigation                                                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Subgrid on `<article>` causes unexpected layout shifts for non-sidebar child elements (e.g., code blocks, lists, blockquotes) | Test with the existing blog posts which use varied AsciiDoc elements. The `> *` default rule should catch all children   |
| Grid line gradient math doesn't align perfectly with actual grid columns                                                      | Use browser dev tools grid overlay to compare. Fall back to a `::before` with subgrid if gradient approach is unreliable |
| Garden `{@html}` output may not produce direct `.page` children due to Svelte fragment handling                               | Test first; wrap in `<article class="garden">` with subgrid if needed                                                    |
| Margin columns too narrow for readable text at smaller desktop viewports (769-1024px)                                         | Marginalia reflows inline below ~1024px, appearing as footnote-style content rather than being hidden                    |

## Sources & References

- **Origin document:** [docs/brainstorms/2026-04-15-visible-grid-scaffolding-requirements.md](docs/brainstorms/2026-04-15-visible-grid-scaffolding-requirements.md)
- **Ideation context:** [docs/ideation/2026-04-15-floral-brutalism-ideation.md](docs/ideation/2026-04-15-floral-brutalism-ideation.md) (idea #5)
- Related code: `src/grid.css`, `src/typography.css`
- Design philosophy: `docs/design-philosophy.md`
