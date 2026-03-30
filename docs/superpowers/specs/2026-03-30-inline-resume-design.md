# Inline Resume Design Spec

## Goal

Retire the standalone LaTeX resume repo (`jordangarrison/resume`) by migrating all resume content into `jordangarrison.dev` as the single source of truth. Add a dedicated `/resume` page with an embedded PDF viewer and direct download link, while enriching existing site pages with the full resume content.

## Decisions

- All resume content migrates to the site (skills, experience, education, awards, certifications, about me)
- Keep existing site tagline unchanged
- Dedicated `/resume` page with embedded PDF viewer, condensed/full toggle, and download button
- Configurable toggle via button + URL param (`/resume?view=full`)
- Dedicated print style: white background, two-column, blue accents, paper-optimized
- PDF generated at build time via Playwright from a hidden HTML template page
- Nav "Resume" link points to `/resume`, download lives on that page
- Keep existing site profile image (no headshot migration)
- Archive resume repo with README redirect after go-live

## Data Architecture

### Existing Collection (expand)

**`experience`** — `src/content/experience/`
- Add Texas A&M Data Analyst role (2014, Higgs Boson simulation) as new entry
- Lynntech Inc. Research Technician role already exists in the collection (`lynntech.md`)
- No schema changes needed

### New Collections

**`skills`** — `src/content/skills/`

Files: `languages.md`, `platforms.md`, `iac.md`, `observability.md`, `cicd.md`, `databases.md`, `caches.md`, `indexes.md`, `management.md`, `project-management.md`, `specialized.md`

Schema:
```typescript
{
  name: string,                        // "Languages"
  sortOrder: number,                   // display ordering
  resumeSection: "sidebar" | "main",   // placement on condensed print resume
  items: string[],                     // ["Go", "TypeScript", "Python", "Bash"]
}
```

**`education`** — `src/content/education/`

Files: `texas-a-and-m.md`

Schema:
```typescript
{
  institution: string,   // "Texas A&M University"
  degree: string,        // "Bachelor of Science"
  major: string,         // "Physics"
  minor: string?,        // "Mathematics"
  startYear: number,     // 2012
  endYear: number,       // 2017
  sortOrder: number,
}
```

**`certifications`** — `src/content/certifications/`

Files: `gitops-advanced.md`

Schema:
```typescript
{
  name: string,          // "Advanced GitOps Certification"
  date: string,          // "2024-04"
  credentialId: string?, // "101100053"
  description: string?,
  sortOrder: number,
}
```

**`awards`** — `src/content/awards/`

Files: `tech-lead-promotion.md`, `top-performer-2021.md`, `senior-promotion-2021.md`, `ceo-life-saving.md`, `cio-safety.md`, `early-promotion-gm.md`, `distinguished-nch.md`

Note: The "CIO Distinguished New College Hire" award (2018 & 2019) is a single entry — the schema uses a `years` array to handle multi-year awards.

Schema:
```typescript
{
  title: string,         // "Top Performer - Own It"
  years: number[],       // [2021] or [2018, 2019] for multi-year awards
  organization: string,  // "FloSports"
  sortOrder: number,
}
```

## Condensed vs Full Content Rules

The condensed/full toggle controls what content appears in each view. Rules per collection:

| Collection | Condensed | Full |
|---|---|---|
| **experience** | `professional` category only (FloSports, GM, Lynntech, Texas A&M Data Analyst). Brief summary only — no highlights, promotions, or markdown body. | All entries including `other` category. Full highlights, promotions, and expanded markdown body. |
| **skills** | Categories with `resumeSection: "sidebar"` only | All skill categories |
| **education** | Included (degree, major, minor, years) | Same |
| **awards** | All awards, compact single-line format | Same |
| **certifications** | Name and date only | Name, date, credential ID, and description |
| **About Me** | Not shown | Included |

## Pages & Components

### `/resume` Page

- Embedded PDF viewer (`<embed>` or `<iframe>`) showing the resume inline
- Condensed view by default, full CV via toggle or `?view=full`
- Download button: `<a href="/resume.pdf" download>` for sharing with recruiters/platforms
- Toggle swaps the `<embed>` src between `/resume.pdf` (condensed) and `/resume-full.pdf` (full CV) client-side via JS
- Toggle updates URL param without page reload
- Both PDFs are static files generated at build time — the `/resume` page just references them

### Hidden HTML Template Page (`/resume/print`)

- Not linked in nav, exists solely as the Playwright render source
- Two-column CSS Grid layout with named areas
- Left sidebar (~35%): contact info, skills (categories with `resumeSection: "sidebar"`), education
- Right main (~65%): experience entries, awards, certifications
- White background, blue accents (`#0E5484`)
- `@page { size: letter; margin: 0.5in; }`
- `break-inside: avoid` on job entries, skill groups, education blocks
- `rem`-based sizing with root font-size tuned for print density
- Accepts a query param or similar mechanism to render condensed vs full content

### Existing Page Changes

**Homepage (`index.astro`):**
- Refactor hardcoded awards to query `awards` collection
- Refactor hardcoded education to query `education` collection
- Refactor hardcoded skills grid to query `skills` collection
- Add missing skill categories (databases, caches, indexes, CI/CD, management, project management)
- Add "About Me" personal section from resume (hardcoded text on homepage — single short paragraph, not worth a content collection)
- No changes to tagline or hero section

**Experience page (`experience.astro`):**
- Add Texas A&M Data Analyst role via new content entry
- No structural changes needed

**Navbar (`Navbar.astro`):**
- Change "Resume" link from external PDF URL to `/resume`

**Content config (`content.config.ts`):**
- Add Zod schemas for `skills`, `education`, `certifications`, `awards` collections

## PDF Generation

### Build Pipeline

```
bun run build
  1. astro build              → static HTML in dist/
  2. preview server starts    → serves dist/ on localhost
  3. playwright script        → headless Chromium
     - navigates to /resume/print          → generates dist/resume.pdf
     - navigates to /resume/print?view=full → generates dist/resume-full.pdf
  4. preview server stops
```

### Implementation

- `scripts/generate-pdf.js` — ~20 line Playwright script
- `start-server-and-test` package (compatible with Bun) to orchestrate preview server + script. The preview server runs on port 4321 (Astro default). The Playwright script connects to `http://localhost:4321`.
- Build script: `"build": "astro build && bun run generate-pdf"`
- `playwright` added as a devDependency in `package.json`
- Nix flake: add `playwright-driver.browsers` and set `PLAYWRIGHT_BROWSERS_PATH` so Playwright finds the Nix-managed Chromium

### Print CSS

- Two-column CSS Grid with named areas (sidebar + main)
- `@page { size: letter; margin: 0.5in; }` (Chromium, which Playwright uses)
- `print-color-adjust: exact` for intentional background colors
- `break-inside: avoid` on all logical content blocks
- `break-after: avoid` on section headings
- Nav, footer, toggle, download button hidden

### Components (for the print template)

- `ResumeHeader.astro` — name, title, contact info
- `ResumeSkills.astro` — skill categories in sidebar/main layout
- `ResumeExperience.astro` — experience entries (condensed vs full)
- `ResumeEducation.astro` — education entries
- `ResumeAwards.astro` — awards and certifications

## Resume Repo Retirement

1. Confirm `/resume` page is live and PDF generation works
2. Update `resume/README.md` to redirect to `jordangarrison.dev/resume` and point to `jordangarrison/jordangarrison.dev` repo
3. User archives `jordangarrison/resume` on GitHub manually (out of scope for implementation)
