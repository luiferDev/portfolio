# Specifications: Improve Application Architecture

**Status**: Draft  
**Date**: 2026-03-31  
**Derived From**: [Proposal](../proposals/improve-application-architecture.md)  
**Project**: Portfolio Website (Astro 5 + Tailwind CSS 4)

---

## Table of Contents

1. [Overview](#overview)
2. [Functional Requirements](#functional-requirements)
   - [FR-1: Feature-Sliced Design Component Structure](#fr-1-feature-sliced-design-component-structure)
   - [FR-2: Separation of Presentation and Logic](#fr-2-separation-of-presentation-and-logic)
   - [FR-3: Tailwind CSS Standardization](#fr-3-tailwind-css-standardization)
   - [FR-4: Astro Islands Optimization](#fr-4-astro-islands-optimization)
   - [FR-5: Sentry Observability Integration](#fr-5-sentry-observability-integration)
   - [FR-6: Data Fetching and State Management Patterns](#fr-6-data-fetching-and-state-management-patterns)
3. [Non-Functional Requirements](#non-functional-requirements)
   - [NFR-1: Scalability](#nfr-1-scalability)
   - [NFR-2: Maintainability](#nfr-2-maintainability)
   - [NFR-3: Performance](#nfr-3-performance)
   - [NFR-4: Accessibility](#nfr-4-accessibility)
   - [NFR-5: Developer Experience](#nfr-5-developer-experience)
4. [Scenarios and Acceptance Criteria](#scenarios-and-acceptance-criteria)
   - [SC-1: Component Reorganization to FSD](#sc-1-component-reorganization-to-fsd)
   - [SC-2: Styling Migration from @apply to Utilities](#sc-2-styling-migration-from-apply-to-utilities)
   - [SC-3: Data Fetching Pattern Separation](#sc-3-data-fetching-pattern-separation)
   - [SC-4: Performance Optimization via Island Boundaries](#sc-4-performance-optimization-via-island-boundaries)
   - [SC-5: Error Handling with Sentry](#sc-5-error-handling-with-sentry)
5. [Edge Cases](#edge-cases)
6. [Constraints and Assumptions](#constraints-and-assumptions)
7. [Glossary](#glossary)

---

## Overview

This specifications document defines the functional and non-functional requirements for improving the portfolio website's application architecture. The initiative addresses five core areas: component structure (FSD), separation of concerns, styling consistency, performance optimization, and observability.

All requirements are derived from the approved proposal and are scoped to preserve existing functionality with zero regressions.

---

## Functional Requirements

### FR-1: Feature-Sliced Design Component Structure

**Priority**: High  
**Phase**: 1 (Architectural Foundation)

#### Description

Reorganize the `src/components` directory using Feature-Sliced Design (FSD) layers to establish clear boundaries and improve scalability.

#### Requirements

| ID | Requirement |
|----|-------------|
| FR-1.1 | The `src/components` directory SHALL be restructured into FSD layers: `shared`, `entities`, `features`, `widgets`, `pages`, and `app`. |
| FR-1.2 | Each FSD layer SHALL reside under a dedicated directory (e.g., `src/shared/`, `src/entities/`, `src/features/`, `src/widgets/`, `src/pages/`, `src/app/`). |
| FR-1.3 | Barrel exports (index files) SHALL be created for each layer and slice to simplify import paths. |
| FR-1.4 | All existing import paths across the codebase SHALL be updated to reference the new FSD structure. |
| FR-1.5 | Components SHALL be assigned to layers based on their responsibilities: |
| | - `shared/`: Reusable UI primitives with no business logic (e.g., icons, base buttons, typography) |
| | - `entities/`: Components tied to domain entities (e.g., `Project`, `Experience`, `Certification`) |
| | - `features/`: Interactive features or user actions (e.g., `LanguageSwitcher`, `ContactForm`) |
| | - `widgets/`: Composite sections combining multiple entities/features (e.g., `ProjectsSection`, `ExperienceSection`) |
| | - `pages/`: Page-level compositions (currently `src/pages/index.astro` content) |
| | - `app/`: Application-level setup (providers, global providers, layout wrappers) |

#### Acceptance Criteria

- [ ] AC-1.1: The directory structure contains all six FSD layers as subdirectories under `src/`.
- [ ] AC-1.2: Every existing component from `src/components/` is relocated to an appropriate FSD layer.
- [ ] AC-1.3: Each layer has an `index.ts` (or `index.astro`) barrel export file that re-exports its public API.
- [ ] AC-1.4: The project builds successfully (`bun build`) with zero import path errors.
- [ ] AC-1.5: The dev server starts without errors (`bun dev`).
- [ ] AC-1.6: No component in a lower-import layer (e.g., `shared`) imports from a higher-import layer (e.g., `widgets`).

---

### FR-2: Separation of Presentation and Logic

**Priority**: High  
**Phase**: 1 (Architectural Foundation)

#### Description

Refactor components that mix data fetching/logic with presentation to enforce a clear separation of concerns using Astro's props interface.

#### Requirements

| ID | Requirement |
|----|-------------|
| FR-2.1 | Components that currently fetch data via `getCollection()` or `getEntry()` from `astro:content` SHALL be split into: |
| | - A **container component** responsible for data fetching and passing data via props |
| | - A **presentational component** responsible solely for rendering UI, receiving data through typed props |
| FR-2.2 | Presentational components SHALL NOT import from `astro:content` or perform any data fetching. |
| FR-2.3 | All component props SHALL be defined using Zod-validated TypeScript interfaces that align with content collection schemas. |
| FR-2.4 | Data flow SHALL be unidirectional: containers fetch data -> pass to presentational components via props -> presentational components render. |

#### Acceptance Criteria

- [ ] AC-2.1: No presentational component directly calls `getCollection()` or `getEntry()`.
- [ ] AC-2.2: Every presentational component has a `Props` interface defined with explicit types.
- [ ] AC-2.3: Container components handle all `astro:content` imports and data fetching.
- [ ] AC-2.4: The `bun build` command completes with zero TypeScript errors under `astro/tsconfigs/strict`.
- [ ] AC-2.5: All existing page output is visually and functionally identical before and after refactoring.

---

### FR-3: Tailwind CSS Standardization

**Priority**: Medium  
**Phase**: 2 (Styling and Performance Optimization)

#### Description

Standardize Tailwind CSS usage across the project by preferring inline utility classes over `@apply` directives, reserving `@apply` only for truly reusable patterns in `global.css`.

#### Requirements

| ID | Requirement |
|----|-------------|
| FR-3.1 | Utility classes SHALL be applied directly in Astro component templates (inline). |
| FR-3.2 | The `@apply` directive SHALL be reserved exclusively for patterns that are: |
| | - Used across 3 or more components |
| | - Represent a cohesive design token (e.g., `.glass-card`, `.glass-panel`) |
| | - Cannot be practically expressed as inline utilities due to length or complexity |
| FR-3.3 | The existing `@apply` usages in `src/styles/global.css` for `p`, `body`, and `section` elements SHALL be audited and converted to inline utilities where they appear in fewer than 3 components. |
| FR-3.4 | Reusable glass-morphism patterns (`.glass-card`, `.glass-panel`, `.glass-nav`, `.glass-input`) SHALL remain as CSS classes in `global.css` since they represent cohesive design tokens. |
| FR-3.5 | All Tailwind classes SHALL be valid Tailwind CSS v4 utilities compatible with `@tailwindcss/vite`. |

#### Acceptance Criteria

- [ ] AC-3.1: No component template uses `@apply` within `<style>` blocks (all `@apply` must be in `global.css`).
- [ ] AC-3.2: The `p`, `body`, and `section` element-level `@apply` rules in `global.css` are either removed (if converted to inline) or justified with a comment explaining cross-component reuse.
- [ ] AC-3.3: The `bun build` command produces a CSS bundle with no unused critical CSS warnings for removed `@apply` rules.
- [ ] AC-3.4: Visual output of all components remains identical before and after migration (verified via manual inspection or screenshot comparison).
- [ ] AC-3.5: The `global.css` file contains only truly reusable patterns (used in 3+ components) for any remaining `@apply` usage.

---

### FR-4: Astro Islands Optimization

**Priority**: Medium  
**Phase**: 2 (Styling and Performance Optimization)

#### Description

Optimize Astro Islands architecture by analyzing hydration boundaries and applying appropriate client directives (`client:load`, `client:idle`, `client:visible`) to improve performance.

#### Requirements

| ID | Requirement |
|----|-------------|
| FR-4.1 | Each interactive component SHALL be analyzed to determine the optimal hydration directive based on its interaction priority. |
| FR-4.2 | Hydration directives SHALL be assigned as follows: |
| | - `client:load`: Components critical to initial user interaction (e.g., navigation, language switcher) |
| | - `client:idle`: Components that are interactive but not immediately needed (e.g., animations, non-critical interactions) |
| | - `client:visible`: Components that should hydrate only when scrolled into view (e.g., project cards, experience timelines) |
| | - No directive (server-only): Components that are purely static and require no client-side JavaScript |
| FR-4.3 | Components that do not require client-side JavaScript SHALL NOT have any hydration directive and SHALL remain server-rendered. |
| FR-4.4 | The total JavaScript bundle size sent to the client SHALL be measured and documented before and after optimization. |
| FR-4.5 | GSAP animations (loaded via CDN in Layout) SHALL be scoped to specific island boundaries to avoid unnecessary global hydration. |

#### Acceptance Criteria

- [ ] AC-4.1: Every interactive component has an explicit hydration directive or is documented as server-only.
- [ ] AC-4.2: The `LanguageSwitcher` component uses `client:load` (critical for immediate interaction).
- [ ] AC-4.3: Components below the fold (e.g., `Projects`, `Experience`, `Certifications`) use `client:visible` or `client:idle`.
- [ ] AC-4.4: The production build's total client-side JavaScript size is documented and compared to the pre-optimization baseline.
- [ ] AC-4.5: Lighthouse performance score for the production build is equal to or higher than the pre-optimization baseline.
- [ ] AC-4.6: All interactive functionality works correctly after hydration directive changes.

---

### FR-5: Sentry Observability Integration

**Priority**: Medium  
**Phase**: 3 (Observability and Maintainability)

#### Description

Integrate Sentry error tracking and performance monitoring for both build-time and runtime errors.

#### Requirements

| ID | Requirement |
|----|-------------|
| FR-5.1 | The Sentry SDK (`@sentry/astro`) SHALL be installed as a project dependency. |
| FR-5.2 | Sentry SHALL be configured as an Astro integration in `astro.config.mjs`. |
| FR-5.3 | Source maps SHALL be generated and uploaded to Sentry for accurate error reporting in production. |
| FR-5.4 | Error tracking SHALL capture both build-time errors (Astro build failures) and runtime errors (client-side JavaScript errors). |
| FR-5.5 | Performance monitoring SHALL be configured for key user interactions (page loads, navigation). |
| FR-5.6 | Sentry configuration SHALL use environment variables for the DSN and should gracefully handle missing DSN in development (no errors thrown if DSN is absent). |
| FR-5.7 | Sensitive data (PII, cookies, local storage) SHALL NOT be captured by Sentry (default scrubbing enabled). |

#### Acceptance Criteria

- [ ] AC-5.1: `@sentry/astro` is listed in `package.json` dependencies.
- [ ] AC-5.2: `astro.config.mjs` includes the Sentry integration with proper configuration.
- [ ] AC-5.3: Source maps are generated in the production build (`dist/` contains `.map` files or they are uploaded to Sentry).
- [ ] AC-5.4: A test error thrown in a client-side component is captured and visible in the Sentry dashboard.
- [ ] AC-5.5: The application starts successfully in development mode without a Sentry DSN configured (graceful degradation).
- [ ] AC-5.6: No sensitive user data appears in Sentry event payloads.

---

### FR-6: Data Fetching and State Management Patterns

**Priority**: Medium  
**Phase**: 1 (Architectural Foundation)

#### Description

Establish consistent patterns for data fetching and state management across the application, leveraging Astro's content collections and props system.

#### Requirements

| ID | Requirement |
|----|-------------|
| FR-6.1 | All content data SHALL be fetched via Astro's `getCollection()` or `getEntry()` from `astro:content` in container components or page-level frontmatter. |
| FR-6.2 | Content collection schemas in `src/content.config.ts` SHALL remain the single source of truth for data shape validation. |
| FR-6.3 | Zod schemas from content collections SHALL be reused to type component props where applicable (using `z.infer<typeof schema>`). |
| FR-6.4 | State management for interactive components SHALL use Astro's built-in props system for server-to-client data passing. |
| FR-6.5 | For client-side state in interactive components (e.g., language switcher), a lightweight approach SHALL be used (vanilla JS or minimal library) rather than a full state management library. |
| FR-6.6 | Error handling for content loading SHALL use descriptive error messages and fail-fast behavior at build time. |

#### Acceptance Criteria

- [ ] AC-6.1: All `getCollection()` and `getEntry()` calls are located in container components or page frontmatter, not in presentational components.
- [ ] AC-6.2: Component props that receive content data are typed using `z.infer` from the corresponding content schema.
- [ ] AC-6.3: The i18n content loading pattern (supporting `es`, `en`, `fr`) is preserved and functional.
- [ ] AC-6.4: Build-time errors for missing or invalid content display descriptive Zod validation messages.
- [ ] AC-6.5: No external state management library (Redux, Zustand, etc.) is introduced for this static portfolio.

---

## Non-Functional Requirements

### NFR-1: Scalability

**Priority**: High

#### Description

The architecture SHALL support easy addition of new features, sections, and content types without requiring structural refactoring.

#### Requirements

| ID | Requirement |
|----|-------------|
| NFR-1.1 | Adding a new content type SHALL require: (a) adding a Zod schema to `content.config.ts`, (b) creating a corresponding entity component in `entities/`, and (c) creating a widget in `widgets/`. No changes to other layers SHALL be required. |
| NFR-1.2 | Adding a new page section SHALL require creating a new widget component and composing it into the page layout. No modifications to existing widgets SHALL be required. |
| NFR-1.3 | The FSD layer boundaries SHALL prevent circular dependencies and enforce a clear dependency direction (lower layers cannot import from higher layers). |

#### Acceptance Criteria

- [ ] AC-NFR-1.1: A developer can add a new content type by modifying only `content.config.ts` and creating files in `entities/` and `widgets/` without touching other layers.
- [ ] AC-NFR-1.2: Adding a new section to the homepage requires only creating one widget component and adding one line to the page composition.
- [ ] AC-NFR-1.3: A static analysis tool or manual review confirms zero circular dependencies between FSD layers.

---

### NFR-2: Maintainability

**Priority**: High

#### Description

The codebase SHALL maintain low cognitive load for developers through clear boundaries, consistent patterns, and adequate documentation.

#### Requirements

| ID | Requirement |
|----|-------------|
| NFR-2.1 | Each component SHALL have a single responsibility and be no larger than 150 lines (excluding frontmatter imports). |
| NFR-2.2 | Complex component logic SHALL include JSDoc comments explaining the intent and data flow. |
| NFR-2.3 | All architectural decisions SHALL be documented in Architectural Decision Records (ADRs) stored in `docs/decisions/`. |
| NFR-2.4 | Import ordering within components SHALL follow the established convention: Astro built-ins -> external packages -> internal components -> styles. |
| NFR-2.5 | TypeScript strict mode (`astro/tsconfigs/strict`) SHALL be maintained with zero `any` types. |

#### Acceptance Criteria

- [ ] AC-NFR-2.1: No component file exceeds 150 lines of template code (frontmatter imports excluded).
- [ ] AC-NFR-2.2: Components with complex data transformations or conditional rendering have JSDoc comments.
- [ ] AC-NFR-2.3: At least one ADR exists documenting the FSD adoption decision.
- [ ] AC-NFR-2.4: All component files follow the import ordering convention.
- [ ] AC-NFR-2.5: `bun build` completes with zero TypeScript `any` type warnings under strict mode.

---

### NFR-3: Performance

**Priority**: High

#### Description

The application SHALL maintain fast load times and achieve strong Lighthouse scores across all key metrics.

#### Requirements

| ID | Requirement |
|----|-------------|
| NFR-3.1 | The production build SHALL achieve a Lighthouse Performance score of 90 or higher on desktop. |
| NFR-3.2 | The production build SHALL achieve a Lighthouse Performance score of 80 or higher on mobile. |
| NFR-3.3 | First Contentful Paint (FCP) SHALL be under 1.5 seconds on a simulated 4G connection. |
| NFR-3.4 | Total client-side JavaScript bundle size SHALL not exceed 100KB (gzipped) for the initial page load. |
| NFR-3.5 | Images SHALL be optimized using Astro's built-in image optimization (`sharp` integration). |
| NFR-3.6 | CSS SHALL be tree-shaken to include only used utilities in the production build. |

#### Acceptance Criteria

- [ ] AC-NFR-3.1: Lighthouse desktop performance score >= 90 for the production build.
- [ ] AC-NFR-3.2: Lighthouse mobile performance score >= 80 for the production build.
- [ ] AC-NFR-3.3: FCP < 1.5s as measured by Lighthouse on a simulated 4G connection.
- [ ] AC-NFR-3.4: Total JS bundle size (gzipped) for initial page load <= 100KB.
- [ ] AC-NFR-3.5: All images in the project use Astro's `<Image>` component or are processed through `sharp`.
- [ ] AC-NFR-3.6: The production CSS bundle size is reduced or equal to the pre-optimization baseline.

---

### NFR-4: Accessibility

**Priority**: High

#### Description

The application SHALL comply with WCAG 2.1 Level AA standards to ensure accessibility for all users.

#### Requirements

| ID | Requirement |
|----|-------------|
| NFR-4.1 | All interactive elements SHALL have appropriate `aria-label` attributes. |
| NFR-4.2 | Semantic HTML elements SHALL be used throughout (`<section>`, `<article>`, `<nav>`, `<main>`, `<header>`, `<footer>`, `<h1>`-`<h6>`). |
| NFR-4.3 | All images SHALL have descriptive `alt` text. |
| NFR-4.4 | Color contrast ratios SHALL meet WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text). |
| NFR-4.5 | Keyboard navigation SHALL be fully supported (tab order, focus indicators, skip links). |
| NFR-4.6 | The language switcher SHALL announce the current language to screen readers via `aria-current` or `aria-label`. |

#### Acceptance Criteria

- [ ] AC-NFR-4.1: Automated accessibility audit (e.g., axe-core) reports zero critical or serious violations.
- [ ] AC-NFR-4.2: All pages use semantic HTML structure with proper heading hierarchy (single `<h1>`, sequential `<h2>`-`<h6>`).
- [ ] AC-NFR-4.3: All `<img>` elements have non-empty `alt` attributes or `alt=""` for decorative images.
- [ ] AC-NFR-4.4: Color contrast audit passes all WCAG 2.1 AA thresholds.
- [ ] AC-NFR-4.5: Full keyboard navigation is possible without a mouse (tab, enter, escape, arrow keys where applicable).
- [ ] AC-NFR-4.6: Screen reader correctly announces the current language when using the language switcher.

---

### NFR-5: Developer Experience

**Priority**: Medium

#### Description

The architecture SHALL provide an easy onboarding experience with clear documentation and predictable patterns.

#### Requirements

| ID | Requirement |
|----|-------------|
| NFR-5.1 | An `ARCHITECTURE.md` document SHALL exist in the project root, explaining the FSD structure, layer responsibilities, and import rules. |
| NFR-5.2 | Contribution guidelines SHALL be documented, explaining how to add new components, content types, and features following the FSD approach. |
| NFR-5.3 | A Tailwind CSS usage guide SHALL document the inline utilities vs `@apply` decision criteria. |
| NFR-5.4 | An onboarding guide SHALL exist that allows a new developer to understand the project structure and make their first contribution within 30 minutes. |
| NFR-5.5 | All dev commands (`bun dev`, `bun build`, `bun preview`) SHALL work out of the box with no additional configuration. |

#### Acceptance Criteria

- [ ] AC-NFR-5.1: `ARCHITECTURE.md` exists and documents all six FSD layers with examples.
- [ ] AC-NFR-5.2: Contribution guidelines document exists and includes step-by-step instructions for adding a new component and a new content type.
- [ ] AC-NFR-5.3: Tailwind usage guide documents the criteria for when to use inline utilities vs `@apply`.
- [ ] AC-NFR-5.4: A developer unfamiliar with the project can complete a documented onboarding task within 30 minutes.
- [ ] AC-NFR-5.5: Running `bun install && bun dev` on a fresh clone starts the dev server without errors.

---

## Scenarios and Acceptance Criteria

### SC-1: Component Reorganization to FSD

**Scenario**: A developer reorganizes the existing flat `src/components/` directory into the FSD layered structure.

#### Pre-conditions
- All 12 existing components exist in `src/components/` (About, Certifications, Education, Experience, Footer, LanguageSwitcher, LuiferDev, Navbar, ProjectCard, Projects, Skills, Welcome).
- The project builds and runs successfully in the current structure.

#### Steps
1. Create the FSD directory structure: `src/shared/`, `src/entities/`, `src/features/`, `src/widgets/`, `src/pages/`, `src/app/`.
2. Analyze each existing component and assign it to the appropriate FSD layer.
3. Move each component file to its target layer directory.
4. Create barrel export files (`index.ts` or `index.astro`) for each layer.
5. Update all import paths in pages, layouts, and other components.
6. Run `bun build` and verify zero errors.
7. Run `bun dev` and verify all pages render correctly.

#### Expected Component Mapping

| Component | FSD Layer | Rationale |
|-----------|-----------|-----------|
| `LuiferDev.astro` | `entities/` | Represents the core domain entity (the developer/portfolio owner) |
| `ProjectCard.astro` | `entities/` | Represents a project entity display component |
| `Experience.astro` | `entities/` | Represents a work experience entity display |
| `About.astro` | `entities/` | Represents the about/profile entity |
| `Skills.astro` | `entities/` | Represents the skills entity |
| `Education.astro` | `entities/` | Represents the education entity |
| `Certifications.astro` | `entities/` | Represents the certifications entity |
| `Projects.astro` | `widgets/` | Composite section displaying multiple project entities |
| `Welcome.astro` | `widgets/` | Composite hero/welcome section |
| `Navbar.astro` | `widgets/` | Composite navigation widget |
| `Footer.astro` | `widgets/` | Composite footer widget |
| `LanguageSwitcher.astro` | `features/` | Interactive feature for language switching |
| `Layout.astro` | `app/` | Application-level layout wrapper |

#### Acceptance Criteria
- [ ] AC-SC-1.1: All components are relocated to their correct FSD layers per the mapping table.
- [ ] AC-SC-1.2: Barrel exports exist for each layer and re-export all public components.
- [ ] AC-SC-1.3: `bun build` completes with zero import resolution errors.
- [ ] AC-SC-1.4: `bun preview` renders all sections identically to the pre-refactor version.
- [ ] AC-SC-1.5: No component in `shared/` imports from `entities/`, `features/`, `widgets/`, `pages/`, or `app/`.
- [ ] AC-SC-1.6: No component in `entities/` imports from `features/`, `widgets/`, `pages/`, or `app/`.

#### Edge Cases
- **EC-1.1**: If a component is used across multiple layers, it SHALL be placed in the lowest applicable layer and imported upward.
- **EC-1.2**: If a component does not clearly fit a single layer, it SHALL be split into smaller components that each fit a layer.
- **EC-1.3**: If barrel exports create circular re-exports, the circular dependency SHALL be resolved by restructuring the exports.

---

### SC-2: Styling Migration from @apply to Utilities

**Scenario**: A developer migrates `@apply` directives from component-level `<style>` blocks and element-level rules in `global.css` to inline Tailwind utility classes.

#### Pre-conditions
- `global.css` contains `@apply` rules for `p`, `body`, and `section` elements.
- Components may contain `<style>` blocks with `@apply` directives.
- Glass-morphism classes (`.glass-card`, `.glass-panel`, `.glass-nav`, `.glass-input`) exist in `global.css`.

#### Steps
1. Audit all `@apply` usages across the codebase (components and `global.css`).
2. For each `@apply` usage, count the number of components that use the affected element/class.
3. If used in fewer than 3 components, convert to inline utility classes in each component's template.
4. If used in 3+ components and represents a cohesive design token, keep as a CSS class in `global.css`.
5. Remove element-level `@apply` rules from `global.css` that have been converted to inline.
6. Run `bun build` and verify the CSS bundle is correct.
7. Visually verify all components render identically.

#### Acceptance Criteria
- [ ] AC-SC-2.1: No component `<style>` block contains `@apply` directives.
- [ ] AC-SC-2.2: The `p { @apply text-gray-300 pb-4; }` rule is either removed (if `p` elements receive inline utilities) or retained with a justification comment.
- [ ] AC-SC-2.3: The `body { @apply grid; }` rule is either removed or retained with a justification comment.
- [ ] AC-SC-2.4: The `section { @apply mt-12; }` rule is either removed or retained with a justification comment.
- [ ] AC-SC-2.5: Glass-morphism classes remain in `global.css` as they are used across multiple components.
- [ ] AC-SC-2.6: Visual output is identical before and after migration.

#### Edge Cases
- **EC-2.1**: If an `@apply` rule contains a complex combination of utilities that would make the template unreadable, it MAY be kept as a CSS class with a comment explaining the exception.
- **EC-2.2**: If removing an element-level rule breaks a component that relied on the cascade, the component MUST be updated with explicit inline utilities.
- **EC-2.3**: Tailwind CSS v4 may handle some utilities differently than v3; all migrated classes MUST be validated against v4 syntax.

---

### SC-3: Data Fetching Pattern Separation

**Scenario**: A developer identifies components that mix data fetching with presentation and refactors them into container/presentational pairs.

#### Pre-conditions
- Components like `Projects.astro`, `Experience.astro`, `Certifications.astro` may directly call `getCollection()` in their frontmatter.
- Content collection schemas are defined in `src/content.config.ts`.

#### Steps
1. Identify all components that call `getCollection()` or `getEntry()` in their frontmatter.
2. For each identified component, create a container component that:
   - Imports `getCollection()`/`getEntry()` from `astro:content`
   - Fetches the required data
   - Passes the data as props to the presentational component
3. Refactor the original component to be purely presentational:
   - Remove all `astro:content` imports
   - Define a typed `Props` interface
   - Render UI based solely on received props
4. Update page-level imports to use the container component.
5. Run `bun build` and verify zero TypeScript errors.
6. Verify i18n content loading still works for all locales (`es`, `en`, `fr`).

#### Acceptance Criteria
- [ ] AC-SC-3.1: No presentational component imports from `astro:content`.
- [ ] AC-SC-3.2: Each container component has a clear naming convention (e.g., `ProjectsContainer.astro` or data fetching in page frontmatter).
- [ ] AC-SC-3.3: All presentational components have explicit `Props` interfaces.
- [ ] AC-SC-3.4: Props types are derived from content collection schemas using `z.infer`.
- [ ] AC-SC-3.5: The i18n routing and content loading works correctly for all three locales.
- [ ] AC-SC-3.6: Build-time Zod validation errors display meaningful messages for invalid content.

#### Edge Cases
- **EC-3.1**: If a component needs data from multiple collections, the container SHALL fetch all required data and pass it as separate props.
- **EC-3.2**: If a component is used in multiple pages with different data requirements, it SHALL accept flexible props with optional fields.
- **EC-3.3**: If content collection data is needed at the page level (e.g., for SEO metadata), data fetching SHALL remain in page frontmatter rather than creating a container.

---

### SC-4: Performance Optimization via Island Boundaries

**Scenario**: A developer analyzes and optimizes Astro Islands hydration boundaries to minimize client-side JavaScript.

#### Pre-conditions
- The current application may have components with suboptimal or missing hydration directives.
- GSAP animations are loaded via CDN in the Layout component.
- The `LanguageSwitcher` requires client-side interactivity.

#### Steps
1. Audit all components for client-side JavaScript requirements.
2. Categorize each component:
   - **Server-only**: No client-side JS needed (pure static content)
   - **client:load**: Critical interactivity needed immediately
   - **client:idle**: Interactivity needed but not immediately
   - **client:visible**: Interactivity needed when scrolled into view
3. Apply the appropriate hydration directive to each interactive component.
4. Ensure GSAP animations are scoped to specific components rather than globally.
5. Measure the total client-side JS bundle size before and after.
6. Run Lighthouse audit and compare scores.

#### Acceptance Criteria
- [ ] AC-SC-4.1: Each interactive component has an explicit hydration directive.
- [ ] AC-SC-4.2: `LanguageSwitcher` uses `client:load`.
- [ ] AC-SC-4.3: `Projects`, `Experience`, `Certifications` sections use `client:visible` or `client:idle`.
- [ ] AC-SC-4.4: Static components (e.g., `About`, `Education`, `Skills` if non-interactive) have no hydration directive.
- [ ] AC-SC-4.5: Client-side JS bundle size is documented and shows improvement or no regression.
- [ ] AC-SC-4.6: Lighthouse performance score meets or exceeds NFR-3 targets.

#### Edge Cases
- **EC-4.1**: If a component has both static and interactive parts, it SHOULD be split so only the interactive part is hydrated.
- **EC-4.2**: If `client:visible` causes a flash of unstyled content (FOUC), fallback to `client:idle` with a loading state.
- **EC-4.3**: GSAP animations that depend on DOM elements must ensure those elements exist before animation initialization (use `client:visible` with intersection observer or `client:idle`).

---

### SC-5: Error Handling with Sentry

**Scenario**: A developer integrates Sentry for error tracking and performance monitoring in the Astro application.

#### Pre-conditions
- No error tracking is currently configured.
- The application has both server-rendered (Astro) and client-rendered (islands) code.
- Environment variables are not yet configured for Sentry DSN.

#### Steps
1. Install `@sentry/astro` via `bun add @sentry/astro`.
2. Configure Sentry integration in `astro.config.mjs` with environment-based DSN.
3. Enable source map generation and upload in the build configuration.
4. Configure performance monitoring with appropriate tracing sample rate.
5. Set up environment variable handling (`SENTRY_DSN`) with graceful fallback for development.
6. Test error capture by throwing a test error in a client-side component.
7. Verify errors appear in the Sentry dashboard.
8. Verify no sensitive data is captured.

#### Acceptance Criteria
- [ ] AC-SC-5.1: `@sentry/astro` is installed and listed in `package.json`.
- [ ] AC-SC-5.2: `astro.config.mjs` includes Sentry integration with conditional DSN loading.
- [ ] AC-SC-5.3: Source maps are generated in production builds.
- [ ] AC-SC-5.4: A test error in a client-side island component is captured in Sentry.
- [ ] AC-SC-5.5: A test error in server-side Astro code is captured in Sentry.
- [ ] AC-SC-5.6: The application runs in development mode without a `SENTRY_DSN` environment variable (no crashes).
- [ ] AC-SC-5.7: Sentry configuration includes `tracesSampleRate` for performance monitoring.
- [ ] AC-SC-5.8: No cookies, tokens, or personally identifiable information appear in Sentry event payloads.

#### Edge Cases
- **EC-5.1**: If the Sentry DSN is invalid, the application SHALL NOT crash; errors SHALL be logged to console in development only.
- **EC-5.2**: If source map upload fails during CI/CD, the build SHALL NOT fail (source map upload should be non-blocking or have a `--allow-failure` flag).
- **EC-5.3**: In development mode, Sentry SHOULD NOT send events to the production Sentry project (use `SENTRY_ENVIRONMENT=development` or skip initialization).

---

## Edge Cases

### General Edge Cases

| ID | Scenario | Handling |
|----|----------|----------|
| EC-GEN-1 | A component is needed in multiple FSD layers | Place in the lowest applicable layer; import upward only |
| EC-GEN-2 | A content collection schema changes | All components using `z.infer` of that schema must be re-typed; Zod validation catches mismatches at build time |
| EC-GEN-3 | A Tailwind v4 utility behaves differently than v3 | Audit all migrated utilities; update to v4 syntax; document deviations |
| EC-GEN-4 | An interactive component needs data from both server and client | Use Astro's props for server data; use client-side fetch or inline scripts for dynamic client data |
| EC-GEN-5 | Sentry rate limits are hit | Configure `beforeSend` to sample events; implement retry logic for critical errors only |
| EC-GEN-6 | i18n content is missing for a locale | Zod validation fails at build time with a descriptive error; the build does not produce broken pages |
| EC-GEN-7 | A glass-morphism class is needed in a new component | Add the class to the component's `class` attribute; no new CSS needed since it's already in `global.css` |
| EC-GEN-8 | Lighthouse scores regress after changes | Profile the regression source; revert the specific change causing regression; document the finding |

---

## Constraints and Assumptions

### Constraints

| ID | Constraint | Rationale |
|----|------------|-----------|
| C-1 | No visual redesign of the portfolio | Scope limited to architecture; UI/UX remains unchanged |
| C-2 | No migration to a different frontend framework | Astro 5 is the chosen framework |
| C-3 | No major changes to content structure or data models | Content collections schema remains largely unchanged |
| C-4 | No user authentication or backend services | This is a static portfolio site |
| C-5 | No changes to build configuration beyond architecture-related optimizations | Build tooling remains Astro + Vite + Tailwind |
| C-6 | No internationalization improvements beyond existing i18n setup | Existing 3-locale setup is sufficient |
| C-7 | TypeScript strict mode must be maintained | Project uses `astro/tsconfigs/strict` |
| C-8 | Package manager must remain `bun` | Project convention |

### Assumptions

| ID | Assumption | Risk if False |
|----|------------|---------------|
| A-1 | All existing functionality is correct and working | Refactoring may introduce regressions if current behavior is buggy |
| A-2 | The developer has access to a Sentry account/project | Sentry integration cannot be fully tested without an account |
| A-3 | Lighthouse can be run against the production build | Performance targets cannot be verified without Lighthouse |
| A-4 | The current content collections contain valid data | Build may fail if content data is invalid |
| A-5 | GSAP CDN loading in Layout is the only client-side animation dependency | Additional animation libraries would require separate optimization |

---

## Glossary

| Term | Definition |
|------|------------|
| **FSD** | Feature-Sliced Design - a methodology for organizing frontend application code into layers with clear boundaries |
| **Astro Island** | An interactive UI component within an otherwise static Astro page that is hydrated with client-side JavaScript |
| **Hydration Directive** | An Astro directive (`client:load`, `client:idle`, `client:visible`, `client:only`) that controls when a component's JavaScript is loaded |
| **Container Component** | A component responsible for data fetching, state management, and passing data to presentational components |
| **Presentational Component** | A component responsible solely for rendering UI based on received props, with no data fetching or state management |
| **Barrel Export** | An `index.ts` or `index.astro` file that re-exports modules from a directory for cleaner imports |
| **@apply** | A Tailwind CSS directive that applies utility classes within a CSS rule |
| **Zod** | A TypeScript-first schema validation library used by Astro for content collection validation |
| **Sentry DSN** | Data Source Name - the unique identifier for a Sentry project used to send error reports |
| **WCAG 2.1 AA** | Web Content Accessibility Guidelines version 2.1, Level AA conformance |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-31 | AI Assistant | Initial specification derived from approved proposal |
