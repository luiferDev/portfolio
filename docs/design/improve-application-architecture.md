# Technical Design: Improve Application Architecture

**Status**: Draft  
**Date**: 2026-03-31  
**Derived From**: [Proposal](../proposals/improve-application-architecture.md) | [Specifications](../specs/improve-application-architecture.md)  
**Project**: Portfolio Website (Astro 5 + Tailwind CSS 4)

---

## Table of Contents

1. [Architecture Decisions](#1-architecture-decisions)
   - [AD-1: Feature-Sliced Design Adoption](#ad-1-feature-sliced-design-adoption)
   - [AD-2: Astro Islands + FSD Compatibility](#ad-2-astro-islands--fsd-compatibility)
   - [AD-3: Inline Tailwind Utilities Over @apply](#ad-3-inline-tailwind-utilities-over-apply)
   - [AD-4: Sentry Integration Strategy](#ad-4-sentry-integration-strategy)
   - [AD-5: Container/Presentational Pattern for Astro](#ad-5-containerpresentational-pattern-for-astro)
2. [Target Architecture Diagram](#2-target-architecture-diagram)
   - [Layer Relationships and Data Flow](#layer-relationships-and-data-flow)
   - [Component Hierarchy](#component-hierarchy)
   - [Dependency Direction Rules](#dependency-direction-rules)
3. [Implementation Details](#3-implementation-details)
   - [Directory Structure](#directory-structure)
   - [Import/Export Patterns and Conventions](#importexport-patterns-and-conventions)
   - [TypeScript Interface Patterns](#typescript-interface-patterns)
   - [Tailwind Configuration Changes](#tailwind-configuration-changes)
   - [Sentry Setup Steps](#sentry-setup-steps)
4. [Migration Strategy](#4-migration-strategy)
   - [Phase-by-Phase Plan](#phase-by-phase-plan)
   - [Validation Checkpoints](#validation-checkpoints)
   - [Rollback Strategy](#rollback-strategy)
5. [Component Mapping](#5-component-mapping)
6. [Code Examples](#6-code-examples)
7. [Risk Assessment](#7-risk-assessment)

---

## 1. Architecture Decisions

### AD-1: Feature-Sliced Design Adoption

**Decision**: Adopt Feature-Sliced Design (FSD) as the primary architectural methodology for organizing the Astro project's `src/` directory.

**Rationale -- Why FSD over other patterns for this Astro project:**

| Alternative | Why Rejected |
|---|---|
| **Atomic Design** (atoms/molecules/organisms/templates/pages) | Atomic Design is UI-centric and does not account for data-fetching boundaries or business logic separation. In an Astro project where some components fetch content from `astro:content` and others are pure presentation, Atomic Design's "molecules vs organisms" distinction becomes ambiguous. FSD's `entities` vs `widgets` layers provide clearer separation based on data responsibility. |
| **Domain-Driven Design folders** (by feature: `about/`, `projects/`, `experience/`) | While DDD grouping is excellent for large applications with complex domain logic, this portfolio is a single-page site with relatively simple domain entities. Feature-folders would create unnecessary nesting for a project with 12 components. FSD provides the layer-based discipline without over-engineering. |
| **Flat structure** (current state) | Already proven insufficient -- components mix data fetching with presentation, import paths are inconsistent, and adding new sections requires understanding the entire flat namespace. The specs document (FR-1) explicitly calls out scalability as a driver. |
| **Feature-Sliced Design** (chosen) | FSD provides: (1) explicit layer boundaries that prevent circular dependencies, (2) clear placement rules based on component responsibility (not just UI complexity), (3) barrel exports that simplify import paths, and (4) a dependency direction rule (lower layers cannot import from higher layers) that is enforceable and intuitive. For a portfolio that may grow with blog posts, a dashboard, or additional pages, FSD scales naturally. |

**Tradeoffs accepted:**
- FSD introduces more directory nesting, which adds slight cognitive overhead for a small project. Mitigated by barrel exports and clear naming conventions.
- FSD is more commonly used with React/Vue/SPA frameworks. Adapting it to Astro's islands architecture requires careful consideration (see AD-2).

---

### AD-2: Astro Islands + FSD Compatibility

**Decision**: Map FSD layers to Astro's rendering model as follows:

| FSD Layer | Astro Rendering Model | Hydration Strategy |
|---|---|---|
| `shared/` | Server-rendered Astro components (no client JS) | No directive |
| `entities/` | Server-rendered Astro components; `<script is:inline>` for GSAP animations scoped to the entity | `is:inline` for animations; no full hydration |
| `features/` | Astro components with `<script>` (client-side interactivity) | `client:load` or `client:idle` as needed |
| `widgets/` | Server-rendered composites; may contain hydrated feature islands | No directive on widget itself; children carry hydration directives |
| `pages/` | Astro page files (`src/pages/`) | N/A -- pages are build-time rendered |
| `app/` | Layout wrappers with global setup | No directive |

**Key design principle**: In Astro, the "island" concept maps naturally to FSD's `features/` layer. Features are the interactive boundaries. Entities and widgets remain server-rendered, with GSAP animations delivered via `<script is:inline>` (no hydration overhead -- just inline scripts that run when GSAP is available from CDN).

**Why this works:**
- Astro's build-time rendering means `entities/` and `widgets/` components produce zero client-side JavaScript by default.
- GSAP animations are loaded via CDN in `Layout.astro` and consumed by inline scripts. This avoids the overhead of bundling GSAP per-island.
- The `features/` layer (e.g., `LanguageSwitcher`) is the only layer that requires actual client-side hydration via `<script>` (not `is:inline`).

**Constraint**: FSD's strict "lower layers cannot import from higher layers" rule is preserved. A `shared/` icon component never imports from `entities/`. An `entities/` project card never imports from `widgets/`. This is enforced by code review and can be linted with `eslint-plugin-boundaries` if needed in the future.

---

### AD-3: Inline Tailwind Utilities Over @apply

**Decision**: Prefer inline Tailwind utility classes in component templates. Reserve `@apply` in `global.css` exclusively for design tokens used across 3+ components.

**Rationale:**

| Approach | Pros | Cons | Decision |
|---|---|---|---|
| **Inline utilities** (e.g., `class="flex items-center gap-4"`) | Self-documenting (classes visible in template), no CSS specificity issues, Tailwind v4 purges unused classes automatically, easier to refactor | Longer class strings in templates | **Preferred for 90% of styling** |
| **@apply in global.css** | Cleaner templates, reusable patterns | Hidden dependencies (must check CSS file to understand styling), harder to track usage, can create specificity conflicts | **Reserved for design tokens only** |
| **CSS modules** | Scoped styles, no global leakage | Extra build step, breaks Tailwind's utility-first philosophy, not idiomatic for Astro | **Rejected** |
| **CSS-in-JS** (styled-components, etc.) | Dynamic styles, colocation | Runtime overhead (unacceptable for static site), bundle size increase, incompatible with Astro's server-first model | **Rejected** |

**Retained @apply patterns** (design tokens used in 3+ components):
- `.glass-card` -- glassmorphism card base (used in Experience, Education, Certifications, and potentially future components)
- `.glass-panel` -- glassmorphism panel with padding (used in multiple sections)
- `.glass-nav` -- navigation-specific glass effect
- `.glass-input` -- form input styling (future-proof)

**Converted to inline** (element-level rules used in <3 contexts):
- `p { @apply text-gray-300 pb-4; }` -- converted to inline utilities on each `<p>` element
- `body { @apply grid; }` -- converted to inline on `<body>` in Layout
- `section { @apply mt-12; }` -- converted to inline on each `<section>` (with `#hero` override removed)

---

### AD-4: Sentry Integration Strategy

**Decision**: Integrate `@sentry/astro` as an Astro integration with environment-based DSN configuration.

**Architecture:**

```
+---------------------------------------------------+
|                    Sentry Cloud                    |
|  (errors + performance + source maps)              |
+-------------------------+-------------------------+
                          | HTTPS
                          |
    +---------------------v----------------------+
    |         @sentry/astro SDK                   |
    |  +-----------------+ +-------------------+  |
    |  | Server-side     | |  Client-side      |  |
    |  | (Astro SSR)     | |  (Islands)        |  |
    |  +-----------------+ +-------------------+  |
    +---------------------+----------------------+
                          |
    +---------------------v----------------------+
    |        astro.config.mjs                     |
    |  + Sentry integration config                |
    +---------------------------------------------+
```

**Key decisions:**
1. **Use `@sentry/astro`** (not `@sentry/node` or `@sentry/browser` separately) because it provides unified server + client error capture with a single integration.
2. **Environment-based DSN**: `SENTRY_DSN` env var with graceful degradation -- if absent, Sentry initializes in disabled mode (no errors thrown). This allows local development without Sentry configuration.
3. **Source maps**: Enabled in production builds only. Source maps are uploaded to Sentry during `bun build` via the Sentry Vite plugin (included in `@sentry/astro`).
4. **PII scrubbing**: Default Sentry scrubbing is sufficient (cookies, local storage, headers are excluded by default). No custom `beforeSend` needed for this static portfolio.
5. **Tracing**: `tracesSampleRate: 0.1` (10% sampling) -- sufficient for a low-traffic portfolio. Page load transactions are captured automatically by the Astro integration.

**Why not a custom error boundary approach?**
Astro does not have React-style error boundaries. The `@sentry/astro` integration captures build-time errors (Astro build failures) and runtime errors (client-side JavaScript errors in islands) automatically. A custom approach would require wrapping every component in try/catch, which is impractical and error-prone.

---

### AD-5: Container/Presentational Pattern for Astro

**Decision**: Use page-level frontmatter as the "container" layer rather than creating separate container Astro components.

**Rationale:**
In React, container components are a separate component type that fetches data and passes it to presentational children. In Astro, page frontmatter (`---` block) already serves this purpose perfectly:

```astro
---
// Page frontmatter = container (data fetching)
import { getCollection } from 'astro:content';
import ProjectsSection from '../../widgets/ProjectsSection.astro';

const projects = await getCollection('projects');
---

<!-- Template = presentational composition -->
<ProjectsSection projects={projects} />
```

**Why this over separate container components:**
- Astro's frontmatter is executed at build time, making it the natural data-fetching boundary.
- Creating separate `ProjectsContainer.astro` files would add an unnecessary indirection layer -- the page file already serves as the composition root.
- Presentational components (in `entities/` and `widgets/`) remain pure: they receive typed props and render UI. No `astro:content` imports.

**Exception**: When a widget is reused across multiple pages with different data requirements, a thin container wrapper in `widgets/` (e.g., `ProjectsSection.astro`) can handle the data fetching and delegate to a presentational sub-component (e.g., `ProjectsList.astro`). This is the case for `Experience` which has complex sorting logic.

---

## 2. Target Architecture Diagram

### Layer Relationships and Data Flow

```
+---------------------------------------------------------------------+
|                          PAGES LAYER                                |
|  src/pages/index.astro          src/pages/[locale]/index.astro      |
|  src/pages/[locale]/about/      src/pages/projects/[locale]/[slug]/ |
|                                                                       |
|  Responsibility: Route definitions, getStaticPaths, page-level      |
|  data fetching (frontmatter), SEO metadata                          |
|  Imports from: app/, widgets/, entities/                            |
+-------------------------------+-------------------------------------+
                                | imports
                                v
+---------------------------------------------------------------------+
|                          APP LAYER                                  |
|  src/app/                                                           |
|    Layout.astro            -- Global layout wrapper                 |
|    providers/              -- Global providers (i18n, theme)        |
|                                                                       |
|  Responsibility: Application shell, global providers, layout        |
|  composition, CDN script injection (GSAP), meta tag management      |
|  Imports from: shared/, widgets/                                    |
|  Does NOT import from: features/, entities/, pages/                 |
+-------------------------------+-------------------------------------+
                                | imports
                                v
+---------------------------------------------------------------------+
|                        WIDGETS LAYER                                |
|  src/widgets/                                                       |
|    HeroSection/            -- Hero/welcome section composition      |
|    AboutSection/           -- About section composition             |
|    ExperienceSection/      -- Experience timeline composition       |
|    EducationSection/       -- Education timeline composition        |
|    ProjectsSection/        -- Projects grid composition             |
|    CertificationsSection/  -- Certifications grid composition       |
|    SkillsSection/          -- Skills band composition               |
|    NavbarWidget/           -- Navigation bar composition            |
|    FooterWidget/           -- Footer composition                    |
|                                                                       |
|  Responsibility: Composite sections combining entities + features   |
|  for a specific page area. May contain data-fetching frontmatter    |
|  when reused across pages.                                          |
|  Imports from: shared/, entities/, features/                        |
|  Does NOT import from: app/, pages/, other widgets/                 |
+-------------------------------+-------------------------------------+
                                | imports
                                v
+---------------------------------------------------------------------+
|                        FEATURES LAYER                               |
|  src/features/                                                      |
|    LanguageSwitcher/       -- Language switching UI + logic         |
|    ContactForm/            -- (future) contact form with validation |
|                                                                       |
|  Responsibility: Interactive user-facing features with client-side  |
|  JavaScript. Each feature is a self-contained unit of interactivity.|
|  Imports from: shared/, entities/                                   |
|  Does NOT import from: widgets/, app/, pages/                       |
+-------------------------------+-------------------------------------+
                                | imports
                                v
+---------------------------------------------------------------------+
|                        ENTITIES LAYER                               |
|  src/entities/                                                      |
|    Project/                -- Project card, project detail display  |
|    Experience/             -- Experience card/timeline item         |
|    Certification/          -- Certification card                    |
|    Education/              -- Education timeline item               |
|    Skill/                  -- Skill badge                           |
|    Profile/                -- Profile/about display (LuiferDev)     |
|                                                                       |
|  Responsibility: Components tied to domain entities. Pure           |
|  presentational -- receive data via props, render UI. No data       |
|  fetching. No astro:content imports.                                |
|  Imports from: shared/                                              |
|  Does NOT import from: features/, widgets/, app/, pages/            |
+-------------------------------+-------------------------------------+
                                | imports
                                v
+---------------------------------------------------------------------+
|                        SHARED LAYER                                 |
|  src/shared/                                                        |
|    ui/                     -- Reusable UI primitives                |
|      Icon/                 -- Icon wrapper (astro-icon)             |
|      Badge/                -- Status badge component                |
|      Button/               -- Base button styles                    |
|      Card/                 -- Base card wrapper                     |
|    lib/                    -- Utility functions                     |
|      i18n/                 -- Translation helpers (from src/i18n/)  |
|      date/                 -- Date formatting utilities             |
|    styles/                 -- Global CSS (from src/styles/)         |
|      global.css            -- Tailwind import + design tokens       |
|                                                                       |
|  Responsibility: Framework-agnostic utilities, UI primitives,       |
|  and shared styles. No business logic. No domain knowledge.         |
|  Imports from: external packages only (astro-icon, etc.)            |
|  Does NOT import from: any other FSD layer                          |
+---------------------------------------------------------------------+
```

### Component Hierarchy (Page Composition Example)

```
pages/[locale]/index.astro
+-- app/Layout.astro
|   +-- shared/styles/global.css
|   +-- widgets/NavbarWidget.astro
|   |   +-- shared/ui/Icon.astro
|   |   +-- features/LanguageSwitcher/
|   |       +-- shared/lib/i18n/
|   +-- <slot />
|       +-- widgets/HeroSection.astro
|       |   +-- entities/Profile/
|       |       +-- shared/ui/Icon.astro
|       +-- widgets/SkillsSection.astro
|       |   +-- entities/Skill/
|       |       +-- shared/ui/Icon.astro
|       +-- widgets/AboutSection.astro
|       |   +-- entities/Profile/
|       +-- widgets/ExperienceSection.astro
|       |   +-- entities/Experience/
|       +-- widgets/EducationSection.astro
|       |   +-- entities/Education/
|       +-- widgets/ProjectsSection.astro
|       |   +-- entities/Project/
|       |       +-- shared/ui/Icon.astro
|       +-- widgets/CertificationsSection.astro
|       |   +-- entities/Certification/
|       |       +-- shared/ui/Icon.astro
|       +-- widgets/FooterWidget.astro
|           +-- shared/ui/Icon.astro
```

### Dependency Direction Rules

```
pages --> app --> widgets --> features --> entities --> shared
  |       |        |          |           |
  |       |        |          |           +--> external packages
  |       |        |          +--> shared
  |       |        +--> features, entities, shared
  |       +--> widgets, shared
  +--> app, widgets, entities, shared

RULE: A layer can ONLY import from layers BELOW it (toward shared).
      NEVER import upward (e.g., entities cannot import from widgets).
```

---

## 3. Implementation Details

### Directory Structure

```
src/
+-- app/                          # Application layer (NEW)
|   +-- Layout.astro              # Moved from src/layouts/Layout.astro
|   +-- index.ts                  # Barrel export
|
+-- entities/                     # Entity layer (NEW)
|   +-- Project/
|   |   +-- ProjectCard.astro     # Moved from src/components/ProjectCard.astro
|   |   +-- index.ts              # Barrel export
|   +-- Experience/
|   |   +-- ExperienceCard.astro  # Extracted from Experience.astro (presentational)
|   |   +-- index.ts
|   +-- Certification/
|   |   +-- CertificationCard.astro  # Extracted from Certifications.astro
|   |   +-- index.ts
|   +-- Education/
|   |   +-- EducationItem.astro   # Extracted from Education.astro
|   |   +-- index.ts
|   +-- Skill/
|   |   +-- SkillBadge.astro      # Extracted from Skills.astro
|   |   +-- index.ts
|   +-- Profile/
|   |   +-- ProfileCard.astro     # Renamed from LuiferDev.astro
|   |   +-- ProfileAbout.astro    # Extracted from About.astro (presentational)
|   |   +-- index.ts
|   +-- index.ts                  # Layer barrel export
|
+-- features/                     # Feature layer (NEW)
|   +-- LanguageSwitcher/
|   |   +-- LanguageSwitcher.astro  # Moved from src/components/LanguageSwitcher.astro
|   |   +-- index.ts
|   +-- index.ts                  # Layer barrel export
|
+-- widgets/                      # Widget layer (NEW)
|   +-- HeroSection/
|   |   +-- HeroSection.astro     # Renamed from LuiferDev.astro (the actual hero)
|   |   +-- index.ts
|   +-- AboutSection/
|   |   +-- AboutSection.astro    # Container: fetches about content, renders entities/Profile
|   |   +-- index.ts
|   +-- ExperienceSection/
|   |   +-- ExperienceSection.astro  # Container: fetches experiences, renders entities/Experience
|   |   +-- index.ts
|   +-- EducationSection/
|   |   +-- EducationSection.astro   # Container: renders entities/Education
|   |   +-- index.ts
|   +-- ProjectsSection/
|   |   +-- ProjectsSection.astro    # Container: fetches projects, renders entities/Project
|   |   +-- ProjectsList.astro       # Presentational: renders ProjectCard list
|   |   +-- index.ts
|   +-- CertificationsSection/
|   |   +-- CertificationsSection.astro  # Container: renders entities/Certification
|   |   +-- index.ts
|   +-- SkillsSection/
|   |   +-- SkillsSection.astro        # Container: renders entities/Skill
|   |   +-- index.ts
|   +-- NavbarWidget/
|   |   +-- NavbarWidget.astro         # Moved from src/components/Navbar.astro
|   |   +-- index.ts
|   +-- FooterWidget/
|   |   +-- FooterWidget.astro         # Moved from src/components/Footer.astro
|   |   +-- index.ts
|   +-- index.ts                  # Layer barrel export
|
+-- shared/                       # Shared layer (NEW)
|   +-- ui/
|   |   +-- Icon.astro            # Wrapper around astro-icon/components
|   |   +-- Badge.astro           # Status badge (Completed, InProgress, etc.)
|   |   +-- Button.astro          # Base button with variants
|   |   +-- Card.astro            # Base card wrapper with glass effect
|   |   +-- index.ts
|   +-- lib/
|   |   +-- i18n.ts               # Re-exports from src/i18n/config.ts
|   |   +-- date.ts               # Date formatting utilities
|   |   +-- index.ts
|   +-- styles/
|   |   +-- global.css            # Moved from src/styles/global.css
|   +-- index.ts                  # Layer barrel export
|
+-- pages/                        # Pages (restructured)
|   +-- index.astro               # Default locale page (redirect or render)
|   +-- [locale]/
|   |   +-- index.astro           # Localized homepage
|   +-- projects/
|       +-- [locale]/
|           +-- [slug]/
|               +-- index.astro   # Project detail page
|
+-- content/                      # Unchanged
|   +-- sections/
|   +-- experiences/
|   +-- projects/
|
+-- content.config.ts             # Unchanged
+-- i18n/                         # Unchanged (re-exported via shared/lib/i18n.ts)
|   +-- config.ts
|   +-- ui.json
+-- assets/                       # Unchanged
    +-- astro.svg
    +-- background.svg
```

### Import/Export Patterns and Conventions

**Barrel export pattern** (each directory gets an `index.ts`):

```typescript
// src/entities/Project/index.ts
export { default as ProjectCard } from './ProjectCard.astro';
```

```typescript
// src/entities/index.ts
export * from './Project';
export * from './Experience';
export * from './Certification';
export * from './Education';
export * from './Skill';
export * from './Profile';
```

**Import ordering convention** (within any Astro component frontmatter):

```astro
---
// 1. Astro built-ins
import { getCollection, render } from 'astro:content';
import { Image } from 'astro:assets';

// 2. External packages
import { Icon } from 'astro-icon/components';

// 3. Internal -- FSD layers (bottom-up: shared -> entities -> features -> widgets -> app)
import { Icon as SharedIcon } from '../../shared/ui';
import { ProfileCard } from '../../entities/Profile';
import { LanguageSwitcher } from '../../features/LanguageSwitcher';

// 4. Styles (if needed)
import '../../shared/styles/global.css';
---
```

**Path alias convention**: Use relative paths with consistent depth. No path aliases in `tsconfig.json` (Astro's Vite config handles resolution). This keeps imports explicit and traceable.

**Forbidden imports** (enforced by code review, optionally by ESLint):

| Source Layer | Cannot Import From |
|---|---|
| `shared/` | `entities/`, `features/`, `widgets/`, `app/`, `pages/` |
| `entities/` | `features/`, `widgets/`, `app/`, `pages/` |
| `features/` | `widgets/`, `app/`, `pages/` |
| `widgets/` | `app/`, `pages/`, other widgets |
| `app/` | `pages/` |

### TypeScript Interface Patterns

**Presentational component props** (entities layer -- no data fetching):

```typescript
// src/entities/Project/ProjectCard.astro
---
import type { CollectionEntry } from 'astro:content';
import type { z } from 'astro:content';
import { projects } from '../../content.config';

// Derive prop types from content schema
type ProjectData = z.infer<typeof projects.schema>;

interface Props {
  project: CollectionEntry<'projects'>;
  locale?: 'es' | 'en' | 'fr';
  t?: {
    live: string;
    code: string;
  };
}

const { project, locale = 'es', t } = Astro.props;
const { data, id } = project;
---
```

**Widget component props** (widgets layer -- may receive pre-fetched data):

```typescript
// src/widgets/ProjectsSection/ProjectsSection.astro
---
import type { CollectionEntry } from 'astro:content';
import { ProjectsList } from './ProjectsList.astro';
import { useTranslations } from '../../shared/lib/i18n';

interface Props {
  locale?: 'es' | 'en' | 'fr';
  projects?: CollectionEntry<'projects'>[];  // Optional -- fetches own data if not provided
}

const { locale = 'es', projects: providedProjects } = Astro.props;
const t = useTranslations(locale);

// Container pattern: fetch if not provided
const allProjects = providedProjects ?? await getCollection('projects');
const localeProjects = allProjects.filter(p => p.id.startsWith(`${locale}/`));
---
```

**Shared utility types**:

```typescript
// src/shared/lib/i18n.ts
import { languages, defaultLang, getLangFromUrl, useTranslations } from '../../i18n/config';

export type Lang = keyof typeof languages;
export { defaultLang, getLangFromUrl, useTranslations, languages };
```

### Tailwind Configuration Changes

**File**: `src/shared/styles/global.css` (moved from `src/styles/global.css`)

Changes:
1. Remove element-level `@apply` rules:
   ```css
   /* REMOVE these */
   p { @apply text-gray-300 pb-4; }
   body { @apply grid; min-width: 100vw; }
   section { @apply mt-12; }
   #hero { margin-top: 0; }
   ```

2. Retain design token classes (used in 3+ components):
   ```css
   /* KEEP these -- design tokens */
   .glass-card { ... }
   .glass-panel { ... }
   .glass-nav { ... }
   .glass-input { ... }
   ```

3. Add CSS custom properties for the color palette (already present, keep as-is):
   ```css
   :root {
     --palette-bg: #222;
     --palette-accent: #93565d;
     --palette-text: #ffffff;
     --glass-bg: rgba(255, 255, 255, 0.05);
     --glass-border: rgba(255, 255, 255, 0.1);
     --glass-blur: blur(12px);
   }
   ```

**No changes needed** to `astro.config.mjs` for Tailwind -- the `@tailwindcss/vite` plugin remains as-is.

**No changes needed** to `tailwind.config.*` -- Tailwind CSS v4 uses CSS-first configuration via `@import 'tailwindcss'` in `global.css`.

### Sentry Setup Steps

**Step 1: Install dependencies**
```bash
bun add @sentry/astro
```

**Step 2: Configure `astro.config.mjs`**
```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';

export default defineConfig({
  site: 'https://luiferdev.com',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'fr'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    // Sentry source maps configuration
    build: {
      sourcemap: true,
    },
  },
  integrations: [
    icon(),
    sitemap(),
    sentry({
      dsn: import.meta.env.SENTRY_DSN ?? '',
      enabled: !!import.meta.env.SENTRY_DSN,
      environment: import.meta.env.SENTRY_ENVIRONMENT ?? 'production',
      tracesSampleRate: 0.1,
      // Do not send events in development
      beforeSend(event) {
        if (import.meta.env.DEV) return null;
        return event;
      },
    }),
  ],
});
```

**Step 3: Add environment variables**
```bash
# .env (local development -- DSN empty, Sentry disabled)
SENTRY_DSN=
SENTRY_ENVIRONMENT=development

# .env.production (deployed environment)
SENTRY_DSN=https://xxx@yyy.ingest.sentry.io/zzz
SENTRY_ENVIRONMENT=production
```

**Step 4: Add `.env` to `.gitignore`** (verify it is already there)

**Step 5: Test error capture**
Add a test error in a client-side component to verify Sentry integration:
```astro
<!-- In any feature component, temporarily add: -->
<script>
  // Test: remove after verification
  if (import.meta.env.PROD) {
    throw new Error('Sentry test error -- safe to ignore');
  }
</script>
```

**Step 6: Verify in Sentry dashboard**
- Build for production: `bun build`
- Preview: `bun preview`
- Trigger the test error
- Confirm the event appears in Sentry dashboard with correct source map resolution

---

## 4. Migration Strategy

### Phase-by-Phase Plan

The migration is divided into 4 phases matching the proposal, executed sequentially to minimize risk. Each phase ends with a validation checkpoint.

#### Phase 1: Directory Structure + FSD Skeleton (Day 1)

**Goal**: Create the FSD directory structure with barrel exports. No component moves yet.

```
Step 1.1: Create FSD directories
  mkdir -p src/{app,entities,features,widgets,shared/{ui,lib,styles}}

Step 1.2: Create barrel export files
  # Each layer gets an index.ts
  # Each subdirectory gets an index.ts

Step 1.3: Move shared assets
  mv src/styles/global.css src/shared/styles/global.css
  # Update Layout.astro import path temporarily

Step 1.4: Re-export i18n from shared layer
  # src/shared/lib/i18n.ts re-exports from src/i18n/config.ts

Step 1.5: Validate
  bun build    # Should succeed (no components moved yet, only CSS path changed)
  bun dev      # Should start without errors
```

**Checkpoint**: `bun build` succeeds, `bun dev` starts, homepage renders identically.

#### Phase 2: Component Migration (Days 2-3)

**Goal**: Move each component to its FSD layer, update all import paths.

**Order of migration** (bottom-up to respect dependencies):

```
Step 2.1: Move shared/ui components
  # Create Icon.astro, Badge.astro, Button.astro, Card.astro in src/shared/ui/
  # These are new wrappers or extractions from existing components

Step 2.2: Move entities
  src/components/ProjectCard.astro      -> src/entities/Project/ProjectCard.astro
  src/components/LuiferDev.astro        -> src/entities/Profile/ProfileCard.astro
  # Extract ExperienceCard from Experience.astro -> src/entities/Experience/ExperienceCard.astro
  # Extract CertificationCard from Certifications.astro -> src/entities/Certification/CertificationCard.astro
  # Extract EducationItem from Education.astro -> src/entities/Education/EducationItem.astro
  # Extract SkillBadge from Skills.astro -> src/entities/Skill/SkillBadge.astro

Step 2.3: Move features
  src/components/LanguageSwitcher.astro -> src/features/LanguageSwitcher/LanguageSwitcher.astro

Step 2.4: Move/create widgets
  src/components/Navbar.astro           -> src/widgets/NavbarWidget/NavbarWidget.astro
  src/components/Footer.astro           -> src/widgets/FooterWidget/FooterWidget.astro
  # Create section widgets that composite entities:
  src/widgets/HeroSection/HeroSection.astro      (from LuiferDev + Welcome)
  src/widgets/AboutSection/AboutSection.astro     (from About)
  src/widgets/ExperienceSection/ExperienceSection.astro  (from Experience)
  src/widgets/EducationSection/EducationSection.astro    (from Education)
  src/widgets/ProjectsSection/ProjectsSection.astro      (from Projects)
  src/widgets/CertificationsSection/CertificationsSection.astro  (from Certifications)
  src/widgets/SkillsSection/SkillsSection.astro   (from Skills)

Step 2.5: Move app layer
  src/layouts/Layout.astro              -> src/app/Layout.astro

Step 2.6: Update page imports
  # src/pages/index.astro -- update all imports to FSD paths
  # src/pages/[locale]/index.astro -- update all imports to FSD paths
  # src/pages/projects/[locale]/[slug]/index.astro -- update all imports

Step 2.7: Validate
  bun build    # Must succeed with zero import errors
  bun dev      # Must start without errors
  bun preview  # Must render identically to pre-migration
```

**Checkpoint**: All components render correctly. No TypeScript errors. All import paths resolve.

#### Phase 3: Separation of Concerns + Styling (Days 4-5)

**Goal**: Split container/presentational pairs, convert `@apply` to inline utilities.

```
Step 3.1: Identify components mixing data fetching + presentation
  - About.astro: fetches getCollection('contents') -> split into AboutSection (container) + ProfileAbout (presentational)
  - Experience.astro: fetches getCollection('experiences') -> split into ExperienceSection (container) + ExperienceCard (presentational)
  - Projects.astro: fetches getCollection('projects') -> split into ProjectsSection (container) + ProjectCard (presentational)
  - Certifications.astro: has inline data -> keep as widget, extract CertificationCard as presentational
  - Education.astro: has inline data -> keep as widget, extract EducationItem as presentational
  - Skills.astro: has inline data -> keep as widget, extract SkillBadge as presentational

Step 3.2: Refactor each pair
  # Presentational component: remove astro:content imports, add typed Props
  # Container widget: handle data fetching, pass data as props

Step 3.3: Convert @apply to inline utilities
  # Audit all @apply usages
  # Convert element-level rules to inline
  # Retain glass-* design tokens

Step 3.4: Validate
  bun build    # Zero TypeScript errors under strict mode
  bun preview  # Visual comparison with pre-migration screenshots
```

**Checkpoint**: No presentational component imports `astro:content`. All `@apply` rules are either removed or justified. Visual output is identical.

#### Phase 4: Sentry + Performance Optimization (Days 6-7)

**Goal**: Integrate Sentry, optimize hydration directives.

```
Step 4.1: Install and configure Sentry (see "Sentry Setup Steps" above)

Step 4.2: Assign hydration directives
  LanguageSwitcher:  client:load   (critical -- needed immediately)
  NavbarWidget:      client:load   (hamburger menu, scroll effects needed early)
  SkillsSection:     client:visible (animation only needed when scrolled into view)
  ExperienceSection: client:visible (timeline animation below the fold)
  ProjectsSection:   client:visible (project cards below the fold)
  CertificationsSection: client:visible (cert cards below the fold)
  AboutSection:      no directive  (pure server-rendered, GSAP via is:inline)
  EducationSection:  no directive  (pure server-rendered, GSAP via is:inline)
  HeroSection:       no directive  (pure server-rendered, GSAP via is:inline)
  FooterWidget:      no directive  (pure server-rendered, no interactivity)

Step 4.3: Measure performance
  bun build
  bun preview
  Run Lighthouse audit (desktop + mobile)
  Document JS bundle size

Step 4.4: Validate
  bun build    # Must succeed
  bun preview  # All interactivity must work
  Lighthouse   # Performance score >= 90 desktop, >= 80 mobile
  Sentry       # Test error captured in dashboard
```

**Checkpoint**: Sentry captures errors. Lighthouse scores meet targets. All interactivity works.

### Validation Checkpoints

After each phase, run this validation suite:

```bash
# 1. Build check
bun build
# Expected: exits with code 0, no errors in output

# 2. Dev server check
bun dev
# Expected: starts on port 4321, no console errors

# 3. Visual check (manual)
bun preview
# Expected: navigate to /, /en/, /fr/ -- all sections render identically to pre-migration

# 4. TypeScript check
bunx tsc --noEmit
# Expected: zero errors

# 5. Import path check (manual review)
# Verify no component imports from a higher FSD layer
```

### Rollback Strategy

**Git-based rollback** (primary strategy):
- Each phase is committed separately with a descriptive commit message.
- If a phase introduces a breaking change that cannot be fixed within 2 hours, revert to the previous phase's commit:
  ```bash
  git log --oneline  # Find the last good commit
  git reset --hard <commit-hash>
  bun install && bun build  # Verify clean state
  ```

**Parallel directory strategy** (safety net):
- During Phase 2 (component migration), the old `src/components/` directory is NOT deleted until all imports are updated and validated.
- Old `src/layouts/Layout.astro` is NOT deleted until `src/app/Layout.astro` is validated.
- This allows instant rollback by reverting import paths.

**Environment variable rollback** (Sentry):
- If Sentry integration causes issues, set `SENTRY_DSN=""` in the environment.
- The `enabled: !!import.meta.env.SENTRY_DSN` config ensures Sentry is completely disabled when DSN is empty.
- No code changes needed -- just an environment variable toggle.

---

## 5. Component Mapping

| Current Location | New FSD Location | Type | Reasoning |
|---|---|---|---|
| `src/components/LuiferDev.astro` | `src/entities/Profile/ProfileCard.astro` | Entity | Represents the core domain entity (the developer/profile). Pure presentation -- receives locale prop, renders hero section. Renamed to reflect its entity nature. |
| `src/components/ProjectCard.astro` | `src/entities/Project/ProjectCard.astro` | Entity | Represents a single project entity display. Already presentational (receives props, no data fetching). Minimal changes needed -- just move and update imports. |
| `src/components/Experience.astro` | `src/entities/Experience/ExperienceCard.astro` (presentational) + `src/widgets/ExperienceSection/ExperienceSection.astro` (container) | Entity + Widget | Currently mixes data fetching (`getCollection('experiences')`) with presentation. Split: ExperienceCard renders a single experience item (presentational), ExperienceSection fetches and sorts data (container). |
| `src/components/About.astro` | `src/entities/Profile/ProfileAbout.astro` (presentational) + `src/widgets/AboutSection/AboutSection.astro` (container) | Entity + Widget | Currently fetches `getCollection('contents')` and renders about content. Split: ProfileAbout handles the about/profile rendering, AboutSection handles data fetching. Note: Profile entity serves both the hero and about sections -- this is acceptable as an entity can be used in multiple widgets. |
| `src/components/Skills.astro` | `src/entities/Skill/SkillBadge.astro` (presentational) + `src/widgets/SkillsSection/SkillsSection.astro` (container) | Entity + Widget | Skills data is inline (not from content collections). Split: SkillBadge renders a single skill icon+name, SkillsSection holds the skills array and GSAP animation. |
| `src/components/Education.astro` | `src/entities/Education/EducationItem.astro` (presentational) + `src/widgets/EducationSection/EducationSection.astro` (container) | Entity + Widget | Education data is inline. Split: EducationItem renders a single education entry, EducationSection holds the data array and timeline animation. |
| `src/components/Certifications.astro` | `src/entities/Certification/CertificationCard.astro` (presentational) + `src/widgets/CertificationsSection/CertificationsSection.astro` (container) | Entity + Widget | Certifications data is inline. Split: CertificationCard renders a single cert, CertificationsSection holds the data array and grid animation. |
| `src/components/Projects.astro` | `src/widgets/ProjectsSection/ProjectsSection.astro` (container) | Widget | Already fetches `getCollection('projects')` and renders ProjectCard children. Becomes the container widget. ProjectCard moves to entities. |
| `src/components/Welcome.astro` | **DELETED** (Astro starter template) | N/A | This is the default Astro 5 starter page content, not used in the actual portfolio. The real hero is `LuiferDev.astro`. This file can be safely removed. |
| `src/components/Navbar.astro` | `src/widgets/NavbarWidget/NavbarWidget.astro` | Widget | Composite navigation component containing LanguageSwitcher (feature) and nav links. Already a widget by FSD definition. |
| `src/components/Footer.astro` | `src/widgets/FooterWidget/FooterWidget.astro` | Widget | Composite footer component with brand, links, and social icons. Already a widget by FSD definition. |
| `src/components/LanguageSwitcher.astro` | `src/features/LanguageSwitcher/LanguageSwitcher.astro` | Feature | Interactive component with client-side JavaScript (dropdown toggle). The only component requiring actual hydration. Fits FSD's feature layer perfectly. |
| `src/layouts/Layout.astro` | `src/app/Layout.astro` | App | Application-level layout wrapper. Imports global CSS, injects GSAP CDN, manages SEO meta tags. Fits FSD's app layer. |
| `src/pages/index.astro` | `src/pages/index.astro` (stays) | Page | Default locale entry point. Composes widgets. No structural change needed -- only import paths updated. |
| `src/pages/[locale]/index.astro` | `src/pages/[locale]/index.astro` (stays) | Page | Localized entry point. Composes widgets with locale prop. No structural change needed -- only import paths updated. |
| `src/pages/projects/[locale]/[slug]/index.astro` | `src/pages/projects/[locale]/[slug]/index.astro` (stays) | Page | Project detail page. Uses entities/Project for rendering. Import paths updated. |
| `src/styles/global.css` | `src/shared/styles/global.css` | Shared | Global CSS with Tailwind import and design tokens. Moved to shared layer as it is consumed by all layers. |
| `src/i18n/config.ts` | `src/i18n/config.ts` (stays) + `src/shared/lib/i18n.ts` (re-export) | Shared | i18n config stays in place. A re-export in `shared/lib/i18n.ts` provides a clean import path for FSD layers. |

---

## 6. Code Examples

### Example 1: Component Refactored with FSD Structure

**Before** (flat structure, mixed concerns):

```astro
<!-- src/components/Projects.astro -->
---
import { getCollection } from 'astro:content';
import ProjectCard from './ProjectCard.astro';
import { useTranslations } from '../i18n/config';

interface Props {
  locale?: string;
}

const { locale = 'es' } = Astro.props;
const t = useTranslations(locale as 'es' | 'en' | 'fr');

const allProjects = await getCollection('projects');
const projects = allProjects.filter(project => project.id.startsWith(locale + '/'));
---

<section id="projects" class="max-w-[750px] mx-auto mt-12">
  <article>
    <h2 class="section-title">{t.projects.title}</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {projects.map((project, index) => {
        const { data, id } = project;
        const slug = id.split('/')[1];
        return (
          <ProjectCard
            id={id}
            slug={slug}
            locale={locale}
            title={data.title}
            description={data.description}
            image={data.image}
            technologies={data.technologies}
            link={data.link}
            github={data.github}
            index={index}
            t={t.projects}
          />
        );
      })}
    </div>
  </article>
</section>
```

**After** (FSD structure, separated concerns):

```astro
<!-- src/widgets/ProjectsSection/ProjectsSection.astro (CONTAINER) -->
---
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { ProjectsList } from './ProjectsList.astro';
import { useTranslations } from '../../shared/lib/i18n';

interface Props {
  locale?: 'es' | 'en' | 'fr';
  projects?: CollectionEntry<'projects'>[];
}

const { locale = 'es', projects: providedProjects } = Astro.props;
const t = useTranslations(locale);

const allProjects = providedProjects ?? await getCollection('projects');
const localeProjects = allProjects.filter(p => p.id.startsWith(`${locale}/`));
---

<section id="projects" class="max-w-[750px] mx-auto mt-12">
  <h2 class="font-['Space_Grotesk'] text-[clamp(2rem,5vw,2.5rem)] font-bold text-white mb-6">
    {t.projects.title}
  </h2>
  <ProjectsList projects={localeProjects} locale={locale} t={t.projects} />
</section>
```

```astro
<!-- src/widgets/ProjectsSection/ProjectsList.astro (PRESENTATIONAL) -->
---
import type { CollectionEntry } from 'astro:content';
import { ProjectCard } from '../../entities/Project';

interface Props {
  projects: CollectionEntry<'projects'>[];
  locale: 'es' | 'en' | 'fr';
  t: { live: string; code: string };
}

const { projects, locale, t } = Astro.props;
---

{projects.length === 0 ? (
  <p class="text-gray-400">No projects found</p>
) : (
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {projects.map((project, index) => (
      <ProjectCard project={project} locale={locale} t={t} />
    ))}
  </div>
)}
```

```astro
<!-- src/entities/Project/ProjectCard.astro (PRESENTATIONAL ENTITY) -->
---
import type { CollectionEntry } from 'astro:content';
import { SharedIcon } from '../../shared/ui';

interface Props {
  project: CollectionEntry<'projects'>;
  locale?: 'es' | 'en' | 'fr';
  t?: { live: string; code: string };
}

const { project, locale = 'es', t } = Astro.props;
const { data, id } = project;
const slug = id.split('/')[1];
const projectUrl = locale === 'es' ? `/projects/es/${slug}` : `/projects/${locale}/${slug}`;
---

<a
  href={projectUrl}
  class="block bg-white/5 border border-white/10 backdrop-blur-md rounded-xl overflow-hidden hover:border-[#93565d]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#93565d]/10"
>
  <div class="aspect-video relative overflow-hidden">
    <img
      src={data.image}
      alt={data.title}
      class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
      loading="lazy"
    />
  </div>
  <div class="p-5">
    <h3 class="text-lg font-bold mb-1 hover:text-[#93565d] transition-colors">
      {data.title}
    </h3>
    <p class="text-gray-400 text-sm line-clamp-2 mb-4">
      {data.description}
    </p>
    <div class="flex flex-wrap gap-2 mb-4">
      {data.technologies.slice(0, 4).map((tech) => (
        <span class="text-xs px-2 py-1 bg-[#93565d]/20 text-[#93565d] rounded-md">
          {tech}
        </span>
      ))}
      {data.technologies.length > 4 && (
        <span class="text-xs px-2 py-1 bg-white/5 text-gray-400 rounded-md">
          +{data.technologies.length - 4}
        </span>
      )}
    </div>
    <div class="flex items-center gap-4">
      {data.link && (
        <span class="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors">
          <SharedIcon name="mdi:web" class="w-4 h-4" />
          <span>{t?.live || 'Live'}</span>
        </span>
      )}
      {data.github && (
        <span class="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors">
          <SharedIcon name="mdi:github" class="w-4 h-4" />
          <span>{t?.code || 'Code'}</span>
        </span>
      )}
    </div>
  </div>
</a>
```

### Example 2: Component with Separated Logic/Presentation

**Before** (mixed data fetching + presentation in About.astro):

```astro
<!-- src/components/About.astro -->
---
import { getCollection, render } from 'astro:content';
import { useTranslations } from '../i18n/config';

interface Props {
  locale?: string;
}

const { locale = 'es' } = Astro.props;
const t = useTranslations(locale as 'es' | 'en' | 'fr');

const allContents = await getCollection('contents');
let about;
if (locale === 'es') {
  about = allContents.find(c => c.id === 'es/about') || allContents.find(c => c.id === 'about');
} else {
  about = allContents.find(c => c.id === `${locale}/about`);
}
if (!about) {
  about = allContents.find(c => c.id.endsWith('/about') || c.id === 'about');
}
if (!about) {
  throw new Error(`Could not find about entry for locale: ${locale}`);
}

const { Content } = await render(about);
---

<section class="about max-w-[750px] mx-auto" id="about">
  <div class="about-container">
    <h2 class="about-heading">{t.about.title}</h2>
    <div class="about-content">
      <Content />
    </div>
  </div>
</section>

<script is:inline>
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.from('.about-heading', { y: 30, opacity: 0, duration: 0.5 })
        .from('.about-content', { y: 30, opacity: 0, duration: 0.5 }, '-=0.3');
    }
  });
</script>

<style>
  .about { min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; }
  .about-heading { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 5vw, 2.5rem); font-weight: 700; color: #fff; margin: 0 0 1.5rem 0; line-height: 1.2; }
  .about-content { font-family: 'Inter', sans-serif; font-size: 1.125rem; color: #9ca3af; line-height: 1.8; }
  .about-content :global(p) { margin-bottom: 1rem; }
  .about-content :global(p:last-child) { margin-bottom: 0; }
</style>
```

**After** (separated into container widget + presentational entity):

```astro
<!-- src/widgets/AboutSection/AboutSection.astro (CONTAINER) -->
---
import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { ProfileAbout } from '../../entities/Profile';
import { useTranslations } from '../../shared/lib/i18n';

interface Props {
  locale?: 'es' | 'en' | 'fr';
}

const { locale = 'es' } = Astro.props;
const t = useTranslations(locale);

// Data fetching logic isolated in container
const allContents = await getCollection('contents');
const about = allContents.find(c => c.id === `${locale}/about`)
  ?? allContents.find(c => c.id === 'about')
  ?? allContents.find(c => c.id.endsWith('/about'));

if (!about) {
  throw new Error(`Could not find about entry for locale: ${locale}`);
}

const { Content } = await render(about);
---

<section class="min-h-[80vh] flex items-center justify-center p-8 mt-12" id="about" aria-label="about me section of my resume">
  <div class="max-w-[750px] w-full py-8">
    <ProfileAbout title={t.about.title} Content={Content} />
  </div>
</section>

<script is:inline>
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.from('[data-about-heading]', { y: 30, opacity: 0, duration: 0.5 })
        .from('[data-about-content]', { y: 30, opacity: 0, duration: 0.5 }, '-=0.3');
    }
  });
</script>
```

```astro
<!-- src/entities/Profile/ProfileAbout.astro (PRESENTATIONAL) -->
---
interface Props {
  title: string;
  Content: AstroComponentFactory;
}

const { title, Content } = Astro.props;
---

<h2
  data-about-heading
  class="font-['Space_Grotesk'] text-[clamp(2rem,5vw,2.5rem)] font-bold text-white mb-6 leading-tight"
>
  {title}
</h2>
<div
  data-about-content
  class="font-['Inter'] text-lg text-gray-400 leading-relaxed [&>p]:mb-4 [&>p:last-child]:mb-0"
>
  <Content />
</div>
```

### Example 3: @apply Directive Converted to Inline Utilities

**Before** (element-level @apply in global.css):

```css
/* src/styles/global.css */
p {
  @apply text-gray-300 pb-4;
}

body {
  @apply grid;
  min-width: 100vw;
}

section {
  @apply mt-12;
}

#hero {
  margin-top: 0;
}
```

```astro
<!-- Any component using <p> elements relied on the global rule -->
<p>This paragraph was styled by the global p { @apply ... } rule</p>

<!-- Layout.astro had no explicit body classes -->
<body>
  <slot />
</body>

<!-- Sections relied on global section { @apply mt-12 } -->
<section>Content with automatic mt-12</section>
<section id="hero">Hero with margin-top: 0 override</section>
```

**After** (inline utilities, explicit styling):

```css
/* src/shared/styles/global.css */
/* Element-level @apply rules REMOVED -- converted to inline utilities */
/* Design tokens retained below */

.glass-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: 0.75rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: 1rem;
  padding: 2rem;
}
```

```astro
<!-- Layout.astro -- explicit body classes -->
<body class="grid min-w-[100vw]">
  <slot />
</body>

<!-- Paragraphs -- explicit inline utilities -->
<p class="text-gray-300 pb-4">This paragraph has explicit Tailwind classes</p>

<!-- Sections -- explicit mt-12, hero gets mt-0 -->
<section class="mt-12">Content with explicit mt-12</section>
<section class="mt-0" id="hero">Hero with explicit mt-0</section>
```

**Migration rule for @apply conversion:**

| Original Rule | Conversion | Rationale |
|---|---|---|
| `p { @apply text-gray-300 pb-4; }` | Add `class="text-gray-300 pb-4"` to each `<p>` | Used in <3 components; explicit is clearer |
| `body { @apply grid; }` | Add `class="grid"` to `<body>` in Layout | Single usage; no need for global rule |
| `section { @apply mt-12; }` | Add `class="mt-12"` to each `<section>`, `class="mt-0"` for `#hero` | Hero override proves global rule was leaky; explicit is safer |
| `.glass-card { ... }` | **Retain** as CSS class | Used in 3+ components; cohesive design token |
| `.glass-panel { ... }` | **Retain** as CSS class | Used in 3+ components; cohesive design token |

---

## 7. Risk Assessment

| Risk ID | Risk | Impact | Likelihood | Mitigation | Detection |
|---|---|---|---|---|---|
| R-1 | **Broken import paths during migration** | High | Medium | Move components one layer at a bottom-up order. Run `bun build` after each batch. Keep old files until all imports are updated. | `bun build` fails with import resolution error |
| R-2 | **Visual regression from @apply -> inline conversion** | Medium | Medium | Take screenshots before migration. Compare after each component conversion. Use `bun preview` for side-by-side visual check. | Manual visual inspection; Lighthouse visual comparison |
| R-3 | **GSAP animations break after component restructuring** | High | Low | GSAP animations use CSS class selectors (`.about-heading`, `.timeline-item`). Ensure class names are preserved or update selectors in `<script is:inline>` blocks. Test all animations after each component move. | Manual scroll test; check browser console for GSAP errors |
| R-4 | **i18n content loading fails after refactoring** | High | Low | Preserve the exact content-finding logic from the original components. Test all three locales (`/`, `/en/`, `/fr/`) after each container/presentational split. | `bun build` -- Zod validation catches missing content; manual locale navigation |
| R-5 | **Sentry DSN misconfiguration causes build failure** | Medium | Low | Use `enabled: !!import.meta.env.SENTRY_DSN` -- if DSN is missing, Sentry is disabled entirely. Test build with and without `SENTRY_DSN` set. | `bun build` with empty DSN should succeed |
| R-6 | **Circular dependencies between FSD layers** | High | Low | Enforce bottom-up import discipline. Use ESLint `eslint-plugin-boundaries` (optional future addition) to catch violations. Code review each PR for import direction. | Manual code review; optional ESLint plugin |
| R-7 | **Performance regression from over-hydration** | Medium | Low | Follow the hydration directive assignment table (Section 4). Measure JS bundle size before/after. Use `client:visible` for below-the-fold components. | Lighthouse audit; `bun build` output JS size |
| R-8 | **TypeScript strict mode violations after refactoring** | Medium | Medium | Run `bunx tsc --noEmit` after each phase. Use `z.infer` for prop types derived from content schemas. No `any` types allowed. | `bunx tsc --noEmit` output |
| R-9 | **Barrel export creates tree-shaking issues** | Low | Low | Astro/Vite handles tree-shaking well with ES modules. If bundle size increases, switch from barrel exports to direct imports in performance-critical paths. | `bun build` output bundle size comparison |
| R-10 | **Project detail page breaks after component moves** | Medium | Low | The project detail page (`src/pages/projects/[locale]/[slug]/index.astro`) imports Layout and uses inline rendering. Update its import paths last, after all entity/widget moves are validated. | `bun build` succeeds; navigate to a project detail page in preview |

### Risk Priority Matrix

```
Impact
  High |  R-1        R-3        R-4
       |  R-6
       |
Medium |  R-2        R-5        R-7
       |             R-8
       |
  Low  |                       R-9
       |             R-10
       +-----------------------------------
          Low       Medium      High     Likelihood
```

**Highest priority risks** (High Impact + Medium-High Likelihood): R-1, R-3, R-4, R-6

These are mitigated by:
1. Bottom-up migration order (shared -> entities -> features -> widgets -> app -> pages)
2. Preserving GSAP class selectors during refactoring
3. Testing all three locales after each container/presentational split
4. Code review enforcing FSD import direction rules

---

## Appendix A: Hydration Directive Decision Matrix

| Component | Directive | Reason |
|---|---|---|
| `LanguageSwitcher` | `client:load` | User may need to switch language immediately on page load |
| `NavbarWidget` | `client:load` | Hamburger menu and scroll effects needed from page load |
| `SkillsSection` | `client:visible` | Infinite scroll animation only visible when scrolled to |
| `ExperienceSection` | `client:visible` | Timeline animation triggers on scroll; below the fold |
| `ProjectsSection` | `client:visible` | Project cards animate on scroll; below the fold |
| `CertificationsSection` | `client:visible` | Cert cards animate on scroll; below the fold |
| `AboutSection` | None (server-only) | GSAP via `<script is:inline>` -- no hydration needed |
| `EducationSection` | None (server-only) | GSAP via `<script is:inline>` -- no hydration needed |
| `HeroSection` | None (server-only) | GSAP via `<script is:inline>` -- no hydration needed |
| `FooterWidget` | None (server-only) | Pure static content -- no interactivity |

---

## Appendix B: File Move Checklist

```
[ ] src/styles/global.css -> src/shared/styles/global.css
[ ] src/layouts/Layout.astro -> src/app/Layout.astro
[ ] src/components/ProjectCard.astro -> src/entities/Project/ProjectCard.astro
[ ] src/components/LuiferDev.astro -> src/entities/Profile/ProfileCard.astro
[ ] src/components/LanguageSwitcher.astro -> src/features/LanguageSwitcher/LanguageSwitcher.astro
[ ] src/components/Navbar.astro -> src/widgets/NavbarWidget/NavbarWidget.astro
[ ] src/components/Footer.astro -> src/widgets/FooterWidget/FooterWidget.astro
[ ] src/components/About.astro -> split -> src/widgets/AboutSection/ + src/entities/Profile/
[ ] src/components/Experience.astro -> split -> src/widgets/ExperienceSection/ + src/entities/Experience/
[ ] src/components/Education.astro -> split -> src/widgets/EducationSection/ + src/entities/Education/
[ ] src/components/Projects.astro -> src/widgets/ProjectsSection/ProjectsSection.astro
[ ] src/components/Certifications.astro -> split -> src/widgets/CertificationsSection/ + src/entities/Certification/
[ ] src/components/Skills.astro -> split -> src/widgets/SkillsSection/ + src/entities/Skill/
[ ] src/components/Welcome.astro -> DELETE (unused Astro starter)
[ ] Update src/pages/index.astro imports
[ ] Update src/pages/[locale]/index.astro imports
[ ] Update src/pages/projects/[locale]/[slug]/index.astro imports
[ ] Create all barrel export index.ts files
[ ] Remove src/components/ directory
[ ] Remove src/layouts/ directory
```

---

## Appendix C: Performance Targets

| Metric | Target | Measurement |
|---|---|---|
| Lighthouse Performance (Desktop) | >= 90 | `bun preview` + Lighthouse CLI |
| Lighthouse Performance (Mobile) | >= 80 | Lighthouse mobile emulation |
| First Contentful Paint | < 1.5s | Lighthouse on simulated 4G |
| Total JS (gzipped) | <= 100KB | `bun build` output analysis |
| CSS bundle size | <= pre-migration | `bun build` output analysis |
| Lighthouse Accessibility | >= 90 | Lighthouse audit |
| Lighthouse Best Practices | >= 90 | Lighthouse audit |
| Lighthouse SEO | >= 90 | Lighthouse audit |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-31 | AI Assistant | Initial design document derived from approved proposal and specifications |
