# AGENTS.md

This file provides guidance to AI coding assistants when working with code in this repository.

## Project Overview

This is a personal portfolio website built with SvelteKit 2 and Svelte 5, showcasing Jordan Garrison's work experience, projects, and contact information. The site uses Sveltestrap for UI components and is deployed to Vercel.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start dev server and open in browser
npm run dev -- --open

# Type checking
npm run check

# Type checking in watch mode
npm run check:watch

# Run tests
npm run test

# Lint code (Prettier + ESLint)
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Tech Stack

- **Framework**: SvelteKit 2.49.0 with Svelte 5.46.0
- **Language**: TypeScript with strict mode enabled
- **UI Components**: Sveltestrap (Bootstrap-based components)
- **Deployment**: Vercel (via @sveltejs/adapter-vercel, though adapter-auto is configured)
- **Testing**: Vitest
- **Build Tool**: Vite

### Svelte 5 Migration

This project uses Svelte 5 with the Component API v4 compatibility setting. Key Svelte 5 patterns in use:

- `$state()` for reactive state instead of `let` declarations
- `$props()` for component props with TypeScript types
- `{@render children?.()}` for slot rendering
- Modern snippet-based component composition

### Project Structure

```
src/
├── lib/
│   ├── portfolio.model.ts         # TypeScript types for portfolio projects
│   ├── portfolio.data.ts          # Portfolio project data by category
│   ├── WorkExperience.model.ts    # TypeScript types for work experience
│   ├── workExperience.data.ts     # Work experience content data
│   ├── WorkExperience.svelte      # Work experience component
│   └── workInProgress.svelte      # Work in progress indicator
├── routes/
│   ├── +layout.svelte             # Root layout with navbar and footer
│   ├── +page.svelte               # Home/About landing page
│   ├── +page.server.ts            # Home page server logic
│   ├── experience/                # Work experience page
│   ├── blog/                      # Blog page
│   ├── contact/                   # Contact page
│   └── portfolio/                 # Portfolio page with category filtering
```

### Layout Architecture

The root layout (`src/routes/+layout.svelte`) provides:

- Sveltestrap styles via `<Styles />` component
- Responsive navbar with mobile toggle (Experience, Portfolio, Blog, Contact, Resume)
- Main content area with 1024px max-width
- Footer with social links (GitHub, LinkedIn, Email)
- Resume download link (from GitHub repository)

### Data Models

Work experience data follows a structured model (see `WorkExperience.model.ts`):

- `WE`: Top-level work experience type
  - `meta`: Contains title, company, image, url, and date range
  - `body`: Array of project accomplishments with title and description

Portfolio data follows a structured model (see `portfolio.model.ts`):

- `PortfolioProject`: Individual project type
  - `id`: Unique identifier (number)
  - `title`: Project name
  - `description`: Project description
  - `githubUrl`: Link to source code (required)
  - `liveUrl`: Link to live demo (optional, can be null)
  - `downloadUrl`: Link to download/release (optional, can be null)
  - `techStack`: Array of technologies used
  - `features`: Array of feature descriptions
- `PortfolioCategory`: Category type (`'tools'` | `'nix'` | `'ai'`)
- `PortfolioGroup`: Groups projects by category
  - `key`: Category identifier
  - `title`: Display name for the category
  - `projects`: Array of PortfolioProject

Projects are organized in `portfolio.data.ts` by category arrays (`toolsProjects`, `nixProjects`, `aiProjects`) and exported as `projectGroups`.

### Portfolio Filtering

The portfolio page implements category-based filtering using Svelte 5 runes:

- `$state()` tracks the active filter (defaults to `'all'`)
- `$derived()` computes filtered groups based on the active filter
- Filter tabs: All, Tools, Nix Ecosystem, AI & Fun

### Styling Approach

- Bootstrap classes via Sveltestrap components
- Component-scoped styles in `<style>` blocks
- Responsive design with mobile-first breakpoints
- Consistent max-width of 1024px for content areas
- Light color scheme with `#fafafa` backgrounds

## Important Notes

### TypeScript Configuration

- Strict mode is enabled
- `verbatimModuleSyntax` is set to true (import type syntax required)
- Path aliases are handled by SvelteKit configuration

### Adapter Configuration

The project uses `adapter-auto` in `svelte.config.js`, which auto-detects the deployment environment. Given the Vercel adapter is installed as a dependency, it will likely use that in production.

### Component API Compatibility

The `svelte.config.js` sets `compatibility.componentApi: 4` to ensure Svelte 5 compatibility. When creating or modifying components, use Svelte 5 runes (`$state`, `$props`, `$derived`, etc.) rather than legacy patterns.

## Common Development Patterns

### Adding New Routes

Create a new directory under `src/routes/` with `+page.svelte`. Use `+page.server.ts` for server-side logic if needed.

### Adding to Portfolio

Edit `src/lib/portfolio.data.ts` and add new project objects to the appropriate category array:

- `toolsProjects`: Developer tools and utilities
- `nixProjects`: Nix ecosystem packages and configurations
- `aiProjects`: AI-powered projects and experiments

Each project must implement the `PortfolioProject` interface:

- Required fields: `id`, `title`, `description`, `githubUrl`, `techStack`, `features`
- Optional fields: `liveUrl`, `downloadUrl` (set to `null` if not applicable)

### Updating Work Experience

Edit `src/lib/workExperience.data.ts` to add or modify work experience entries. Follow the existing pattern with meta and body structure.

### Component Development

- Use Svelte 5 runes for state management
- Import Sveltestrap components from `@sveltestrap/sveltestrap`
- Use TypeScript interfaces for props with the `Props` naming convention
- Leverage component-scoped styles for styling
