// Gatsby supplies trusted, rendered Markdown and plain-text heading labels.
// Run identically during SSR and hydration so links work before JavaScript loads.
export function preparePost(html, headings = []) {
  const usedIds = new Set(
    Array.from(html.matchAll(/\bid=["']([^"']+)["']/g), match => match[1])
  )
  const sections = []
  let headingIndex = 0
  let tableIndex = 0
  const content = html.replace(
    /<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, level, attributes, inner) => {
      const heading = headings[headingIndex++]
      const existingId = attributes.match(/\bid=["']([^"']+)["']/)
      const slug = (heading?.value || `section-${headingIndex}`)
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-|-$/g, "") || `section-${headingIndex}`
      let id = existingId?.[1] || slug
      if (!existingId) {
        let suffix = 2
        while (usedIds.has(id)) id = `${slug}-${suffix++}`
        usedIds.add(id)
      }
      if (Number(level) <= 2 && heading) {
        sections.push({ id, title: heading.value })
      }
      // The post header owns h1; legacy Markdown h1s become body sections.
      const depth = level === "1" ? "2" : level
      return `<h${depth}${attributes}${existingId ? "" : ` id="${id}"`} tabindex="-1">${inner}</h${depth}>`
    }
  ).replace(/<table\b[\s\S]*?<\/table>/gi, table => {
    tableIndex += 1
    return `<div class="post-table" role="region" aria-label="Table ${tableIndex}; scroll horizontally to see all columns" tabindex="0">${table}</div>`
  })
  return { html: content, sections }
}
