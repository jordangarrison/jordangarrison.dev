# RSS Feed, LLMs.txt & Sitemap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add auto-generated RSS feed, LLMs.txt (map + full), and sitemap to jordangarrison.dev

**Architecture:** Four new build-time endpoints (`rss.xml`, `llms.txt`, `llms-full.txt`, sitemap) using Astro static API routes. All pull from existing data sources — blog content collections, `portfolio.ts`, `workExperience.ts`, and inline about data. `@astrojs/sitemap` handles sitemap generation as an integration.

**Tech Stack:** Astro 6, @astrojs/rss, @astrojs/sitemap, TypeScript, Bun

**Spec:** `docs/superpowers/specs/2026-03-25-rss-llms-txt-sitemap-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `package.json` | Modify | Add `@astrojs/rss`, `@astrojs/sitemap` dependencies |
| `astro.config.mjs` | Modify | Add `@astrojs/sitemap` integration |
| `src/pages/rss.xml.ts` | Create | RSS feed endpoint for published blog posts |
| `src/pages/llms.txt.ts` | Create | LLMs navigational map endpoint |
| `src/pages/llms-full.txt.ts` | Create | LLMs full content endpoint |
| `src/layouts/BaseLayout.astro` | Modify | Add RSS autodiscovery `<link>` in `<head>` |
| `src/components/Footer.astro` | Modify | Add RSS link for human discoverability |

---

### Task 1: Install dependencies and configure sitemap integration

**Files:**
- Modify: `package.json`
- Modify: `astro.config.mjs:1-11`

- [ ] **Step 1: Install @astrojs/rss and @astrojs/sitemap**

Run:
```bash
cd /home/jordangarrison/.grove/tasks/llms-txt/jordangarrison.dev && bun add @astrojs/rss @astrojs/sitemap
```

- [ ] **Step 2: Add sitemap integration to astro.config.mjs**

Update `astro.config.mjs` to:

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://jordangarrison.dev',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 3: Verify the build still works**

Run:
```bash
cd /home/jordangarrison/.grove/tasks/llms-txt/jordangarrison.dev && bun run build
```

Expected: Build succeeds. `dist/sitemap-index.xml` and `dist/sitemap-0.xml` are generated.

- [ ] **Step 4: Commit**

```bash
git add package.json bun.lock astro.config.mjs
git commit -m "feat: add @astrojs/rss and @astrojs/sitemap dependencies"
```

---

### Task 2: Create RSS feed endpoint

**Files:**
- Create: `src/pages/rss.xml.ts`

- [ ] **Step 1: Create `src/pages/rss.xml.ts`**

```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const allPosts = await getCollection('blog');
  const publishedPosts = allPosts
    .filter((post) => post.data.published)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'jordangarrison.dev',
    description:
      'Jordan Garrison — Engineer, lifelong learner, relentlessly curious.',
    site: context.site!.toString(),
    items: publishedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      categories: post.data.categories,
    })),
  });
}
```

- [ ] **Step 2: Build and verify RSS output**

Run:
```bash
cd /home/jordangarrison/.grove/tasks/llms-txt/jordangarrison.dev && bun run build && cat dist/rss.xml
```

Expected: Valid RSS XML with the "Hello World" blog post entry. Contains `<title>jordangarrison.dev</title>`, `<link>` to the blog post, `<pubDate>`, and `<category>personal</category>`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/rss.xml.ts
git commit -m "feat: add RSS feed endpoint for blog posts"
```

---

### Task 3: Add RSS autodiscovery and footer link

**Files:**
- Modify: `src/layouts/BaseLayout.astro:19-24` (inside `<head>`)
- Modify: `src/components/Footer.astro:8-46` (social links section)

- [ ] **Step 1: Add RSS autodiscovery link to BaseLayout.astro `<head>`**

In `src/layouts/BaseLayout.astro`, add after the `<link rel="icon">` tag (line 23), before `<title>`:

```html
<link rel="alternate" type="application/rss+xml" title="jordangarrison.dev" href="/rss.xml" />
```

The `<head>` should now be:

```html
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <link rel="icon" href="/favicon.ico" />
    <link rel="alternate" type="application/rss+xml" title="jordangarrison.dev" href="/rss.xml" />
    <title>{title}</title>
    ...
```

- [ ] **Step 2: Add RSS icon link to Footer.astro**

In `src/components/Footer.astro`, add a new RSS link after the Email link (after line 45, before the closing `</div>` of social links on line 46):

```astro
<!-- RSS -->
<a
  href="/rss.xml"
  aria-label="RSS Feed"
  class="text-rp-muted hover:text-rp-text transition-colors"
>
  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <circle cx="5" cy="19" r="2"></circle>
    <path d="M4 4a16 16 0 0 1 16 16"></path>
    <path d="M4 11a9 9 0 0 1 9 9"></path>
  </svg>
</a>
```

- [ ] **Step 3: Build and verify**

Run:
```bash
cd /home/jordangarrison/.grove/tasks/llms-txt/jordangarrison.dev && bun run build
```

Expected: Build succeeds. Check `dist/index.html` contains the RSS `<link>` tag in `<head>`. Check footer HTML contains the RSS link.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro src/components/Footer.astro
git commit -m "feat: add RSS autodiscovery link and footer RSS icon"
```

---

### Task 4: Create LLMs.txt navigational map endpoint

**Files:**
- Create: `src/pages/llms.txt.ts`

- [ ] **Step 1: Create `src/pages/llms.txt.ts`**

```ts
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { projectGroups } from '../data/portfolio';
import { workExperiences } from '../data/workExperience';

export async function GET(context: APIContext) {
  const site = context.site!.toString().replace(/\/$/, '');

  const allPosts = await getCollection('blog');
  const publishedPosts = allPosts
    .filter((post) => post.data.published)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const lines: string[] = [
    '# jordangarrison.dev',
    '',
    '> Jordan Garrison — Tech Lead & SRE at FloSports. Engineer, lifelong learner, relentlessly curious.',
    '',
    '## About',
    `- [Home](${site}/)`,
    '',
    '## Blog',
    `- [Blog Index](${site}/blog)`,
    ...publishedPosts.map(
      (post) => `- [${post.data.title}](${site}/blog/${post.id}/)`
    ),
    '',
    '## Portfolio',
    `- [Portfolio Index](${site}/portfolio)`,
    ...projectGroups.flatMap((group) =>
      group.projects.map(
        (project) => `- [${project.title}](${project.githubUrl})`
      )
    ),
    '',
    '## Experience',
    `- [Experience](${site}/experience)`,
    ...workExperiences.map(
      (we) =>
        `- ${we.meta.company} — ${we.meta.title} (${we.meta.date.start}–${we.meta.date.end})`
    ),
    '',
    '## Contact',
    `- [Contact](${site}/contact)`,
    `- Email: hello@jordangarrison.dev`,
    `- [GitHub](https://github.com/jordangarrison)`,
    `- [LinkedIn](https://linkedin.com/in/jordan-garrison)`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
```

- [ ] **Step 2: Build and verify output**

Run:
```bash
cd /home/jordangarrison/.grove/tasks/llms-txt/jordangarrison.dev && bun run build && cat dist/llms.txt
```

Expected: Plain text output with markdown-style headings, links to all pages, blog posts, portfolio projects, work experience entries, and contact info.

- [ ] **Step 3: Commit**

```bash
git add src/pages/llms.txt.ts
git commit -m "feat: add llms.txt navigational map endpoint"
```

---

### Task 5: Create LLMs-full.txt full content endpoint

**Files:**
- Create: `src/pages/llms-full.txt.ts`

- [ ] **Step 1: Create `src/pages/llms-full.txt.ts`**

```ts
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { projectGroups } from '../data/portfolio';
import { workExperiences } from '../data/workExperience';

export async function GET(context: APIContext) {
  const site = context.site!.toString().replace(/\/$/, '');

  const allPosts = await getCollection('blog');
  const publishedPosts = allPosts
    .filter((post) => post.data.published)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const sections: string[] = [];

  // Header
  sections.push(
    '# jordangarrison.dev',
    '',
    '> Jordan Garrison — Tech Lead & SRE at FloSports. Engineer, lifelong learner, relentlessly curious.',
    '',
    `Site: ${site}`,
    ''
  );

  // About
  sections.push(
    '## About',
    '',
    'Passionate about my family, Open Source, Linux, Jiu Jitsu, and being actively involved in my local church.',
    '',
    '"Complexity very bad. Say no to complexity."',
    '',
    '### Education',
    '',
    'Texas A&M University — B.S. Physics with Math Minor (2012–2017)',
    'Started with Higgs Boson simulations in the Department of Physics and Astronomy, running C++ and Bash on distributed computing clusters.',
    '',
    '### Skills',
    '',
    '- **Languages:** Go, TypeScript, Python, Bash, Ruby',
    '- **Platforms:** Kubernetes, Istio, Argo, Fastly, Kafka',
    '- **Infrastructure as Code:** Terraform, CDK, Helm, Kustomize, Nix',
    '- **Observability:** Datadog, Prometheus, Grafana, ELK',
    '',
    '### Awards & Certifications',
    '',
    '- Advanced GitOps Certification — Akuity, 2024',
    '- Promotion to Tech Lead — FloSports, 2023',
    '- Top Performer - Own It Award — FloSports, 2021',
    '- Promotion to Senior Infrastructure Engineer — FloSports, 2021',
    '- CEO Life Saving Award & CIO Safety Award — General Motors, 2019',
    '- Early Promotion from New College Hire Program — General Motors, 2019',
    '- CIO Distinguished New College Hire — General Motors, 2018 & 2019',
    ''
  );

  // Work Experience
  sections.push('## Work Experience', '');
  for (const we of workExperiences) {
    sections.push(
      `### ${we.meta.company} — ${we.meta.title}`,
      `${we.meta.date.start}–${we.meta.date.end}`,
      `${we.meta.url}`,
      ''
    );
    if (we.meta.promotions) {
      sections.push(
        '**Promotions:**',
        ...we.meta.promotions.map((p) => `- ${p.title} (${p.date})`),
        ''
      );
    }
    for (const item of we.body) {
      sections.push(`**${item.title}**`, item.description, '');
    }
  }

  // Portfolio
  sections.push('## Portfolio', '');
  for (const group of projectGroups) {
    sections.push(`### ${group.title}`, '');
    for (const project of group.projects) {
      sections.push(
        `#### ${project.title}`,
        '',
        project.description,
        '',
        `- **GitHub:** ${project.githubUrl}`,
        ...(project.liveUrl ? [`- **Live:** ${project.liveUrl}`] : []),
        ...(project.downloadUrl
          ? [`- **Download:** ${project.downloadUrl}`]
          : []),
        `- **Tech Stack:** ${project.techStack.join(', ')}`,
        `- **Features:** ${project.features.join('; ')}`,
        ''
      );
    }
  }

  // Blog Posts (full content)
  sections.push('## Blog Posts', '');
  for (const post of publishedPosts) {
    sections.push(
      `### ${post.data.title}`,
      '',
      `- **Date:** ${post.data.date.toISOString().split('T')[0]}`,
      `- **Categories:** ${post.data.categories.join(', ')}`,
      `- **Tags:** ${post.data.tags.join(', ')}`,
      `- **Reading Time:** ${post.data.readingTime}`,
      `- **URL:** ${site}/blog/${post.id}/`,
      '',
      post.body ?? '',
      ''
    );
  }

  // Contact
  sections.push(
    '## Contact',
    '',
    `- **Email:** hello@jordangarrison.dev`,
    `- **GitHub:** https://github.com/jordangarrison`,
    `- **LinkedIn:** https://linkedin.com/in/jordan-garrison`,
    `- **Web:** ${site}/contact`,
    ''
  );

  return new Response(sections.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
```

Note: `post.body` returns the raw markdown string from the Astro glob loader. If this is `undefined` at build time, we fall back to empty string. Verify in step 2.

- [ ] **Step 2: Build and verify output**

Run:
```bash
cd /home/jordangarrison/.grove/tasks/llms-txt/jordangarrison.dev && bun run build && cat dist/llms-full.txt
```

Expected: Full text file with all sections populated. Blog posts should include their full markdown body content. If `post.body` is undefined, we'll need to use `fs.readFileSync` to read the source `.md` files as a fallback (see advisory note in spec).

- [ ] **Step 3: Commit**

```bash
git add src/pages/llms-full.txt.ts
git commit -m "feat: add llms-full.txt full content endpoint"
```

---

### Task 6: Final build verification

**Files:** None (verification only)

- [ ] **Step 1: Clean build**

Run:
```bash
cd /home/jordangarrison/.grove/tasks/llms-txt/jordangarrison.dev && rm -rf dist && bun run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Verify all generated files exist**

Run:
```bash
ls -la dist/rss.xml dist/llms.txt dist/llms-full.txt dist/sitemap-index.xml dist/sitemap-0.xml
```

Expected: All five files exist and have non-zero size.

- [ ] **Step 3: Verify RSS is valid XML**

Run:
```bash
head -20 dist/rss.xml
```

Expected: Valid RSS XML starting with `<?xml version="1.0"` and containing `<rss version="2.0">`.

- [ ] **Step 4: Verify llms.txt has all sections**

Run:
```bash
grep "^##" dist/llms.txt
```

Expected output:
```
## About
## Blog
## Portfolio
## Experience
## Contact
```

- [ ] **Step 5: Verify llms-full.txt has blog content inlined**

Run:
```bash
grep -c "Welcome to My Blog" dist/llms-full.txt
```

Expected: `1` (confirming the full blog post body is present).

- [ ] **Step 6: Run type check**

Run:
```bash
cd /home/jordangarrison/.grove/tasks/llms-txt/jordangarrison.dev && bun run check
```

Expected: No type errors.

- [ ] **Step 7: Commit any remaining changes (if needed)**

If any fixes were made during verification:

```bash
git add -A
git commit -m "fix: address build verification issues"
```
