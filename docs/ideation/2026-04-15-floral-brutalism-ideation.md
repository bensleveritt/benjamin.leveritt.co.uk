---
date: 2026-04-15
topic: floral-brutalism
focus: Expand the floral brutalism aesthetic beyond Fraunces font
---

# Ideation: Floral Brutalism Expansion

## Codebase Context

- **Fonts**: Fraunces (headings, variable: weight 100-900, WONK, SOFT, opsz axes), Newsreader (body)
- **Palette**: Pure black (#000) on white (#fff), no accent colors
- **Grid**: 12-column Swiss asymmetric (content cols 1-9, cols 10-12 empty whitespace)
- **Brutalist signals present**: Stark B&W, no decoration, typography-as-design, functional grid
- **Floral signals present**: Fraunces' organic serifs, italic h1/h3, optical sizing
- **Constraints**: No new fonts, no utility frameworks, no component libraries, extend existing CSS files
- **Underexploited**: Fraunces' WONK and SOFT axes, colour, the empty grid columns, the tension between organic type and rigid structure

## Ranked Ideas

### 1. WONK Axis as Floral Accent

**Description:** Activate Fraunces' WONK axis (0-1) selectively on drop caps, pull quotes, or opening letters. The wonky alternates have exaggerated organic curves — used sparingly against WONK=0 defaults, these become floral punctuation.
**Rationale:** Maximum aesthetic impact from a font already loaded. Zero new dependencies.
**Downsides:** Subtle; WONK axis is binary (0 or 1), not a smooth spectrum.
**Confidence:** 90%
**Complexity:** Low
**Status:** Unexplored

### 2. Display Scale Drop Caps

**Description:** Massive Fraunces drop cap at blog post starts — WONK=1, italic, weight 900 — spanning 4-5 lines. Body text wraps around it like ivy on concrete. One controlled moment of decorative excess.
**Rationale:** The single strongest floral brutalism gesture. An ownable visual signature.
**Downsides:** Not all letters look great oversized. Careful float/grid interaction needed.
**Confidence:** 85%
**Complexity:** Medium
**Status:** Unexplored

### 3. Single Accent: Dried Blood Rose

**Description:** One deep desaturated crimson (e.g. #8B2500) used only for interactive states — hover, active, focus. Never appears at rest. Color as event, not decoration.
**Rationale:** One color with extreme restraint creates more impact than a palette. Beauty revealed by pressure.
**Downsides:** Exact hue matters; could feel jarring if too saturated.
**Confidence:** 85%
**Complexity:** Low
**Status:** Unexplored

### 4. Text Selection as Color Moment

**Description:** Override ::selection with a vivid botanical color. The site is monochrome until the reader selects text, revealing colour. The reader creates the floral moment.
**Rationale:** Near-zero effort, genuinely surprising, philosophically perfect.
**Downsides:** Only visible when selecting text.
**Confidence:** 80%
**Complexity:** Low
**Status:** Unexplored

### 5. Visible Grid Scaffolding

**Description:** Render the 12-column grid as faint persistent vertical rules. The empty columns become visibly, intentionally empty. Optionally pull metadata into the margins.
**Rationale:** Honest expression of structure — the grid becomes the trellis for floral typography. This is what brutalism actually means.
**Downsides:** Needs to disappear on mobile. Very thin lines required.
**Confidence:** 80%
**Complexity:** Low
**Status:** Explored (brainstorm 2026-04-15)

### 6. Paper Grain Texture

**Description:** SVG feTurbulence noise filter on the page background simulating uncoated cotton paper. Barely visible, but gives the page physicality.
**Rationale:** Fastest way to make a monochrome site feel material and alive.
**Downsides:** Performance on lower-end devices; could look like compression artifacts.
**Confidence:** 75%
**Complexity:** Low
**Status:** Unexplored

### 7. Growth-State Indicators for Garden Notes

**Description:** Pure-CSS botanical glyphs per garden note indicating maturity (seedling/growing/evergreen). Geometric enough to be brutalist, organic enough to be floral.
**Rationale:** Makes the garden metaphor navigable. Functional and beautiful.
**Downsides:** Requires status metadata field. CSS shapes need to be good or they look amateurish.
**Confidence:** 75%
**Complexity:** Medium
**Status:** Unexplored

## Rejection Summary

| #   | Idea                             | Reason Rejected                                         |
| --- | -------------------------------- | ------------------------------------------------------- |
| 1   | Weight Gradient Headlines        | Per-character spans incompatible with AsciiDoc pipeline |
| 2   | Optical Size Inversion           | Harms readability; reads as a bug                       |
| 3   | Extreme Letterspacing Spectrum   | Too subtle mild, unreadable at extremes                 |
| 4   | Upright/Italic Tension           | Italic has semantic meaning; alternating fights content |
| 5   | Typographic Trellis              | Uncertain visibility at low opacity; high effort        |
| 6   | SOFT Axis Interactive State      | Nav is sans-serif; too limited in scope                 |
| 7   | Variable Font Scroll Animation   | Patchy browser support; high complexity                 |
| 8   | Newsreader Marginalia            | No content exists for the margins yet                   |
| 9   | Border as Primary Ornament       | Brutalism cliche; reads as CSS experiment               |
| 10  | Negative Space as Mass           | Solid black column overwhelms readability               |
| 11  | Raw HTML in Garden               | Introduces monospace; contradicts organic concept       |
| 12  | Stacked Nav Monument             | Usability anti-pattern; hostile to reader               |
| 13  | Horizontal Rules as Architecture | Generic; doesn't carry the floral-brutal tension        |
| 14  | Exposed Metadata Layer           | Risks feeling pretentious                               |
| 15  | Thorn Borders                    | Fragile across browsers; high maintenance               |
| 16  | Vine-Line Connections            | Needs JS + link graph; too expensive                    |
| 17  | Petal Grid Hover States          | Visually noisy; excessive animation                     |
| 18  | Root System Footer               | Overly literal; dates quickly                           |
| 19  | Seasonal CSS Properties          | High carrying cost; 4 seasonal definitions              |
| 20  | Compost Heap Archive             | Only 5 notes; no old content to decompose               |
| 21  | Seed Packet Layout               | Forces rigid layout on all content                      |
| 22  | Germination Loading States       | Site is prerendered; no loading to replace              |
| 23  | Ink Bleed Borders                | Finicky SVG filters; worse than paper grain             |
| 24  | Grain Gradient on Scroll         | Too subtle; limited support                             |
| 25  | Botanical Halftone               | Site has no images                                      |
| 26  | Thorn Cursor                     | Custom cursors are a usability anti-pattern             |
| 27  | Dark Mode Botanical              | Good but significant CSS surface; later phase           |
| 28  | Pressed Flower Palette           | Multiple colors contradicts restraint                   |
| 29  | Overprint Marks                  | Too niche to recognise                                  |

## Session Log

- 2026-04-15: Initial ideation — 38 candidates generated across 4 frames (typography, structural brutalism, organic CSS, color/texture), 7 survived. User selected #5 (Visible Grid Scaffolding) for brainstorm.
