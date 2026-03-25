# RSS Feed, LLMs.txt & Sitemap — Design Spec

**Date:** 2026-03-25
**Status:** Approved
**Site:** jordangarrison.dev (Astro 6, static output)

## Overview

Add four auto-generated endpoints to the portfolio site:

1. `/rss.xml` — RSS feed for blog posts
2. `/llms.txt` — navigational map for LLMs
3. `/llms-full.txt` — full site content inlined for LLM context
4. `/sitemap-index.xml` — auto-generated sitemap via `@astrojs/sitemap`

All content is generated at build time from existing data sources. No manual maintenance required.

## Data Sources

| Source | Location | Used By |
|--------|----------|---------|
| Blog posts | `getCollection('blog')` | RSS, llms.txt, llms-full.txt |
| Portfolio projects | `src/data/portfolio.ts` | llms.txt, llms-full.txt |
| Work experience | `src/data/workExperience.ts` | llms.txt, llms-full.txt |
| About/skills/awards | Extracted inline (currently in `index.astro`) | llms-full.txt |

## 1. RSS Feed (`/rss.xml`)

**File:** `src/pages/rss.xml.ts`
**Dependency:** `@astrojs/rss`

- Static API endpoint using `@astrojs/rss` helper
- Queries `getCollection('blog')`, filters to `published: true`, sorts by date descending
- Feed metadata:
  - Title: "jordangarrison.dev"
  - Site: `https://jordangarrison.dev`
  - Description: Jordan Garrison's blog
- Each item includes: title, description (excerpt), pubDate, link, categories
- RSS autodiscovery `<link>` tag added to `BaseLayout.astro` `<head>`
- RSS link added to `Footer.astro` for human discoverability

## 2. LLMs.txt (`/llms.txt`) — The Map

**File:** `src/pages/llms.txt.ts`

Auto-generated navigational overview. Structure:

```
# jordangarrison.dev

> Jordan Garrison — Tech Lead & SRE at FloSports. Personal portfolio and blog.

## About
- [Home](https://jordangarrison.dev/)

## Blog
- [Blog Index](https://jordangarrison.dev/blog)
- [Post Title](https://jordangarrison.dev/blog/post-slug)
- ...

## Portfolio
- [Portfolio Index](https://jordangarrison.dev/portfolio)
- [Project Name](https://github.com/...)
- ...

## Experience
- [Experience](https://jordangarrison.dev/experience)
- Company — Role (dates)
- ...

## Contact
- [Contact](https://jordangarrison.dev/contact)
```

Content is concise and link-oriented. An LLM reads this to understand what exists and where to find details.

## 3. LLMs Full (`/llms-full.txt`) — Full Dataset

**File:** `src/pages/llms-full.txt.ts`

Everything inlined for direct LLM consumption. Sections:

### Header
- Name, bio, site URL

### About
- Journey/career summary, skills by category, awards and certifications
- Text extracted inline from the same data rendered on the index page

### Work Experience
- All roles from `workExperience.ts`
- Each entry: company, title, dates, promotions, accomplishments

### Portfolio
- All 15 projects from `portfolio.ts`
- Each entry: title, description, tech stack, features, URLs (GitHub, live, download)

### Blog Posts
- All published posts with **full markdown content** inlined
- Each entry: title, date, categories, tags, reading time, full body text

## 4. Sitemap

**Integration:** `@astrojs/sitemap`

- Added to `integrations` array in `astro.config.mjs`
- Auto-discovers all pages and generates `sitemap-index.xml` + `sitemap-0.xml`
- No additional configuration needed — `site` is already set in config

## 5. Integration & Wiring

### New Dependencies
- `@astrojs/rss` — RSS feed generation
- `@astrojs/sitemap` — sitemap generation

### BaseLayout.astro Changes
- Add to `<head>`:
  ```html
  <link rel="alternate" type="application/rss+xml" title="jordangarrison.dev" href="/rss.xml" />
  ```

### Footer.astro Changes
- Add RSS feed link for human discoverability

### astro.config.mjs Changes
- Add `@astrojs/sitemap` to integrations array

## 6. File Summary

| File | Action |
|------|--------|
| `package.json` | Add `@astrojs/rss`, `@astrojs/sitemap` |
| `astro.config.mjs` | Add sitemap integration |
| `src/pages/rss.xml.ts` | New — RSS endpoint |
| `src/pages/llms.txt.ts` | New — LLMs map endpoint |
| `src/pages/llms-full.txt.ts` | New — LLMs full content endpoint |
| `src/layouts/BaseLayout.astro` | Add RSS autodiscovery link |
| `src/components/Footer.astro` | Add RSS link |

## Out of Scope

- Per-page structured data / content negotiation for LLMs (future — more valuable with SSR)
- `robots.txt` (can be added later)
- Blog post MDX support (not currently used)
