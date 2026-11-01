# Stack refresh — 2026-11-01

- Gatsby 2 → **5.16.1**; React 16 → **19.3.1**; Node **24** (the installed local version is 24.10.0).
- Updated Gatsby image/Markdown plugins and rebuilt the npm lockfile with exact direct versions. Removed unused legacy `gatsby-image`, offline and image-copy plugins.
- Migrated GraphQL sorting and image queries, explicit page slugs, React string refs and function-component defaults. The blog index now selects its first post before rendering.
- Added root-domain Netlify settings, a Node 24 CI build, responsive table overflow and correct per-article canonical/OG URLs. GitHub Pages publication remains an explicit command.

[Gatsby 5.16 supports React 19 and Node 24](https://www.gatsbyjs.com/docs/reference/release-notes/v5.16/). Its React 19 upgrade guidance recommends legacy peer resolution; `.npmrc` records that setting. AJV 8 is pinned for Webpack's modern validators alongside loaders that require AJV 6.

## Dependency audit

`npm audit --omit=dev` reports **69 advisories: 31 high, 32 moderate, 6 low; zero critical**. A compatible `npm audit fix --ignore-scripts` pass made no changes. Gatsby still pulls older build, image and utility dependencies; a current Gatsby release is not a clean dependency audit. Some suggested fixes downgrade Gatsby or its plugins, so they were not forced.

This site publishes static output, but that alone does not resolve build-time or bundled-dependency findings. Review the dependency tree before treating this branch as a security remediation. A framework migration is a separate decision from this stack refresh.

## Article evidence

The new post is `/blogs/llm-serving-topologies-and-why-they-matter/`. Its table compares four-GPU GLM-5.3 AGG with twenty-GPU PD. The attached plot is a separate historical comparison: GLM-5.3 PD versus GLM-5.2. The article labels different GPU budgets, workload sizes, cache controls and sample budgets rather than claiming a controlled topology comparison.
