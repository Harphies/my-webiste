# Article presentation system

All Markdown posts use `src/templates/blog-post.js`, `PostContents`, `preparePost`
and `src/components/style/post.css`. Change this shared layer rather than adding
per-post inline styles. Existing post content and benchmark data remain the source
of truth. The inference article also groups experimental findings under their
parent section rather than presenting every subsection at the same level.

## Evidence and limits

- [NN/g’s eye-tracking research on layer-cake scanning](https://www.nngroup.com/articles/layer-cake-pattern-scanning/)
  supports descriptive, visually distinct headings and more space above headings
  than below: readers can locate a section and associate it with its explanation.
  This supports hierarchy and grouping, not a universal pixel size.
- [WCAG 1.4.8, Visual Presentation (AAA)](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html)
  discusses line lengths of at most 80 characters, non-justified text, spacing and
  resizing. A 68ch CSS measure is a practical starting point, not an exact character
  count in a proportional font or a claim of full AAA compliance.
- [WCAG 1.4.12, Text Spacing (AA)](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
  requires tolerating user overrides (1.5 line height, 2em paragraph spacing,
  0.12em letter spacing and 0.16em word spacing) without content loss. These are
  override test values, not prescribed default styles. Avoid fixed text heights,
  truncation and hidden text overflow.
- [WCAG 1.4.3, Contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
  sets 4.5:1 for ordinary text and 3:1 for qualifying large text. Use readable muted
  text in both themes, and underline prose links so colour is not the only cue.

These sources support the principles. The exact type scale below is an editorial
choice for this technical blog and should be refined through reader feedback.
There is no single research-proven font size for each information layer.

## Default scale

Pixel equivalents assume a 16px root; rem units respect browser font preferences.

| Information layer | Default size | Treatment and purpose |
| --- | --- | --- |
| Article title | 32–48px, responsive | One left-aligned h1, 1.15 line height |
| Major section, h2 | 24–30px, responsive | 1.3 line height, divider and larger preceding gap |
| Subsection, h3 | 20–23px, responsive | 1.3 line height, smaller gap, no divider |
| Minor heading, h4–h6 | 18px | Bold; preserve semantic depth |
| Main explanation | 18px desktop; 17px small screens | 1.7 line height; 68ch maximum prose width |
| Tables and section navigation | 16px | 1.5–1.55 line height, logical grouping |
| Metadata and figure captions | 15px | 1.6 line height; quieter colour, readable contrast |
| Code blocks | 15px | 1.6 line height; independent horizontal scrolling |
| Inline code | 0.88em of surrounding text | Wrap long identifiers without widening the page |

The main article surface is at most 74rem; plots, code and tables can use that
width while prose stays narrow. Mobile gutters are 16px. Heading gaps are larger
above than below to group headings with the following text. Paragraph spacing is
1.35em. Spacing and type use relative units and do not clamp container heights.

## Structure and progressive disclosure

- Use h2 for major decisions or stages and h3 for their supporting explanations.
  The page header supplies the only h1; legacy body h1s render as h2.
- Posts with four or more top-level body headings receive an automatically built
  section index, visible by default and collapsible. Anchors are server rendered,
  so navigation works without JavaScript; duplicate headings receive unique IDs.
- Use tables for comparisons, paragraphs for explanation, lists for parallel or
  sequential material, and details for genuinely optional elaboration.
- Tables retain native table semantics inside labelled, keyboard-focusable scroll
  regions. Wide technical content scrolls independently instead of the whole page.
- Keep captions beside their figures. Do not encode new findings in layout or
  automatically fabricate summaries from article metadata.

## Verification

Build every post with `npm run build`. Check heading IDs and navigation targets,
legacy headings, repeated headings, tables, short posts and code-heavy posts.
Browser QA should cover 375px and desktop widths, both themes, keyboard navigation,
200% zoom and WCAG text-spacing overrides. A passing build or static markup check
does not substitute for browser accessibility and usability testing.
