# jordangarrison.dev

[![SvelteKit](https://img.shields.io/badge/SvelteKit-2.49-FF3E00?logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![Svelte](https://img.shields.io/badge/Svelte-5.46-FF3E00?logo=svelte&logoColor=white)](https://svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Sveltestrap](https://img.shields.io/badge/Sveltestrap-Bootstrap-7952B3?logo=bootstrap&logoColor=white)](https://sveltestrap.js.org/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

A personal portfolio website showcasing my work experience, projects, and contact information.

**Live site:** [jordangarrison.dev](https://jordangarrison.dev)

## Features

- **About** - Landing page with personal introduction
- **Experience** - Professional work history with detailed accomplishments
- **Portfolio** - Project showcase with category filtering (Tools, Nix Ecosystem, AI & Fun)
- **Blog** - Personal blog
- **Contact** - Get in touch

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
npm run dev -- --open
```

## Code Quality

```bash
# Type checking
npm run check

# Lint (Prettier + ESLint)
npm run lint

# Format code
npm run format

# Run tests
npm run test
```

## Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── lib/                  # Shared components and data
│   ├── portfolio.model.ts
│   ├── portfolio.data.ts
│   ├── WorkExperience.model.ts
│   ├── workExperience.data.ts
│   └── *.svelte
└── routes/
    ├── +layout.svelte    # Root layout (navbar + footer)
    ├── +page.svelte      # Home/About page
    ├── experience/       # Work experience
    ├── portfolio/        # Projects with filtering
    ├── blog/             # Blog posts
    └── contact/          # Contact form
```

## License

MIT
