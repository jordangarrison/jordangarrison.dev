# Work Experience Redesign

Redesign the work experience section of jordangarrison.dev — data architecture, content, and visual presentation.

## Goals

1. Move work experience data from a TypeScript array to Astro Content Collections (markdown)
2. Refresh all work experience content using verified Jira, GitHub, and Confluence research
3. Redesign experience cards with timeline-integrated layout using Rose Pine theming
4. Auto-generate the home page "My Journey" timeline from the same data source
5. Add "Other Experience" section for early non-tech roles
6. Structure data to support a future resume PDF renderer

## Data Architecture

### Content Collection

Add an `experience` collection in `src/content.config.ts` alongside the existing `blog` collection.

**Directory:** `src/content/experience/`

**Files:**
- `flosports.md`
- `general-motors.md`
- `lynntech.md`
- `nelsons-fireworks.md`
- `plano-marine.md`
- `music-and-arts.md`

### Schema (Zod)

```typescript
const experience = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    title: z.string(),
    image: z.string().optional(),
    url: z.string().url().optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}$/), // "YYYY-MM" format
    endDate: z.string().regex(/^\d{4}-\d{2}$/).nullable(), // null = "Present"
    sortOrder: z.number(),
    category: z.enum(['professional', 'other']),
    summary: z.string(), // Curated narrative for home page timeline
    promotions: z.array(z.object({
      title: z.string(),
      date: z.string(),
    })).optional(),
    highlights: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })).optional(),
  }),
});
```

**Frontmatter** holds structured data for card rendering (highlights, promotions, dates).

**Markdown body** holds the full project breakdown by theme, rendered inside the expandable accordion. Only professional roles with extensive projects need a body; others can have an empty body.

### Example: `flosports.md`

```yaml
---
company: "FloSports"
title: "Tech Lead Manager, SRE"
image: "https://flocms.flosports.tv/wp-content/uploads/2026/02/FloSports-Secondary-igniteblack.svg"
url: "https://www.flosports.tv"
startDate: "2019-11"
endDate: null
sortOrder: 1
category: "professional"
summary: "From Infrastructure Engineer to Tech Lead Manager. Building developer platforms, driving cloud migrations, and establishing SRE practices for a live sports streaming platform."
promotions:
  - title: "Infrastructure Engineer"
    date: "2019"
  - title: "Senior Infrastructure Engineer"
    date: "2021"
  - title: "Tech Lead Manager, SRE"
    date: "2023"
highlights:
  - title: "GCP to AWS Cloud Migration"
    description: "Architected and executed full cloud consolidation from GCP to AWS. Migrated 20+ services including databases, caches, and CI/CD pipelines to EKS with zero downtime. Created self-service migration templates for teams."
  - title: "Load Testing Platform"
    description: "Built distributed K6 load testing platform from scratch across 4+ phases. Evolved to Kubernetes-native with K6 Operator, dedicated UI, CI/CD integration, and browser-level tests. Validates readiness for major live sporting events."
  - title: "Developer Experience Platform"
    description: "Built flo-deploy, opinionated Helm charts, and infrastructure-manifests to give developers a paved road to production. Authored RFC for Crossplane-based self-service platform."
  - title: "Observability & SRE Transformation"
    description: "Led org-wide Datadog migration and restructured team from DevOps/Infra to SRE to align outcomes with business goals. Established SLO-based culture with per-service reliability reporting, scorecards, and incident response frameworks."
---

## Infrastructure as Code

- **Terraform Foundation**: Built unified IaC across GCP and AWS. 185+ PRs to infra-base-services. Created reusable Terraform modules for RDS Aurora, ElastiCache, EKS clusters.
- **Helm Charts Evolution**: Evolved from Kustomize overlays to Terraform modules to opinionated Helm charts for standardized EKS deployments. Authored 11 RFCs including "Why not use Terraform for Everything."
- **EKS Platform**: Multiple EKS upgrades (1.25 through 1.30), Karpenter adoption, Istio service mesh management. Exploring EKS Auto-Mode for reduced operational overhead.

## CI/CD & Developer Experience

- **flo-deploy**: Created deployment proxy GitHub Action from scratch (64+ PRs). Pull-based pipelines, simplified rollbacks, self-service deployments for all engineering teams.
- **CI/CD Migration**: Migrated from GCP Cloud Build to GitHub Actions. Built shared workflows, runner health monitoring, and preview environments.
- **Service Playbooks & Standards**: Authored comprehensive onboarding docs, conducted weekly SRE roadshows auditing each platform's observability. Built gold standard examples for SST and Kubernetes deployments.

## Cost Optimization & Security

- **FinOps & Cost Management**: $200K+/yr S3 VOD savings. Datadog cost optimization targeting 40-60% savings. Established resource tagging standards and FinOps framework.
- **Security Incident Response**: Led GitHub token exposure remediation (367 repos affected), botnet attack response, SQLi attack investigation, WAF hardening.

## Reliability & Event Stability

- **Major Event Preparation**: ADCC 2024, Wrestling Big Weekend, FloCollege Launch, Next Gen Wrestling (99.95% uptime target with 500k redirected users doubling traffic volume).
- **Resilience Engineering**: Implemented chaos testing framework with deploy gates, SLOs for key user journeys, graceful degradation patterns. Authored 40+ incident investigations with systematic root-cause analysis.
```

### Example: `general-motors.md`

```yaml
---
company: "General Motors"
title: "Big Data Platform Engineer"
image: "https://media.gm.com/dld/content/dam/Shared/Images/Logos/gm/GM_Gradient_Brandmark_RGB-2021.jpg/_jcr_content/renditions/cq5dam.web.1280.1280.jpeg"
url: "https://www.gm.com"
startDate: "2017-05"
endDate: "2019-11"
sortOrder: 2
category: "professional"
summary: "Big Data Platform Engineer managing Hadoop clusters with thousands of users. Built monitoring systems, security frameworks, and automation tools."
promotions:
  - title: "L5 Big Data Platform Engineer"
    date: "2017"
  - title: "L6 Big Data Platform Engineer"
    date: "2019"
highlights:
  - title: "Data Governance & Security"
    description: "Implemented full data governance and lineage toolchain with Apache Ranger and Atlas across Hadoop clusters. Established RBAC framework with self-service user management used org-wide."
  - title: "Yarn Queue Manager"
    description: "Built Go-based utility for automated Yarn queue scheduling. Optimized cluster resource allocation between data science workloads during business hours and batch reporting off-hours."
  - title: "Hadoop Monitoring Stack"
    description: "Built comprehensive monitoring ecosystem with Prometheus and Grafana for previously invisible cluster metrics. Became the standard platform for cluster observability and performance analysis."
---
```

### Example: `lynntech.md`

```yaml
---
company: "Lynntech"
title: "Research Technician"
image: "https://www.lynntech.com/wp-content/uploads/2016/04/HeaderLogo_Tiny.png"
url: "https://www.lynntech.com"
startDate: "2016-04"
endDate: "2017-05"
sortOrder: 3
category: "professional"
summary: "Research Technician building IoT prototypes with Python, Arduino, and Raspberry Pi. Hardware meets software."
highlights:
  - title: "Iodine Detection Kit"
    description: "Developed NIH-funded prototype for affordable water iodine detection in regions with high hypothyroidism rates. Built IoT solution using Raspberry Pi, Arduino, and colorimeter with Python-based Qt interface."
  - title: "Desalination Monitor"
    description: "Created Arduino-based monitoring system for seawater desalination validation. Implemented pH and salinity sensors with visual feedback interface for rapid water quality assessment."
  - title: "Muscle-Powered Pacemaker"
    description: "Prototyped circuit designs for a muscle-powered pacemaker concept, combining hardware prototyping with Python programming for data collection and analysis."
---
```

### Example: `music-and-arts.md`

```yaml
---
company: "Music and Arts"
title: "Instrument Repair Technician"
startDate: "2015-01"
endDate: "2016-01"
sortOrder: 4
category: "other"
summary: "Assistant repairman for musical instruments. Cleaning, minor dent repair, pickup and delivery with band directors, and billing when needed."
---
```

### Example: `plano-marine.md`

```yaml
---
company: "Plano Marine"
title: "Marine Mechanic Assistant"
startDate: "2014-01"
endDate: "2015-01"
sortOrder: 5
category: "other"
summary: "Assistant to marine mechanics. Moving boats in and out of bays and making mechanics' lives easier."
---
```

### Example: `nelsons-fireworks.md`

```yaml
---
company: "Nelson's Fireworks"
title: "Sales Associate"
startDate: "2013-06"
endDate: "2013-07"
sortOrder: 6
category: "other"
summary: "Seasonal sales during the 4th of July rush. Explaining products and helping customers find what they need."
---
```

## Visual Design

### Experience Card — Timeline-Integrated

Each professional experience renders as a card with:

1. **Timeline accent bar** — vertical `rp-rose` bar on the left edge of the card
2. **Card header** — company logo, current title, company name (linked), date range
3. **Promotion timeline** — dots along the timeline bar, current role in `rp-rose`, previous roles in `rp-muted`. Frontmatter stores promotions in chronological order (oldest first). The component reverses the array to render newest first (top to bottom).
4. **Key highlights** — always visible, 3-5 per company. Cards with `rp-rose` left border accent. Title in `rp-text`, description in `rp-subtle`
5. **Expandable accordion** — "Show all projects" toggle reveals full themed project list from the markdown body. Uses native `<details>/<summary>` HTML elements for accessibility (built-in `aria-expanded` behavior, keyboard navigable). Rendered markdown body uses Tailwind `prose` classes with Rose Pine token overrides (matching the blog's `BlogPostLayout.astro` prose styling) for consistent heading, link, and list formatting.

**Color usage:**
- `rp-rose` — primary accent (timeline bar, active promotion dot, highlight card border, interactive elements)
- `rp-text` — headings, titles
- `rp-subtle` — body text, descriptions
- `rp-muted` — secondary info (past promotions, dates, theme labels)
- `rp-surface` — card background
- `rp-base` — highlight card background (within the card)
- `rp-highlight-low` / `rp-highlight-med` — borders, dividers
- No per-theme color coding

### Other Experience Section

Rendered below professional experience as a compact list:

- Section header: "Other Experience" with subtitle "Earlier roles that shaped my work ethic"
- Simple rows: role title, company name, date range
- No cards, no logos, no descriptions
- Uses `rp-text` for role, `rp-muted` for company and date
- Divider line between entries (`rp-highlight-low`)

### Home Page Timeline

The existing "My Journey" section on `index.astro` is replaced with an auto-generated version:

- Reads all `professional` category entries from the experience collection
- Renders the same vertical timeline layout currently hardcoded
- Uses `summary` field for the description text
- Uses `company`, `startDate`, `endDate` for the header and date
- Links to `/experience#{id}` where `id` is derived from the markdown filename (e.g., `flosports.md` → `#flosports`, `general-motors.md` → `#general-motors`). Note: the current site uses `#gm` for General Motors — this changes to `#general-motors` since both the home page and experience page will use the collection entry's `id` property.
- Texas A&M education entry stays hardcoded (it's not work experience)

## Files to Modify

1. **`src/content.config.ts`** — add `experience` collection with Zod schema
2. **`src/content/experience/*.md`** — create 6 markdown files (3 professional, 3 other)
3. **`src/components/WorkExperience.astro`** — rewrite for timeline-integrated design with accordion
4. **`src/pages/experience.astro`** — query collection, render professional cards + other experience list
5. **`src/pages/index.astro`** — replace hardcoded "My Journey" with collection-driven timeline
6. **`src/pages/llms.txt.ts`** — replace `workExperiences` import with `getCollection('experience')` query, update property access to match new schema
7. **`src/pages/llms-full.txt.ts`** — same migration as `llms.txt.ts`
8. **`src/data/workExperience.ts`** — delete (replaced by content collection)

## Files NOT Modified

- `src/styles/theme.css` — existing Rose Pine variables are sufficient
- `src/styles/global.css` — no new global styles needed
- `src/layouts/BaseLayout.astro` — no layout changes
- Blog content collection — unchanged

## Out of Scope

- Resume PDF generation (future feature — this design supports it by structuring data in the collection)
- New pages per company (accordion keeps everything on `/experience`)
- Education as a content collection entry (stays hardcoded on home page)
- Skills section changes
- Awards & certifications changes
