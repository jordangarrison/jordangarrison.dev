# AGENTS.md

This file provides guidance to AI coding assistants when working with code in this repository.

## Project Overview

This is a personal portfolio website built with Astro 6 and Tailwind CSS v4, showcasing Jordan Garrison's work experience, projects, and blog. The site uses Rose Pine theming (Dawn/Dark) and is deployed as a static site.

## Development Commands

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Type checking
bun run check
```

## Architecture

### Tech Stack

- **Framework**: Astro 6
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with Rose Pine theme (Dawn/Dark)
- **Typography**: Plus Jakarta Sans (body), Source Code Pro (code)
- **Blog**: Astro Content Collections with Zod schema validation
- **Package Manager**: Bun
- **Nix**: Flake devshell providing bun and tailwindcss
- **Deployment**: Static output (no adapter), deployable anywhere

### Project Structure

```
src/
├── components/          # Reusable Astro components
│   ├── Navbar.astro
│   ├── Footer.astro
│   ├── ThemeToggle.astro
│   ├── WorkExperience.astro
│   ├── PortfolioCard.astro
│   └── BlogCard.astro
├── content/
│   └── blog/            # Markdown blog posts (Content Collections)
├── data/
│   ├── portfolio.ts     # Portfolio project types & data
│   └── workExperience.ts # Work experience types & data
├── layouts/
│   ├── BaseLayout.astro       # Root layout (html, head, nav, footer)
│   └── BlogPostLayout.astro   # Blog post wrapper with prose styling
├── pages/
│   ├── index.astro            # Home/About page
│   ├── experience.astro       # Work experience page
│   ├── portfolio.astro        # Portfolio with category filtering
│   ├── contact.astro          # Contact page
│   └── blog/
│       ├── index.astro        # Blog listing
│       └── [...slug].astro    # Individual blog post
├── styles/
│   ├── global.css             # Tailwind imports, fonts, theme extension
│   └── theme.css              # Rose Pine CSS custom properties
└── content.config.ts          # Blog collection schema (Zod)
```

### Theming

- **Light mode**: Rose Pine Dawn (default)
- **Dark mode**: Rose Pine
- Theme is controlled by `class` on `<html>` (`light` or `dark`)
- CSS custom properties (`--rp-*`) swap per theme
- Tailwind utilities: `rp-base`, `rp-surface`, `rp-text`, `rp-rose`, `rp-love`, `rp-gold`, `rp-iris`, `rp-foam`, `rp-pine`, `rp-muted`, `rp-subtle`, etc.
- User preference stored in localStorage, falls back to system `prefers-color-scheme`

### Data Models

Portfolio data (`src/data/portfolio.ts`):
- `PortfolioProject`: id, title, description, githubUrl, liveUrl, downloadUrl, techStack, features
- `PortfolioCategory`: 'tools' | 'nix' | 'ai'
- `PortfolioGroup`: key, title, projects array
- Projects organized into toolsProjects, nixProjects, aiProjects

Work experience data (`src/data/workExperience.ts`):
- `WE`: meta + body array
- `WEMeta`: id, title, company, image, url, date range, optional promotions
- `WEBody`: title, description

Blog content (`src/content/blog/`):
- Markdown with Zod-validated frontmatter: title, date, excerpt, categories, tags, published, readingTime

## Common Development Patterns

### Adding New Blog Posts

Create a new `.md` file in `src/content/blog/` with frontmatter matching the schema in `src/content.config.ts`.

### Adding to Portfolio

Edit `src/data/portfolio.ts` and add new project objects to the appropriate category array.

### Updating Work Experience

Edit `src/data/workExperience.ts` to add or modify work experience entries.

### Adding New Pages

Create a new `.astro` file in `src/pages/`. Use `BaseLayout` for consistent layout.
