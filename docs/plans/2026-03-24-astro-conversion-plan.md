# SvelteKit to Astro Conversion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert jordangarrison.dev from SvelteKit 2/Svelte 5/Sveltestrap to Astro 5 with Tailwind CSS and Rose Pine theming.

**Architecture:** Pure static Astro 5 site with no adapter. Tailwind CSS for styling with Rose Pine Dawn (light) / Rose Pine (dark) via CSS custom properties and class-based dark mode. Content Collections for blog, TypeScript data files for portfolio and work experience. Bun as package manager, Nix flake devshell.

**Tech Stack:** Astro 5, Tailwind CSS v4, @tailwindcss/typography, Rose Pine palette, Plus Jakarta Sans + Source Code Pro fonts, Bun, Nix, TypeScript

**Design Doc:** `docs/plans/2026-03-24-astro-conversion-design.md`

---

## Task 1: Project Scaffold — Nix Flake & Astro Init

**Files:**
- Rewrite: `flake.nix`
- Delete: `svelte.config.js`, `vite.config.js`, `package.json`, `package-lock.json`
- Create: `astro.config.mjs`, `tsconfig.json` (Astro version)

**Step 1: Update flake.nix devshell to provide bun**

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            bun
          ];

          shellHook = ''
            echo "jordangarrison.dev dev shell loaded"
            echo "  bun: $(bun --version)"
          '';
        };
      }
    );
}
```

**Step 2: Remove old SvelteKit files and initialize Astro**

Run:
```bash
# Remove SvelteKit-specific files
rm -f svelte.config.js vite.config.js package.json package-lock.json .eslintrc.cjs .prettierrc .prettierignore
rm -rf node_modules src .svelte-kit

# Create fresh Astro project in current dir
# Use bun create to scaffold
bun create astro@latest . -- --template minimal --no-install --no-git --typescript strict
```

**Step 3: Install dependencies**

Run:
```bash
bun install
bun add @tailwindcss/typography
bun add @fontsource/plus-jakarta-sans @fontsource-variable/source-code-pro
```

**Step 4: Add Tailwind CSS**

Run:
```bash
bunx astro add tailwind --yes
```

**Step 5: Configure astro.config.mjs**

```javascript
import { defineConfig } from 'astro/config';
import tailwindcss from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwindcss()],
  site: 'https://jordangarrison.dev',
});
```

**Step 6: Verify scaffold builds**

Run: `bun run build`
Expected: Build completes successfully

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro 5 project with Tailwind, bun, and Nix flake"
```

---

## Task 2: Rose Pine Theme & Global CSS

**Files:**
- Create: `src/styles/global.css`
- Create: `src/styles/theme.css`

**Step 1: Create Rose Pine theme CSS custom properties**

Create `src/styles/theme.css`:

```css
/* Rose Pine Dawn (Light) — default */
:root,
.light {
  --rp-base: #faf4ed;
  --rp-surface: #fffaf3;
  --rp-overlay: #f2e9e1;
  --rp-muted: #9893a5;
  --rp-subtle: #797593;
  --rp-text: #575279;
  --rp-love: #b4637a;
  --rp-gold: #ea9d34;
  --rp-rose: #d7827e;
  --rp-pine: #286983;
  --rp-foam: #56949f;
  --rp-iris: #907aa9;
  --rp-highlight-low: #f4ede8;
  --rp-highlight-med: #dfdad9;
  --rp-highlight-high: #cecacd;
}

/* Rose Pine (Dark) */
.dark {
  --rp-base: #191724;
  --rp-surface: #1f1d2e;
  --rp-overlay: #26233a;
  --rp-muted: #6e6a86;
  --rp-subtle: #908caa;
  --rp-text: #e0def4;
  --rp-love: #eb6f92;
  --rp-gold: #f6c177;
  --rp-rose: #ebbcba;
  --rp-pine: #31748f;
  --rp-foam: #9ccfd8;
  --rp-iris: #c4a7e7;
  --rp-highlight-low: #21202e;
  --rp-highlight-med: #403d52;
  --rp-highlight-high: #524f67;
}
```

**Step 2: Create global CSS with Tailwind imports and base styles**

Create `src/styles/global.css`:

```css
@import "tailwindcss";
@import "./theme.css";

/* Font imports */
@import "@fontsource/plus-jakarta-sans/400.css";
@import "@fontsource/plus-jakarta-sans/500.css";
@import "@fontsource/plus-jakarta-sans/600.css";
@import "@fontsource/plus-jakarta-sans/700.css";
@import "@fontsource-variable/source-code-pro";

/* Tailwind theme extension */
@theme {
  --font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-mono: 'Source Code Pro Variable', 'Source Code Pro', ui-monospace, monospace;

  --color-rp-base: var(--rp-base);
  --color-rp-surface: var(--rp-surface);
  --color-rp-overlay: var(--rp-overlay);
  --color-rp-muted: var(--rp-muted);
  --color-rp-subtle: var(--rp-subtle);
  --color-rp-text: var(--rp-text);
  --color-rp-love: var(--rp-love);
  --color-rp-gold: var(--rp-gold);
  --color-rp-rose: var(--rp-rose);
  --color-rp-pine: var(--rp-pine);
  --color-rp-foam: var(--rp-foam);
  --color-rp-iris: var(--rp-iris);
  --color-rp-highlight-low: var(--rp-highlight-low);
  --color-rp-highlight-med: var(--rp-highlight-med);
  --color-rp-highlight-high: var(--rp-highlight-high);
}

/* Base styles */
@layer base {
  html {
    font-family: var(--font-sans);
    scroll-behavior: smooth;
  }

  body {
    background-color: var(--rp-base);
    color: var(--rp-text);
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  a {
    color: var(--rp-rose);
    transition: color 0.2s ease;
  }

  a:hover {
    color: var(--rp-love);
  }

  ::selection {
    background-color: var(--rp-highlight-med);
    color: var(--rp-text);
  }
}
```

**Step 3: Verify build**

Run: `bun run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/styles/
git commit -m "feat: add Rose Pine theme CSS custom properties and global styles"
```

---

## Task 3: Base Layout with Theme Toggle

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/ThemeToggle.astro`
- Create: `src/components/Navbar.astro`
- Create: `src/components/Footer.astro`

**Step 1: Create ThemeToggle component**

Create `src/components/ThemeToggle.astro`:

```astro
---
---
<button
  id="theme-toggle"
  type="button"
  aria-label="Toggle dark mode"
  class="p-2 rounded-lg hover:bg-rp-highlight-low transition-colors cursor-pointer"
>
  <!-- Sun icon (shown in dark mode) -->
  <svg id="sun-icon" class="hidden w-5 h-5 text-rp-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
  <!-- Moon icon (shown in light mode) -->
  <svg id="moon-icon" class="hidden w-5 h-5 text-rp-iris" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
</button>

<script>
  function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    function updateIcons() {
      const isDark = document.documentElement.classList.contains('dark');
      sunIcon?.classList.toggle('hidden', !isDark);
      moonIcon?.classList.toggle('hidden', isDark);
    }

    toggle?.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      document.documentElement.classList.toggle('dark', !isDark);
      document.documentElement.classList.toggle('light', isDark);
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
      updateIcons();
    });

    updateIcons();
  }

  initTheme();
  document.addEventListener('astro:after-swap', initTheme);
</script>
```

**Step 2: Create Navbar component**

Create `src/components/Navbar.astro`:

```astro
---
import ThemeToggle from './ThemeToggle.astro';

const navLinks = [
  { href: '/experience', label: 'Experience' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const currentPath = Astro.url.pathname;
---

<nav class="sticky top-0 z-50 backdrop-blur-md bg-rp-base/80 border-b border-rp-highlight-med">
  <div class="max-w-5xl mx-auto px-4 sm:px-6">
    <div class="flex items-center justify-between h-16">
      <a href="/" class="font-mono text-lg font-semibold text-rp-text hover:text-rp-rose no-underline transition-colors">
        jordangarrison.dev
      </a>

      <!-- Desktop nav -->
      <div class="hidden md:flex items-center gap-6">
        {navLinks.map(link => (
          <a
            href={link.href}
            class:list={[
              'text-sm font-medium transition-colors no-underline',
              currentPath.startsWith(link.href) ? 'text-rp-rose' : 'text-rp-subtle hover:text-rp-text'
            ]}
          >
            {link.label}
          </a>
        ))}
        <a
          href="https://raw.githubusercontent.com/jordangarrison/resume/main/resume.pdf"
          download="jordan-garrison-resume.pdf"
          class="text-sm font-medium text-rp-subtle hover:text-rp-text transition-colors no-underline"
        >
          Resume
        </a>
        <ThemeToggle />
      </div>

      <!-- Mobile hamburger -->
      <div class="flex items-center gap-2 md:hidden">
        <ThemeToggle />
        <button
          id="mobile-menu-btn"
          type="button"
          aria-label="Toggle menu"
          class="p-2 rounded-lg hover:bg-rp-highlight-low transition-colors cursor-pointer"
        >
          <svg class="w-6 h-6 text-rp-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path id="hamburger-icon" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            <path id="close-icon" class="hidden" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div id="mobile-menu" class="hidden md:hidden pb-4">
      <div class="flex flex-col gap-2">
        {navLinks.map(link => (
          <a
            href={link.href}
            class:list={[
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors no-underline',
              currentPath.startsWith(link.href) ? 'text-rp-rose bg-rp-highlight-low' : 'text-rp-subtle hover:text-rp-text hover:bg-rp-highlight-low'
            ]}
          >
            {link.label}
          </a>
        ))}
        <a
          href="https://raw.githubusercontent.com/jordangarrison/resume/main/resume.pdf"
          download="jordan-garrison-resume.pdf"
          class="px-3 py-2 rounded-lg text-sm font-medium text-rp-subtle hover:text-rp-text hover:bg-rp-highlight-low transition-colors no-underline"
        >
          Resume
        </a>
      </div>
    </div>
  </div>
</nav>

<script>
  function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');

    btn?.addEventListener('click', () => {
      menu?.classList.toggle('hidden');
      hamburgerIcon?.classList.toggle('hidden');
      closeIcon?.classList.toggle('hidden');
    });
  }

  initMobileMenu();
  document.addEventListener('astro:after-swap', initMobileMenu);
</script>
```

**Step 3: Create Footer component**

Create `src/components/Footer.astro`:

```astro
---
const currentYear = new Date().getFullYear();
---

<footer class="border-t border-rp-highlight-med bg-rp-base/80 backdrop-blur-md">
  <div class="max-w-5xl mx-auto px-4 py-8 sm:py-12">
    <div class="flex flex-col items-center gap-4">
      <div class="flex gap-6">
        <a
          href="https://github.com/jordangarrison"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="GitHub Profile"
          class="text-rp-muted hover:text-rp-text transition-colors"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        </a>
        <a
          href="https://linkedin.com/in/jordan-garrison"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="LinkedIn Profile"
          class="text-rp-muted hover:text-rp-text transition-colors"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>
        <a
          href="mailto:hello@jordangarrison.dev"
          aria-label="Send Email"
          class="text-rp-muted hover:text-rp-text transition-colors"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </a>
      </div>
      <p class="text-sm text-rp-muted">
        &copy; {currentYear} <a href="/" class="hover:text-rp-text no-underline">jordangarrison.dev</a>
      </p>
    </div>
  </div>
</footer>
```

**Step 4: Create BaseLayout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import Navbar from '../components/Navbar.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = "Jordan Garrison — Engineer, lifelong learner, relentlessly curious." } = Astro.props;
---

<!doctype html>
<html lang="en" class="light">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <title>{title}</title>

    <!-- Prevent FOUC: apply theme before render -->
    <script is:inline>
      (function() {
        const saved = localStorage.getItem('theme');
        const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const theme = saved || preferred;
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
      })();
    </script>
  </head>
  <body class="min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

**Step 5: Update the index page to use BaseLayout**

Replace `src/pages/index.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Jordan Garrison">
  <h1 class="text-2xl font-bold">Coming soon...</h1>
</BaseLayout>
```

**Step 6: Verify dev server works**

Run: `bun run dev`
Expected: Site loads at localhost with Rose Pine theme, navbar, footer, and theme toggle works

**Step 7: Commit**

```bash
git add src/layouts/ src/components/ src/pages/index.astro
git commit -m "feat: add BaseLayout with Navbar, Footer, and Rose Pine theme toggle"
```

---

## Task 4: Data Files — Portfolio & Work Experience

**Files:**
- Create: `src/data/portfolio.ts`
- Create: `src/data/workExperience.ts`

**Step 1: Create portfolio data file**

Create `src/data/portfolio.ts` — copy the existing types and data from the SvelteKit project. The file should contain:
- `PortfolioProject` type
- `PortfolioCategory` type
- `PortfolioGroup` type
- `toolsProjects`, `nixProjects`, `aiProjects` arrays
- `projectGroups` export

Copy exact contents from the old `src/lib/portfolio.model.ts` and `src/lib/portfolio.data.ts`, merging them into one file.

**Step 2: Create work experience data file**

Create `src/data/workExperience.ts` — copy the existing types and data from the SvelteKit project. The file should contain:
- `WE`, `WEMeta`, `WEBody`, `WEDate`, `WEPromotion` types
- `workExperiences` array

Copy exact contents from the old `src/lib/WorkExperience.model.ts` and `src/lib/workExperience.data.ts`, merging them into one file. Change `import type { WE } from './WorkExperience.model'` to just use the local type.

**Step 3: Verify build**

Run: `bun run build`
Expected: Build succeeds (data files are valid TypeScript)

**Step 4: Commit**

```bash
git add src/data/
git commit -m "feat: migrate portfolio and work experience data files"
```

---

## Task 5: Home Page

**Files:**
- Rewrite: `src/pages/index.astro`

**Step 1: Build the full home page**

Rewrite `src/pages/index.astro` with all sections from the current SvelteKit home page:
- Hero section with profile image and tagline
- Intro card with grug-brained philosophy link
- "My Journey" timeline (FloSports, GM, Lynntech, Texas A&M)
- Skills section with category cards and badges
- Awards & Certifications list

Use Tailwind classes with Rose Pine color variables (`text-rp-text`, `bg-rp-surface`, etc.).

Key design details:
- Profile image: `https://avatars.githubusercontent.com/u/22905777?v=4`
- Timeline uses `border-l` with `before:` pseudo-elements for dots in Rose Pine rose color
- Skill badges use `font-mono` (Source Code Pro) with colored backgrounds
- Journey items that link to experience page use `<a>` tags with hover effects

**Step 2: Verify in dev server**

Run: `bun run dev`
Expected: Home page renders all sections with Rose Pine theming, theme toggle works

**Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: implement home page with hero, journey, skills, and awards"
```

---

## Task 6: Experience Page & WorkExperience Component

**Files:**
- Create: `src/components/WorkExperience.astro`
- Create: `src/pages/experience.astro`

**Step 1: Create WorkExperience component**

Create `src/components/WorkExperience.astro` — a card component that receives a `WE` object and renders:
- Company logo (80x80, rounded, bordered)
- Position title, company name (linked), promotion chain with arrows
- Date range badge
- Achievement items as cards with title and description

Use Tailwind with Rose Pine colors. Keep the same visual structure as the Svelte component but with the new warm theme.

**Step 2: Create Experience page**

Create `src/pages/experience.astro`:
- Import `BaseLayout` and `WorkExperience` component
- Import `workExperiences` from data file
- Page title: "Work Experience"
- Subtitle: "My professional journey through tech"
- Loop through `workExperiences` and render `WorkExperience` components
- Each work experience card gets an `id` attribute matching `meta.id` for anchor links

**Step 3: Verify in dev server**

Run: `bun run dev`
Navigate to `/experience`
Expected: All 3 work experiences render with logos, promotions, achievements

**Step 4: Commit**

```bash
git add src/components/WorkExperience.astro src/pages/experience.astro
git commit -m "feat: implement experience page with work experience cards"
```

---

## Task 7: Portfolio Page with Client-Side Filtering

**Files:**
- Create: `src/components/PortfolioCard.astro`
- Create: `src/pages/portfolio.astro`

**Step 1: Create PortfolioCard component**

Create `src/components/PortfolioCard.astro` — receives a `PortfolioProject` and renders:
- Title in card header
- Description
- Features list
- Tech stack badges (using `font-mono`)
- Action buttons: View Source (always), Live Demo (if `liveUrl`), Download (if `downloadUrl`)

**Step 2: Create Portfolio page with filter tabs**

Create `src/pages/portfolio.astro`:
- Import `BaseLayout` and `PortfolioCard`
- Import `projectGroups` from data file
- Render all groups and projects statically
- Add filter tabs: All, Tools, Nix Ecosystem, AI & Fun
- Client-side filtering via inline `<script>` that toggles `hidden` class on project groups based on active tab
- Each project group wrapped in a `<div data-category="tools|nix|ai">` for easy filtering

**Step 3: Verify in dev server**

Run: `bun run dev`
Navigate to `/portfolio`
Expected: All 15 projects render, filter tabs work to show/hide categories

**Step 4: Commit**

```bash
git add src/components/PortfolioCard.astro src/pages/portfolio.astro
git commit -m "feat: implement portfolio page with category filtering"
```

---

## Task 8: Blog — Content Collection Setup

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/blog/hello-world.md`

**Step 1: Create content collection config**

Create `src/content.config.ts`:

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

**Step 2: Migrate blog post**

Create `src/content/blog/hello-world.md` — copy from old `src/posts/hello-world.md`. Update the frontmatter `date` field to be a proper date (remove quotes if needed, Zod's `coerce.date()` handles strings).

**Step 3: Verify build**

Run: `bun run build`
Expected: Build succeeds, content collection is validated

**Step 4: Commit**

```bash
git add src/content.config.ts src/content/
git commit -m "feat: set up blog content collection with Zod schema"
```

---

## Task 9: Blog Listing Page

**Files:**
- Create: `src/components/BlogCard.astro`
- Create: `src/pages/blog/index.astro`

**Step 1: Create BlogCard component**

Create `src/components/BlogCard.astro`:
- Accepts `post` prop (content collection entry)
- Renders: date, reading time, title, excerpt, category/tag badges
- Wrapped in `<a>` linking to `/blog/{post.id}`
- Hover effects: shadow and translateY

**Step 2: Create blog listing page**

Create `src/pages/blog/index.astro`:
- Import `getCollection` from `astro:content`
- Fetch all published blog posts, sort by date descending
- Page title: "Blog"
- Subtitle: "Thoughts on engineering, Nix, DevOps, and more"
- Render search input + category filter tabs (client-side filtering via inline script)
- 2-column grid of `BlogCard` components
- Client-side pagination (6 posts per page)
- Posts have `data-categories` attribute for filtering

**Step 3: Verify in dev server**

Run: `bun run dev`
Navigate to `/blog`
Expected: Blog listing shows the hello-world post with proper formatting

**Step 4: Commit**

```bash
git add src/components/BlogCard.astro src/pages/blog/
git commit -m "feat: implement blog listing page with search and filtering"
```

---

## Task 10: Blog Post Page

**Files:**
- Create: `src/layouts/BlogPostLayout.astro`
- Create: `src/pages/blog/[...slug].astro`

**Step 1: Create BlogPostLayout**

Create `src/layouts/BlogPostLayout.astro`:
- Extends `BaseLayout` with post title
- Renders: back link, title, date, reading time, category/tag badges
- `<slot />` for the rendered markdown content
- Prose styling via `@tailwindcss/typography` (`prose` class) with Rose Pine customizations
- Back to blog button in footer

**Step 2: Create dynamic blog post page**

Create `src/pages/blog/[...slug].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import BlogPostLayout from '../../layouts/BlogPostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts
    .filter(post => post.data.published)
    .map(post => ({
      params: { slug: post.id },
      props: { post },
    }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<BlogPostLayout frontmatter={post.data}>
  <Content />
</BlogPostLayout>
```

**Step 3: Verify in dev server**

Run: `bun run dev`
Navigate to `/blog/hello-world`
Expected: Blog post renders with title, metadata, styled markdown content

**Step 4: Commit**

```bash
git add src/layouts/BlogPostLayout.astro src/pages/blog/
git commit -m "feat: implement blog post page with content collection rendering"
```

---

## Task 11: Contact Page

**Files:**
- Create: `src/pages/contact.astro`

**Step 1: Create Contact page**

Create `src/pages/contact.astro`:
- Import `BaseLayout`
- Simple page with "Let's get in touch!" heading
- Social links (GitHub, LinkedIn, Email) with icons matching the footer style but larger
- Keep it simple and clean

**Step 2: Verify in dev server**

Run: `bun run dev`
Navigate to `/contact`
Expected: Contact page renders with heading and social links

**Step 3: Commit**

```bash
git add src/pages/contact.astro
git commit -m "feat: implement contact page"
```

---

## Task 12: Static Assets & Cleanup

**Files:**
- Move: `static/favicon.ico` → `public/favicon.ico`
- Delete: old SvelteKit files if any remain

**Step 1: Move static assets**

Ensure `public/favicon.ico` exists. If the old `static/` directory is still around, move assets from it to `public/`.

**Step 2: Clean up any remaining SvelteKit artifacts**

Remove any leftover SvelteKit directories or files:
- `src/routes/` (old SvelteKit routes)
- `src/lib/` (old SvelteKit lib)
- `src/posts/` (migrated to content collection)
- `static/` (migrated to public)
- `.svelte-kit/`

**Step 3: Update CLAUDE.md**

Update the project `CLAUDE.md` to reflect the new Astro project structure, commands, and architecture.

**Step 4: Full build verification**

Run: `bun run build`
Expected: Clean build with no warnings or errors

Run: `bun run preview`
Expected: All pages load and render correctly:
- `/` — Home page with hero, journey, skills, awards
- `/experience` — Work experience cards
- `/portfolio` — Project cards with filtering
- `/blog` — Blog listing
- `/blog/hello-world` — Blog post
- `/contact` — Contact page
- Theme toggle works on all pages
- Mobile nav works
- Resume download link works

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: clean up SvelteKit artifacts and update project docs"
```

---

## Task 13: Final Polish & Prose Styling

**Files:**
- Modify: `src/styles/global.css` (add prose customization)

**Step 1: Add Tailwind Typography prose customization for Rose Pine**

Add to `src/styles/global.css` custom prose styles that use Rose Pine colors for:
- Headings, links, bold text, code blocks, blockquotes
- Code block backgrounds using `--rp-overlay`
- Inline code using `--rp-highlight-med`

**Step 2: Visual review all pages**

Walk through every page in both light and dark modes. Fix any styling issues.

**Step 3: Final build**

Run: `bun run build`
Expected: Clean build

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Rose Pine prose styling and final polish"
```
