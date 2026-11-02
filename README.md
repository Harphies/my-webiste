# Harphies Journal

Engineering notes and portfolio by Olalekan Taofeek. Gatsby 5, React 19 and Node.js 24; dependencies are pinned in `package.json` and `package-lock.json`.

## Develop and verify

```bash
nvm use
npm ci
npm start
```

Production preview:

```bash
npm run build
npm run serve
```

Open `http://localhost:9000/blogs/llm-serving-topologies-and-why-they-matter/` for the new article. `npm test` runs the production build, including Gatsby's GraphQL and static-render checks.

`.npmrc` enables Gatsby's recommended legacy peer resolution for React 19. AJV 8 is an explicit build dependency so Webpack's modern schema validators do not resolve AJV 6 from older loaders. Gatsby's current dependency tree still contains legacy transitive packages; updating the direct dependencies does not remove all of them.

## Write a post

Add `src/pages/post_N/index.md` with a unique `path`, date, title, author, description, `smallTitle`, `timeToRead` and `postNum`. Store images alongside the Markdown and link them relatively. Use source-resolution plots; Gatsby generates responsive images rather than requiring 400px originals. Give comparisons meaningful captions and label historical or unmatched measurements.

The LLM serving article and supplied historical plot are in `src/pages/post_38/`. Its AGG/PD table and historical GLM-5.2 plot describe different comparisons.

## Hosting

Netlify builds with Node 24 and publishes `public/`, as configured in `netlify.toml`. The default root deployment matches `https://harphies.tech`. For a subpath deployment, set `PATH_PREFIX=/your-subpath` and build with `--prefix-paths`.

`npm run deploy` is an explicit GitHub Pages publish command; local builds do not publish. `app-spec.yaml` uses the same Node/npm build path for the existing alternative hosting configuration.

Upgrade reference: [Gatsby 5.16 — React 19 and Node 24 support](https://www.gatsbyjs.com/docs/reference/release-notes/v5.16/).

## Reproduce the topology figures

The article compares saved GLM-5.3 AGG 1×TP4, AGG 2×TP4 and PD 3P1D results. Its public CSV contains 25 validated aggregate points; it contains no prompts, internal endpoints or GPU identifiers.

```bash
uv run --no-project --with matplotlib python scripts/plot-llm-topologies.py
```

This reads `static/data/glm53-topology-8k1k-20261102.csv` and regenerates three PNG figures beside the post plus SVG versions under `static/plots/`. It sends no inference or SSH requests. Only AGG 2×TP4 has a measured C256 point.
