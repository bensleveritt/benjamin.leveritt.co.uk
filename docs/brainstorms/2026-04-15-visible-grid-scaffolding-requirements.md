---
date: 2026-04-15
topic: visible-grid-scaffolding
origin: docs/ideation/2026-04-15-floral-brutalism-ideation.md#5
---

# Visible Grid Scaffolding

Make the 12-column grid a visible, permanent design element. The structure becomes the ornament. The empty right-side columns come alive with contextual marginalia.

## Goals

1. Express the grid system honestly -- faint vertical rules that say "this is a designed object on a mathematical structure"
2. Activate the empty columns (10-12) with meaningful marginalia
3. Reinforce the floral brutalism aesthetic: rigid structure (brutal) that supports organic annotation (floral)

## Requirements

### Grid Lines

- Faint vertical rules marking the 12 column boundaries on `.page`
- Implemented via `repeating-linear-gradient` or pseudo-element on the page container
- Colour: ~`rgba(0,0,0,0.06)` -- visible but never competing with content
- Lines disappear below 768px breakpoint (where the grid collapses to single column)
- Lines span the full height of the page content, not the viewport

### Index Page Marginalia

On blog and garden list pages, metadata sits in columns 10-12 aligned with each entry:

- **Blog index**: `created` date, `updated` date (if different)
- **Garden index**: `created` date, growth status indicator (seedling/growing/evergreen if the status field exists)
- Metadata styled in Newsreader at a smaller step (--step--1 or --step--2), lighter weight

### Sidenotes in Posts and Notes

Within individual blog posts and garden notes, margin annotations appear in columns 10-12:

- **Authoring**: Use AsciiDoc `[sidebar]` blocks (already valid AsciiDoc syntax, already rendered as `<div class="sidebarblock">` by asciidoctor.js)
- **Positioning**: CSS repositions `.sidebarblock` to grid columns 10-12, vertically aligned with the paragraph they follow
- **Typography**: Newsreader italic, lighter weight (200-300), smaller size (--step--1)
- **Mobile**: Sidenotes collapse inline below the paragraph they annotate, with a subtle visual separator
- **No preprocessor changes required** -- purely a CSS concern

### Non-Goals

- Sidenotes do not need JavaScript-based alignment (CSS grid placement is sufficient)
- No automatic margin content -- all marginalia is explicitly authored
- No changes to the grid's column ratios or max-width

## Design Constraints

- Extend `src/grid.css` for grid lines and margin column rules
- Extend `src/typography.css` for marginalia type styles
- No new CSS files (per AGENTS.md)
- Must degrade gracefully on mobile (single column, no grid lines, inline sidenotes)

## Success Criteria

- Grid lines are visible on desktop at normal zoom
- A `[sidebar]` block in an AsciiDoc note appears in the right margin on desktop
- The same sidebar collapses inline on mobile without layout breakage
- Blog/garden index pages show dates in the margin columns
- The overall effect reads as "structured and honest" not "busy and decorated"

## Open Questions

- Exact grid line colour/opacity will need visual tuning in-browser
- Should grid lines extend into the page padding/margin, or only within the grid container?
- How should multiple sidenotes on the same vertical position be handled? (Stack vertically is the likely answer)
