# Work Experience Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate work experience from a TypeScript data file to Astro Content Collections with refreshed content and a timeline-integrated card design.

**Architecture:** Content Collections with markdown files (frontmatter for structured data, body for expanded project details). Experience page queries the collection and renders timeline-integrated cards with expandable accordions. Home page timeline auto-generates from the same data.

**Tech Stack:** Astro 6, Content Collections (Zod schemas), Tailwind CSS v4, Rose Pine theming, `<details>/<summary>` for accordion.

**Spec:** `docs/superpowers/specs/2026-03-25-work-experience-redesign.md`

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Modify | `src/content.config.ts` | Add `experience` collection with Zod schema |
| Create | `src/content/experience/flosports.md` | FloSports work experience content |
| Create | `src/content/experience/general-motors.md` | General Motors work experience content |
| Create | `src/content/experience/lynntech.md` | Lynntech work experience content |
| Create | `src/content/experience/music-and-arts.md` | Music and Arts "other" experience |
| Create | `src/content/experience/plano-marine.md` | Plano Marine "other" experience |
| Create | `src/content/experience/nelsons-fireworks.md` | Nelson's Fireworks "other" experience |
| Rewrite | `src/components/WorkExperience.astro` | Timeline-integrated card with accordion |
| Create | `src/components/OtherExperience.astro` | Compact list for non-professional roles |
| Modify | `src/pages/experience.astro` | Query collection, render both sections |
| Modify | `src/pages/index.astro` | Auto-generate "My Journey" from collection |
| Modify | `src/pages/llms.txt.ts` | Replace `workExperiences` import with collection query |
| Modify | `src/pages/llms-full.txt.ts` | Replace `workExperiences` import with collection query |
| Delete | `src/data/workExperience.ts` | Replaced by content collection |

---

### Task 1: Add experience collection schema

**Files:**
- Modify: `src/content.config.ts`

- [ ] **Step 1: Add experience collection to content config**

Open `src/content.config.ts`. Add the `experience` collection alongside the existing `blog` collection. The file currently looks like:

```typescript
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    categories: z.array(z.enum(['engineering', 'nix', 'devops', 'personal', 'tutorial'])),
    tags: z.array(z.string()),
    published: z.boolean(),
    readingTime: z.string(),
  }),
});

export const collections = { blog };
```

Add the `experience` collection after `blog` and update the export:

```typescript
const experience = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    title: z.string(),
    image: z.string().optional(),
    url: z.string().url().optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}$/).nullable(),
    sortOrder: z.number(),
    category: z.enum(['professional', 'other']),
    summary: z.string(),
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

export const collections = { blog, experience };
```

- [ ] **Step 2: Create the content directory**

```bash
mkdir -p src/content/experience
```

- [ ] **Step 3: Verify the build still works**

Run: `bun run build`
Expected: Build succeeds (empty collection is fine)

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts
git commit -m "feat: add experience content collection schema"
```

---

### Task 2: Create professional experience content files

**Files:**
- Create: `src/content/experience/flosports.md`
- Create: `src/content/experience/general-motors.md`
- Create: `src/content/experience/lynntech.md`

- [ ] **Step 1: Create `flosports.md`**

Create `src/content/experience/flosports.md` with the following content. This is the most detailed entry — it has frontmatter highlights plus a full markdown body with themed project sections for the expandable accordion.

```markdown
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

- [ ] **Step 2: Create `general-motors.md`**

Create `src/content/experience/general-motors.md`:

```markdown
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

- [ ] **Step 3: Create `lynntech.md`**

Create `src/content/experience/lynntech.md`:

```markdown
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

- [ ] **Step 4: Verify build with content**

Run: `bun run build`
Expected: Build succeeds, experience collection loads 3 entries

- [ ] **Step 5: Commit**

```bash
git add src/content/experience/flosports.md src/content/experience/general-motors.md src/content/experience/lynntech.md
git commit -m "feat: add professional experience content files"
```

---

### Task 3: Create "other" experience content files

**Files:**
- Create: `src/content/experience/music-and-arts.md`
- Create: `src/content/experience/plano-marine.md`
- Create: `src/content/experience/nelsons-fireworks.md`

- [ ] **Step 1: Create `music-and-arts.md`**

Create `src/content/experience/music-and-arts.md`:

```markdown
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

- [ ] **Step 2: Create `plano-marine.md`**

Create `src/content/experience/plano-marine.md`:

```markdown
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

- [ ] **Step 3: Create `nelsons-fireworks.md`**

Create `src/content/experience/nelsons-fireworks.md`:

```markdown
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

- [ ] **Step 4: Verify build**

Run: `bun run build`
Expected: Build succeeds, experience collection loads 6 entries

- [ ] **Step 5: Commit**

```bash
git add src/content/experience/music-and-arts.md src/content/experience/plano-marine.md src/content/experience/nelsons-fireworks.md
git commit -m "feat: add other experience content files"
```

---

### Task 4: Rewrite WorkExperience component

**Files:**
- Rewrite: `src/components/WorkExperience.astro`

This is the biggest change. The component currently accepts a `WE` TypeScript type. It needs to accept a Content Collection entry and render the timeline-integrated design with accordion.

- [ ] **Step 1: Rewrite the component**

Replace the entire contents of `src/components/WorkExperience.astro` with the timeline-integrated card design. The component accepts a collection entry and its rendered HTML content.

```astro
---
interface Highlight {
  title: string;
  description: string;
}

interface Promotion {
  title: string;
  date: string;
}

interface Props {
  id: string;
  company: string;
  title: string;
  image?: string;
  url?: string;
  startDate: string;
  endDate: string | null;
  promotions?: Promotion[];
  highlights?: Highlight[];
}

const {
  id,
  company,
  title,
  image,
  url,
  startDate,
  endDate,
  promotions,
  highlights,
} = Astro.props;

const hasExpandedContent = Astro.slots.has('default');

// Format dates for display: "2019-11" -> "Nov 2019"
function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const displayStart = formatDate(startDate);
const displayEnd = endDate ? formatDate(endDate) : 'Present';

// Reverse promotions for display (newest first)
const displayPromotions = promotions ? [...promotions].reverse() : [];
---

<div id={id}>
  <div class="bg-rp-surface rounded-xl overflow-hidden border border-rp-highlight-med hover:border-rp-rose/50 transition-all duration-300">
    <div class="flex">
      {/* Timeline accent bar */}
      <div class="w-1 bg-gradient-to-b from-rp-rose to-rp-iris rounded-l-xl shrink-0"></div>

      <div class="flex-1 p-6">
        {/* Card header */}
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-5">
          {image && (
            <img
              src={image}
              alt={`${company} logo`}
              width="64"
              height="64"
              class="w-16 h-16 rounded-lg bg-white border border-rp-highlight-med object-contain p-2 shrink-0"
            />
          )}
          <div class="flex-1 text-center sm:text-left">
            <h3 class="text-xl font-bold text-rp-text">{title}</h3>
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                class="text-rp-rose hover:text-rp-love transition-colors font-medium"
              >
                {company}
              </a>
            ) : (
              <span class="text-rp-rose font-medium">{company}</span>
            )}
            <span class="text-rp-muted font-mono text-sm ml-2">
              · {displayStart} &ndash; {displayEnd}
            </span>
          </div>
        </div>

        {/* Promotion timeline */}
        {displayPromotions.length > 1 && (
          <div class="flex flex-col gap-1.5 mb-5 pl-1">
            {displayPromotions.map((promo, i) => (
              <div class="flex items-center gap-2">
                <div
                  class:list={[
                    'rounded-full shrink-0',
                    i === 0 ? 'w-2 h-2 bg-rp-rose' : 'w-1.5 h-1.5 bg-rp-muted',
                  ]}
                />
                <span
                  class:list={[
                    'text-sm',
                    i === 0 ? 'text-rp-rose' : 'text-rp-muted',
                  ]}
                >
                  {promo.date} &mdash; {promo.title}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Key highlights */}
        {highlights && highlights.length > 0 && (
          <div class="space-y-3 mb-4">
            {highlights.map((highlight) => (
              <div class="p-4 rounded-lg bg-rp-base border-l-[3px] border-rp-rose">
                <h4 class="text-base font-semibold text-rp-text mb-1">{highlight.title}</h4>
                <p class="text-sm text-rp-subtle leading-relaxed">{highlight.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Expandable accordion for full project details (rendered via slot) */}
        {hasExpandedContent && (
          <details class="mt-4">
            <summary class="cursor-pointer text-sm text-rp-rose hover:text-rp-love transition-colors text-center select-none">
              Show all projects
            </summary>
            <div class="mt-4 pt-4 border-t border-rp-highlight-low">
              <div class="experience-prose prose prose-sm max-w-none">
                <slot />
              </div>
            </div>
          </details>
        )}
      </div>
    </div>
  </div>
</div>

<style is:global>
  .experience-prose {
    color: var(--rp-text);

    & h2 {
      color: var(--rp-text);
      font-size: 1rem;
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }

    & h2:first-child {
      margin-top: 0;
    }

    & strong {
      color: var(--rp-text);
    }

    & a {
      color: var(--rp-rose);
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    & a:hover {
      color: var(--rp-love);
    }

    & ul {
      list-style: none;
      padding-left: 0;
    }

    & ul > li {
      color: var(--rp-subtle);
      font-size: 0.875rem;
      line-height: 1.6;
      padding-left: 0.75rem;
      border-left: 2px solid var(--rp-highlight-low);
      margin-bottom: 0.5rem;
    }

    & ul > li::marker {
      content: none;
    }

    & p {
      color: var(--rp-subtle);
      font-size: 0.875rem;
    }
  }
</style>
```

- [ ] **Step 2: Verify the component compiles (no build errors yet — it's not wired up)**

Run: `bun run check`
Expected: No TypeScript errors in the component file

- [ ] **Step 3: Commit**

```bash
git add src/components/WorkExperience.astro
git commit -m "feat: rewrite WorkExperience component with timeline-integrated design"
```

---

### Task 5: Create OtherExperience component

**Files:**
- Create: `src/components/OtherExperience.astro`

- [ ] **Step 1: Create the component**

Create `src/components/OtherExperience.astro`:

```astro
---
interface ExperienceEntry {
  company: string;
  title: string;
  startDate: string;
  endDate: string | null;
}

interface Props {
  experiences: ExperienceEntry[];
}

const { experiences } = Astro.props;

function formatYear(dateStr: string): string {
  return dateStr.split('-')[0];
}
---

<div class="mt-12">
  <h2 class="text-xl font-semibold text-rp-text mb-1">Other Experience</h2>
  <p class="text-sm text-rp-muted mb-6">Earlier roles that shaped my work ethic</p>

  <div class="divide-y divide-rp-highlight-low">
    {experiences.map((exp) => (
      <div class="py-3 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
        <div>
          <span class="text-rp-text font-medium">{exp.title}</span>
          <span class="text-rp-muted text-sm"> · {exp.company}</span>
        </div>
        <span class="text-rp-muted text-sm font-mono shrink-0">
          {formatYear(exp.startDate)}&ndash;{exp.endDate ? formatYear(exp.endDate) : 'Present'}
        </span>
      </div>
    ))}
  </div>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/OtherExperience.astro
git commit -m "feat: add OtherExperience component for non-professional roles"
```

---

### Task 6: Update experience page to use content collection

**Files:**
- Modify: `src/pages/experience.astro`

- [ ] **Step 1: Rewrite the experience page**

Replace the entire contents of `src/pages/experience.astro`. The page queries the content collection, splits by category, renders professional cards with the `WorkExperience` component, and passes the rendered markdown body as a slot child for the accordion.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import WorkExperience from '../components/WorkExperience.astro';
import OtherExperience from '../components/OtherExperience.astro';
import { getCollection, render } from 'astro:content';

const allExperience = await getCollection('experience');

const professional = allExperience
  .filter((e) => e.data.category === 'professional')
  .sort((a, b) => a.data.sortOrder - b.data.sortOrder);

const other = allExperience
  .filter((e) => e.data.category === 'other')
  .sort((a, b) => a.data.sortOrder - b.data.sortOrder);
---

<BaseLayout title="Experience - Jordan Garrison">
  <div class="max-w-4xl mx-auto">
    <div class="text-center mt-8 mb-12">
      <h1 class="text-4xl font-bold text-rp-text mb-4">Work Experience</h1>
      <p class="text-lg text-rp-subtle">My professional journey through tech</p>
    </div>

    <div class="space-y-8">
      {professional.map(async (entry) => {
        const hasBody = !!(entry.body && entry.body.trim().length > 0);
        const { Content } = hasBody ? await render(entry) : { Content: null };

        return (
          <WorkExperience
            id={entry.id}
            company={entry.data.company}
            title={entry.data.title}
            image={entry.data.image}
            url={entry.data.url}
            startDate={entry.data.startDate}
            endDate={entry.data.endDate}
            promotions={entry.data.promotions}
            highlights={entry.data.highlights}
          >
            {Content && <Content />}
          </WorkExperience>
        );
      })}
    </div>

    {other.length > 0 && (
      <OtherExperience
        experiences={other.map((e) => ({
          company: e.data.company,
          title: e.data.title,
          startDate: e.data.startDate,
          endDate: e.data.endDate,
        }))}
      />
    )}
  </div>
</BaseLayout>
```

**How this works:** The page calls `render(entry)` to get the `Content` component (Astro's rendered markdown). It passes `<Content />` as a slot child to `WorkExperience`. The component checks `Astro.slots.has('default')` and conditionally renders the `<details>/<summary>` accordion wrapping `<slot />`.

- [ ] **Step 2: Verify the build**

Run: `bun run build`
Expected: Build succeeds. The experience page renders with content collection data.

- [ ] **Step 3: Verify visually**

Run: `bun run dev`
Visit: `http://localhost:4321/experience`
Expected: Timeline-integrated cards for FloSports, GM, Lynntech. "Other Experience" compact list at the bottom. FloSports card has working "Show all projects" accordion.

- [ ] **Step 4: Commit**

```bash
git add src/pages/experience.astro
git commit -m "feat: update experience page to use content collection"
```

---

### Task 7: Update home page timeline to auto-generate from collection

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace the hardcoded "My Journey" section**

In `src/pages/index.astro`, the "My Journey" section (lines ~39-85) is currently hardcoded HTML. Replace it with a collection-driven version. Add the collection import at the top of the frontmatter:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

const professional = (await getCollection('experience'))
  .filter((e) => e.data.category === 'professional')
  .sort((a, b) => a.data.sortOrder - b.data.sortOrder);

function formatYearRange(start: string, end: string | null): string {
  const startYear = start.split('-')[0];
  const endYear = end ? end.split('-')[0] : 'Present';
  return `${startYear}\u2013${endYear}`;
}
---
```

Then replace the "My Journey" section (from `<!-- My Journey Timeline -->` through the closing `</section>`) with:

```astro
    <!-- My Journey Timeline -->
    <section class="mb-16">
      <h2 class="text-2xl font-semibold text-rp-text mb-6 pb-2 border-b border-rp-highlight-med">
        My Journey
      </h2>
      <div class="border-l-2 border-rp-rose ml-4 pl-8 space-y-8">
        {professional.map((entry) => (
          <a href={`/experience#${entry.id}`} class="block group relative hover:-translate-y-0.5 transition-transform duration-200">
            <div class="absolute -left-[2.6rem] top-1.5 w-3 h-3 rounded-full bg-rp-rose ring-4 ring-rp-base"></div>
            <p class="text-sm font-mono text-rp-muted mb-1">{formatYearRange(entry.data.startDate, entry.data.endDate)}</p>
            <h3 class="text-lg font-semibold text-rp-text group-hover:text-rp-rose transition-colors">{entry.data.company}</h3>
            <p class="text-rp-subtle leading-relaxed">{entry.data.summary}</p>
          </a>
        ))}

        {/* Texas A&M — hardcoded, not work experience */}
        <div class="relative">
          <div class="absolute -left-[2.6rem] top-1.5 w-3 h-3 rounded-full bg-rp-rose ring-4 ring-rp-base"></div>
          <p class="text-sm font-mono text-rp-muted mb-1">2012&ndash;2017</p>
          <h3 class="text-lg font-semibold text-rp-text">Texas A&amp;M University</h3>
          <p class="text-rp-subtle leading-relaxed">
            B.S. Physics with Math Minor. Started with Higgs Boson simulations in the Department of Physics and Astronomy, running C++ and Bash on distributed computing clusters.
          </p>
        </div>
      </div>
    </section>
```

Keep the rest of `index.astro` (Hero, Intro, Skills, Awards sections) unchanged.

- [ ] **Step 2: Verify the build**

Run: `bun run build`
Expected: Build succeeds

- [ ] **Step 3: Verify visually**

Run: `bun run dev`
Visit: `http://localhost:4321/`
Expected: "My Journey" timeline shows FloSports, GM, Lynntech (from collection) + Texas A&M (hardcoded). Links go to `/experience#flosports`, `/experience#general-motors`, `/experience#lynntech`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: auto-generate home page timeline from experience collection"
```

---

### Task 8: Update LLMs.txt endpoints

**Files:**
- Modify: `src/pages/llms.txt.ts`
- Modify: `src/pages/llms-full.txt.ts`

- [ ] **Step 1: Update `llms.txt.ts`**

In `src/pages/llms.txt.ts`, replace the `workExperiences` import and usage.

Remove:
```typescript
import { workExperiences } from '../data/workExperience';
```

Add to the imports:
```typescript
import { getCollection } from 'astro:content';
```

Inside the `GET` function, after the `publishedPosts` block, add:
```typescript
const experiences = (await getCollection('experience'))
  .filter((e) => e.data.category === 'professional')
  .sort((a, b) => a.data.sortOrder - b.data.sortOrder);
```

Replace the experience section (lines 36-41):
```typescript
'## Experience',
`- [Experience](${site}/experience)`,
...experiences.map(
  (e) =>
    `- ${e.data.company} — ${e.data.title} (${e.data.startDate}–${e.data.endDate ?? 'Present'})`
),
```

- [ ] **Step 2: Update `llms-full.txt.ts`**

In `src/pages/llms-full.txt.ts`, make the same import change.

Remove:
```typescript
import { workExperiences } from '../data/workExperience';
```

Add:
```typescript
import { getCollection } from 'astro:content';
```

Inside the `GET` function, add (include all categories since this is the full LLM context endpoint):
```typescript
const experiences = (await getCollection('experience'))
  .sort((a, b) => a.data.sortOrder - b.data.sortOrder);
```

Replace the work experience section (lines 59-77):
```typescript
sections.push('## Work Experience', '');
for (const entry of experiences) {
  sections.push(
    `### ${entry.data.company} — ${entry.data.title}`,
    `${entry.data.startDate}–${entry.data.endDate ?? 'Present'}`,
    ...(entry.data.url ? [entry.data.url] : []),
    ''
  );
  if (entry.data.promotions) {
    sections.push(
      '**Promotions:**',
      ...entry.data.promotions.map((p) => `- ${p.title} (${p.date})`),
      ''
    );
  }
  if (entry.data.highlights) {
    for (const h of entry.data.highlights) {
      sections.push(`**${h.title}**`, h.description, '');
    }
  }
  // Include the full markdown body for entries that have it (e.g., FloSports detailed projects)
  if (entry.body && entry.body.trim()) {
    sections.push(entry.body, '');
  }
}
```

- [ ] **Step 3: Verify the build**

Run: `bun run build`
Expected: Build succeeds with no import errors

- [ ] **Step 4: Verify the endpoints**

Run: `bun run dev`
Visit: `http://localhost:4321/llms.txt` and `http://localhost:4321/llms-full.txt`
Expected: Both render work experience from the collection data. No references to the old TypeScript types.

- [ ] **Step 5: Commit**

```bash
git add src/pages/llms.txt.ts src/pages/llms-full.txt.ts
git commit -m "feat: update llms.txt endpoints to use experience collection"
```

---

### Task 9: Delete old data file and verify

**Files:**
- Delete: `src/data/workExperience.ts`

- [ ] **Step 1: Delete the old data file**

```bash
rm src/data/workExperience.ts
```

- [ ] **Step 2: Verify no remaining imports**

```bash
grep -r "workExperience" src/
```

Expected: No results. If any file still imports `workExperience`, fix it before proceeding.

- [ ] **Step 3: Full build verification**

Run: `bun run build`
Expected: Clean build with no errors

- [ ] **Step 4: Full visual verification**

Run: `bun run dev`

Check all affected pages:
- `http://localhost:4321/` — Home page timeline auto-generates correctly
- `http://localhost:4321/experience` — Professional cards + Other Experience list
- `http://localhost:4321/llms.txt` — Experience section renders
- `http://localhost:4321/llms-full.txt` — Full experience details render

- [ ] **Step 5: Commit**

```bash
git rm src/data/workExperience.ts
git commit -m "chore: remove old workExperience.ts data file

Replaced by experience content collection in src/content/experience/"
```

---

### Task 10: Final polish and type check

- [ ] **Step 1: Run type checking**

Run: `bun run check`
Expected: No TypeScript errors

- [ ] **Step 2: Run full build**

Run: `bun run build`
Expected: Clean build, no warnings related to experience data

- [ ] **Step 3: Visual review of all pages**

Start dev server and review:
- Home page timeline alignment and styling
- Experience cards: timeline bar, promotion dots, highlights, accordion
- Accordion expand/collapse works, prose styling matches site theme
- Other Experience section: compact, clean, no visual clutter
- LLMs.txt endpoints: data renders correctly
- Both light and dark themes look correct

- [ ] **Step 4: Fix any issues found during review**

Address any visual or functional issues discovered.

- [ ] **Step 5: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: polish experience page visual details"
```
