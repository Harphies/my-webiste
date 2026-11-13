import React from "react"

export default function PostContents({ sections }) {
  if (sections.length < 4) return null
  return (
    <nav className="post-contents" aria-label="Article sections">
      <details open>
        <summary>On this page</summary>
        <ol>
          {sections.map(section => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.title}</a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  )
}
