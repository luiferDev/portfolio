# Portfolio Architecture

## Overview

This portfolio uses **Feature-Sliced Design (FSD)** adapted for Astro's islands architecture. The structure prioritizes clear boundaries, scalability, and maintainability.

## Directory Structure

```
src/
├── app/                    # Application-level setup
│   └── layout/             # Layout wrappers (Layout.astro)
├── entities/               # Domain entity components
│   ├── project/            # Project entity (ProjectCard)
│   ├── profile/            # Profile entity (LuiferDev)
│   ├── experience/         # Experience entity (barrel)
│   ├── education/          # Education entity (barrel)
│   ├── certification/      # Certification entity (barrel)
│   └── index.ts            # Entity barrel exports
├── features/               # Interactive features
│   ├── language-switcher/  # LanguageSwitcher component
│   └── index.ts            # Feature barrel exports
├── widgets/                # Composite sections
│   ├── navbar/             # Navbar widget
│   ├── footer/             # Footer widget
│   ├── about/              # AboutSection widget
│   ├── experience/         # ExperienceSection widget
│   ├── education/          # EducationSection widget
│   ├── projects/           # ProjectsSection widget
│   ├── certifications/     # CertificationsSection widget
│   ├── skills/             # SkillsSection widget
│   └── index.ts            # Widget barrel exports
├── shared/                 # Shared code across all layers
│   ├── ui/                 # Reusable UI primitives
│   ├── lib/                # Shared utilities (sentry.ts)
│   ├── config/             # Configuration (i18n.ts)
│   ├── styles/             # Global styles (global.css)
│   └── index.ts            # Shared barrel exports
├── pages/                  # Astro pages (file-based routing)
├── content/                # Content collections (Markdown)
└── assets/                 # Static assets (images, SVGs)
```

## Import Rules (FSD)

Layers can only import from **lower or same-level** layers:

```
pages → widgets, entities, features, shared, app
widgets → entities, features, shared
features → entities, shared
entities → shared
shared → (nothing below)
app → widgets, entities, features, shared
```

**Never**: `shared` → `widgets`, `entities` → `features`, etc.

## Component Types

| Type | Layer | Purpose | Example |
|------|-------|---------|---------|
| **Entity** | `entities/` | Components representing domain objects | `ProjectCard`, `LuiferDev` |
| **Feature** | `features/` | Interactive user actions | `LanguageSwitcher` |
| **Widget** | `widgets/` | Composite sections combining entities/features | `Navbar`, `ProjectsSection` |
| **Shared** | `shared/` | Reusable utilities, config, styles | `i18n.ts`, `global.css`, `sentry.ts` |

## Styling Strategy

### Global CSS (`src/shared/styles/global.css`)
- Tailwind import: `@import 'tailwindcss'`
- CSS variables for design tokens (`--glass-bg`, `--palette-accent`, etc.)
- `@apply` only for **element-level resets** (`p`, `body`, `section`)
- `.glass-*` classes use **CSS variables** (not `@apply`) — these are truly reusable patterns

### Component Styling
- **Inline Tailwind utilities** in templates (preferred)
- Scoped `<style>` blocks in `.astro` components for complex selectors
- No CSS-in-JS, no CSS modules

## Data Flow

1. **Content Collections** (`src/content/`) → Zod-validated Markdown
2. **Pages** fetch data via `getCollection()` / `getEntry()` in frontmatter
3. **Widgets** receive data as typed props
4. **Entities** receive entity-specific data as typed props
5. **No client-side data fetching** — everything is build-time static

## Error Monitoring

- **Sentry** (`@sentry/astro`) configured in `astro.config.mjs`
- Initialized via `src/shared/lib/sentry.ts` (imported in Layout)
- Requires environment variables:
  - `PUBLIC_SENTRY_DSN` — Sentry DSN
  - `SENTRY_ORG` — Organization slug
  - `SENTRY_PROJECT` — Project name
  - `SENTRY_AUTH_TOKEN` — Auth token for source maps

## Animations

- **GSAP** loaded via CDN in Layout (`<script src="...">`)
- All animation scripts use `is:inline` (not bundled)
- **View Transitions disabled** — incompatible with GSAP/ScrollTrigger
- Animations initialized on `DOMContentLoaded` (not `astro:page-load`)

## Build & Development

```bash
bun dev        # Dev server (localhost:4321)
bun run build  # Production build
bun preview    # Preview production build
```

## Tech Stack

- **Astro 5** — Static site generator with islands architecture
- **TypeScript** — Strict mode (`astro/tsconfigs/strict`)
- **Tailwind CSS 4** — Utility-first CSS via `@tailwindcss/vite`
- **GSAP 3** — Animations (loaded via CDN)
- **Sentry** — Error tracking and performance monitoring
- **Astro Icon** — Icon component with Iconify
- **bun** — Package manager and runtime
