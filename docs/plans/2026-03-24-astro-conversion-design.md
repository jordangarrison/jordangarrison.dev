# Astro Conversion Design

## Overview

Convert jordangarrison.dev from SvelteKit 2 / Svelte 5 / Sveltestrap to Astro 5 with Tailwind CSS, Rose Pine theming, and bun as the package manager. Pure static output with no adapter — deployable anywhere.

## Tech Stack

- **Framework**: Astro 5 (static output, no adapter)
- **Styling**: Tailwind CSS with `@tailwindcss/typography` plugin
- **Theme**: Rose Pine (dark) / Rose Pine Dawn (light) via CSS custom properties
- **Typography**: Plus Jakarta Sans (body/headings), Source Code Pro (code/monospace accents)
- **Package Manager**: Bun
- **Nix**: Flake devshell providing bun (matching ~/dev/jordangarrison/cg pattern)
- **Language**: TypeScript
- **Content**: Astro Content Collections for blog (Zod schema), TypeScript data files for portfolio/experience
- **Deployment**: Pure static `dist/` — no adapter, no SSR, deployable anywhere

## Project Structure

```
src/
├── components/           # Reusable Astro components
│   ├── Navbar.astro
│   ├── Footer.astro
│   ├── ThemeToggle.astro
│   ├── WorkExperience.astro
│   ├── PortfolioCard.astro
│   ├── BlogCard.astro
│   └── SkillCard.astro
├── content/
│   └── blog/             # Markdown blog posts (Content Collections)
│       └── hello-world.md
├── data/
│   ├── portfolio.ts      # Portfolio project data & types
│   └── workExperience.ts # Work experience data & types
├── layouts/
│   ├── BaseLayout.astro       # Root layout (html, head, nav, footer)
│   └── BlogPostLayout.astro   # Blog post wrapper
├── pages/
│   ├── index.astro            # Home/About page
│   ├── experience.astro       # Work experience page
│   ├── portfolio.astro        # Portfolio with category filtering
│   ├── contact.astro          # Contact page
│   └── blog/
│       ├── index.astro        # Blog listing with search/filter/pagination
│       └── [...slug].astro    # Individual blog post
├── styles/
│   └── global.css             # Tailwind imports + Rose Pine CSS custom properties
└── content.config.ts          # Blog collection schema (Zod)
```

## Theme: Rose Pine

### Color Strategy

CSS custom properties that swap based on `class="dark"` or `class="light"` on `<html>`:

**Rose Pine (Dark)**:
- Base: `#191724`
- Surface: `#1f1d2e`
- Overlay: `#26233a`
- Muted: `#6e6a86`
- Subtle: `#908caa`
- Text: `#e0def4`
- Love: `#eb6f92`
- Gold: `#f6c177`
- Rose: `#ebbcba`
- Pine: `#31748f`
- Foam: `#9ccfd8`
- Iris: `#c4a7e7`

**Rose Pine Dawn (Light)**:
- Base: `#faf4ed`
- Surface: `#fffaf3`
- Overlay: `#f2e9e1`
- Muted: `#9893a5`
- Subtle: `#797593`
- Text: `#575279`
- Love: `#b4637a`
- Gold: `#ea9d34`
- Rose: `#d7827e`
- Pine: `#286983`
- Foam: `#56949f`
- Iris: `#907aa9`

### Theme Switching

- Inline `<script>` in `<head>` to prevent FOUC: reads localStorage, falls back to `prefers-color-scheme`
- Toggle button in navbar (sun/moon icon) swaps `class` on `<html>` and persists to localStorage
- Tailwind dark mode configured with `class` strategy

## Layout & Navigation

### BaseLayout.astro

- Wraps every page
- `<html>` gets `class="dark"` or `class="light"`
- Loads fonts via `@fontsource/plus-jakarta-sans` and `@fontsource/source-code-pro`
- Global CSS with Rose Pine custom properties

### Navbar

- Sticky top with `backdrop-blur` background
- Brand: "jordangarrison.dev" in Source Code Pro
- Links: Experience, Portfolio, Blog, Contact, Resume (PDF download from GitHub)
- Theme toggle button (sun/moon icon)
- Mobile: hamburger menu with slide-down

### Footer

- Centered layout
- Social links: GitHub, LinkedIn, Email
- Copyright
- Subtle blurred background treatment

## Pages

### Home (index.astro)

- Hero: profile image (GitHub avatar), "Hi, I'm Jordan" heading, short tagline
- Intro paragraph with grug-brained philosophy reference
- "My Journey" section: vertical timeline with dates, roles, companies. Rose Pine accent colors for timeline line/dots
- Skills section: category cards (Languages, Platforms, IaC, Observability) with tech badges in Source Code Pro
- Awards & Certifications list

### Experience (experience.astro)

- Company cards: logo, title, date range, promotion history
- Project accomplishments listed under each company
- Card-based layout with surface background color

### Portfolio (portfolio.astro)

- Filter tabs: All, Tools, Nix Ecosystem, AI & Fun
- Responsive grid of project cards: title, description, tech stack badges (Source Code Pro), action links (Source, Live Demo, Download)
- Client-side filtering via small inline `<script>` (no framework island needed)

### Blog Listing (blog/index.astro)

- Search input + category filter tabs
- Card grid: date, reading time, title, excerpt, category/tag badges
- Pagination (6 posts per page)

### Blog Post (blog/[...slug].astro)

- Content Collection rendering via `getCollection()` + `render()`
- BlogPostLayout: title, date, reading time, categories, tags
- Tailwind Typography (`prose`) for styled markdown content
- "Back to blog" link

### Contact (contact.astro)

- "Let's get in touch" heading
- Social links / email
- Simple, clean

## Data & Content

### Blog (Content Collection)

Location: `src/content/blog/`

Zod schema in `content.config.ts`:
```ts
{
  title: z.string(),
  date: z.date(),
  excerpt: z.string(),
  categories: z.array(z.enum(['engineering', 'nix', 'devops', 'personal', 'tutorial'])),
  tags: z.array(z.string()),
  published: z.boolean(),
  readingTime: z.string(),
}
```

### Portfolio & Experience (TypeScript data files)

Existing TypeScript interfaces and data arrays migrate to `src/data/` with minimal changes. No Content Collections needed — these are build-time imports.

## Nix Flake

Devshell providing bun, matching the cg repo pattern:

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

## Design Principles

- **Readability first**: Good contrast, generous spacing, clear hierarchy
- **Warm & personal**: Rose Pine palette, friendly typography, personality in content
- **Nerdy touches**: Source Code Pro for code/tech elements, not terminal cosplay
- **Light & dark**: System preference respected, manual toggle, no FOUC
- **Static & portable**: No adapter, pure HTML output, deployable anywhere
- **YAGNI**: No SSR, no framework islands (unless actually needed), no over-engineering
