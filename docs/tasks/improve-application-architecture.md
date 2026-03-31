# Task Breakdown: Improve Application Architecture

**Status**: Draft  
**Date**: 2026-03-31  
**Derived From**: [Proposal](../proposals/improve-application-architecture.md) | [Specifications](../specs/improve-application-architecture.md) | [Design](../design/improve-application-architecture.md)  
**Project**: Portfolio Website (Astro 5 + Tailwind CSS 4)

---

## Table of Contents

1. [Phase 1: Architectural Foundation](#phase-1-architectural-foundation)
2. [Phase 2: Styling & Performance](#phase-2-styling--performance)
3. [Phase 3: Observability & Maintainability](#phase-3-observability--maintainability)
4. [Phase 4: Documentation](#phase-4-documentation)
5. [Summary](#summary)

---

## Phase 1: Architectural Foundation

**Goal**: Establish Feature-Sliced Design (FSD) directory structure, migrate all components to their correct layers, and separate data-fetching logic from presentation.

**Specs Addressed**: FR-1, FR-2, FR-6, NFR-1, NFR-2

---

### T-1.1: Create FSD Directory Skeleton and Barrel Exports

**Description**: Create the six FSD layer directories under `src/` (`app/`, `entities/`, `features/`, `widgets/`, `shared/` with subdirectories `ui/`, `lib/`, `styles/`) and an empty `index.ts` barrel export file in each directory. Do NOT move any components yet -- this task is purely structural.

**Dependencies**: None (first task in the initiative)

**Estimated Effort**: S (15-30 minutes)

**Spec Requirements**: FR-1.1, FR-1.2, FR-1.3

**Acceptance Criteria**:
- [ ] AC-1.1.1: Directory `src/app/` exists
- [ ] AC-1.1.2: Directory `src/entities/` exists with subdirectories: `Project/`, `Experience/`, `Certification/`, `Education/`, `Skill/`, `Profile/`
- [ ] AC-1.1.3: Directory `src/features/` exists with subdirectory: `LanguageSwitcher/`
- [ ] AC-1.1.4: Directory `src/widgets/` exists with subdirectories: `HeroSection/`, `AboutSection/`, `ExperienceSection/`, `EducationSection/`, `ProjectsSection/`, `CertificationsSection/`, `SkillsSection/`, `NavbarWidget/`, `FooterWidget/`
- [ ] AC-1.1.5: Directory `src/shared/` exists with subdirectories: `ui/`, `lib/`, `styles/`
- [ ] AC-1.1.6: Each layer directory contains an `index.ts` barrel export file (empty or with placeholder exports)
- [ ] AC-1.1.7: Each subdirectory contains an `index.ts` barrel export file
- [ ] AC-1.1.8: `bun build` succeeds (no components moved yet, existing structure untouched)
- [ ] AC-1.1.9: `bun dev` starts without errors

---

### T-1.2: Move Shared Assets (global.css and i18n Re-export)

**Description**: Move `src/styles/global.css` to `src/shared/styles/global.css`. Create `src/shared/lib/i18n.ts` that re-exports from `src/i18n/config.ts`. Update `src/layouts/Layout.astro` to import CSS from the new path temporarily (will be moved fully in T-1.3).

**Dependencies**: T-1.1

**Estimated Effort**: S (15-30 minutes)

**Spec Requirements**: FR-1.2, FR-1.4, FR-1.5 (shared layer definition)

**Acceptance Criteria**:
- [ ] AC-1.2.1: `src/shared/styles/global.css` exists with identical content to the original
- [ ] AC-1.2.2: `src/shared/lib/i18n.ts` exists and re-exports `languages`, `defaultLang`, `getLangFromUrl`, `useTranslations` from `src/i18n/config.ts`
- [ ] AC-1.2.3: `src/layouts/Layout.astro` imports CSS from `../shared/styles/global.css`
- [ ] AC-1.2.4: `bun build` succeeds with zero errors
- [ ] AC-1.2.5: `bun dev` starts and homepage renders identically

---

### T-1.3: Move Layout to App Layer

**Description**: Move `src/layouts/Layout.astro` to `src/app/Layout.astro`. Update its CSS import to use the new shared path (`../shared/styles/global.css`). Update all page files (`src/pages/index.astro`, `src/pages/[locale]/index.astro`, `src/pages/projects/[locale]/[slug]/index.astro`) to import Layout from the new location.

**Dependencies**: T-1.2

**Estimated Effort**: S (20-30 minutes)

**Spec Requirements**: FR-1.4, FR-1.5 (app layer definition)

**Acceptance Criteria**:
- [ ] AC-1.3.1: `src/app/Layout.astro` exists with correct content
- [ ] AC-1.3.2: `src/app/index.ts` barrel export re-exports Layout
- [ ] AC-1.3.3: All three page files import Layout from `../../app/` (or appropriate relative path)
- [ ] AC-1.3.4: `src/layouts/` directory is empty (ready for deletion later)
- [ ] AC-1.3.5: `bun build` succeeds
- [ ] AC-1.3.6: `bun preview` renders all three locales (`/`, `/en/`, `/fr/`) correctly

---

### T-1.4: Move Simple Entity Components (ProjectCard, LanguageSwitcher)

**Description**: Move components that are already purely presentational or clearly belong to a single layer without needing extraction:
- `src/components/ProjectCard.astro` -> `src/entities/Project/ProjectCard.astro`
- `src/components/LanguageSwitcher.astro` -> `src/features/LanguageSwitcher/LanguageSwitcher.astro`

Update import paths in all files that reference these components. Update barrel exports.

**Dependencies**: T-1.3

**Estimated Effort**: M (30-45 minutes)

**Spec Requirements**: FR-1.4, FR-1.5, FR-2.2

**Acceptance Criteria**:
- [ ] AC-1.4.1: `src/entities/Project/ProjectCard.astro` exists at new location
- [ ] AC-1.4.2: `src/features/LanguageSwitcher/LanguageSwitcher.astro` exists at new location
- [ ] AC-1.4.3: Barrel exports in `src/entities/Project/index.ts` and `src/features/LanguageSwitcher/index.ts` are correct
- [ ] AC-1.4.4: All import paths referencing ProjectCard and LanguageSwitcher are updated
- [ ] AC-1.4.5: `bun build` succeeds with zero import errors
- [ ] AC-1.4.6: LanguageSwitcher interactivity works in `bun preview`

---

### T-1.5: Move Widget Components (Navbar, Footer)

**Description**: Move composite widget components that do not need splitting:
- `src/components/Navbar.astro` -> `src/widgets/NavbarWidget/NavbarWidget.astro`
- `src/components/Footer.astro` -> `src/widgets/FooterWidget/FooterWidget.astro`

Update their internal imports (e.g., Navbar imports LanguageSwitcher from the new features path). Update Layout.astro to import NavbarWidget from the new location. Update barrel exports.

**Dependencies**: T-1.4

**Estimated Effort**: M (30-45 minutes)

**Spec Requirements**: FR-1.4, FR-1.5 (widgets layer definition)

**Acceptance Criteria**:
- [ ] AC-1.5.1: `src/widgets/NavbarWidget/NavbarWidget.astro` exists at new location
- [ ] AC-1.5.2: `src/widgets/FooterWidget/FooterWidget.astro` exists at new location
- [ ] AC-1.5.3: NavbarWidget imports LanguageSwitcher from `../../features/LanguageSwitcher`
- [ ] AC-1.5.4: `src/app/Layout.astro` imports NavbarWidget from `../widgets/NavbarWidget`
- [ ] AC-1.5.5: Barrel exports are correct for both widgets
- [ ] AC-1.5.6: `bun build` succeeds
- [ ] AC-1.5.7: Navigation and footer render correctly in all locales

---

### T-1.6: Extract Entity Card Components from Mixed Components

**Description**: Extract presentational card/item components from the existing mixed (data-fetching + presentation) components. These are the entity-layer components that will later receive data via props:
- Extract `ExperienceCard.astro` from `src/components/Experience.astro` -> `src/entities/Experience/ExperienceCard.astro`
- Extract `CertificationCard.astro` from `src/components/Certifications.astro` -> `src/entities/Certification/CertificationCard.astro`
- Extract `EducationItem.astro` from `src/components/Education.astro` -> `src/entities/Education/EducationItem.astro`
- Extract `SkillBadge.astro` from `src/components/Skills.astro` -> `src/entities/Skill/SkillBadge.astro`
- Extract `ProfileAbout.astro` from `src/components/About.astro` -> `src/entities/Profile/ProfileAbout.astro`

Each extracted component must:
- Have NO `astro:content` imports
- Define a typed `Props` interface
- Render UI based solely on received props
- Use `z.infer` from content schemas for prop types where applicable

**Dependencies**: T-1.4

**Estimated Effort**: L (1-1.5 hours)

**Spec Requirements**: FR-2.1, FR-2.2, FR-2.3, FR-2.4, FR-6.3

**Acceptance Criteria**:
- [ ] AC-1.6.1: All five entity card components exist in their respective `src/entities/*/` directories
- [ ] AC-1.6.2: No extracted component imports from `astro:content`
- [ ] AC-1.6.3: Each extracted component has a typed `Props` interface
- [ ] AC-1.6.4: Props types use `z.infer` from content collection schemas where applicable
- [ ] AC-1.6.5: Barrel exports are correct for each entity subdirectory
- [ ] AC-1.6.6: `bunx tsc --noEmit` reports zero TypeScript errors
- [ ] AC-1.6.7: Original mixed components still build (they will be replaced in T-1.7)

---

### T-1.7: Create Section Widget Containers

**Description**: Create the widget-layer container components that handle data fetching and compose entity components. These replace the original mixed components:
- `src/widgets/HeroSection/HeroSection.astro` -- composes `entities/Profile/ProfileCard`
- `src/widgets/AboutSection/AboutSection.astro` -- fetches `getCollection('contents')`, renders `entities/Profile/ProfileAbout`
- `src/widgets/ExperienceSection/ExperienceSection.astro` -- fetches `getCollection('experiences')`, renders `entities/Experience/ExperienceCard`
- `src/widgets/EducationSection/EducationSection.astro` -- holds inline education data, renders `entities/Education/EducationItem`
- `src/widgets/ProjectsSection/ProjectsSection.astro` -- fetches `getCollection('projects')`, renders `entities/Project/ProjectCard`
- `src/widgets/CertificationsSection/CertificationsSection.astro` -- holds inline certification data, renders `entities/Certification/CertificationCard`
- `src/widgets/SkillsSection/SkillsSection.astro` -- holds inline skills data, renders `entities/Skill/SkillBadge`

Each widget container must:
- Handle its own data fetching (if needed) or accept pre-fetched data via props
- Import entity components from the correct FSD paths
- Preserve all existing GSAP animation logic (`<script is:inline>`)
- Preserve i18n logic for all three locales

**Dependencies**: T-1.5, T-1.6

**Estimated Effort**: L (1.5-2 hours)

**Spec Requirements**: FR-1.5 (widgets layer), FR-2.1, FR-2.4, FR-6.1, FR-6.4

**Acceptance Criteria**:
- [ ] AC-1.7.1: All seven widget containers exist in `src/widgets/*/`
- [ ] AC-1.7.2: Each widget imports entities from `../../entities/...` (not from `src/components/`)
- [ ] AC-1.7.3: Containers that fetch data import `getCollection`/`getEntry` from `astro:content`
- [ ] AC-1.7.4: GSAP animation scripts are preserved with correct CSS selectors
- [ ] AC-1.7.5: i18n logic works for all three locales (`es`, `en`, `fr`)
- [ ] AC-1.7.6: Barrel exports are correct for each widget subdirectory
- [ ] AC-1.7.7: `bun build` succeeds with zero errors
- [ ] AC-1.7.8: `bun preview` renders all sections correctly

---

### T-1.8: Move LuiferDev to Profile Entity and Create HeroSection

**Description**: Rename and move `src/components/LuiferDev.astro` to `src/entities/Profile/ProfileCard.astro` (the presentational hero/profile card). Create `src/widgets/HeroSection/HeroSection.astro` as the container that composes ProfileCard. Update all page files to import HeroSection instead of LuiferDev.

**Dependencies**: T-1.6

**Estimated Effort**: M (30-45 minutes)

**Spec Requirements**: FR-1.5, FR-2.1, FR-2.2

**Acceptance Criteria**:
- [ ] AC-1.8.1: `src/entities/Profile/ProfileCard.astro` exists (renamed from LuiferDev)
- [ ] AC-1.8.2: `src/widgets/HeroSection/HeroSection.astro` exists and composes ProfileCard
- [ ] AC-1.8.3: All page files import HeroSection from the widgets layer
- [ ] AC-1.8.4: ProfileCard has no `astro:content` imports (pure presentation)
- [ ] AC-1.8.5: `bun build` succeeds
- [ ] AC-1.8.6: Hero section renders identically to pre-migration

---

### T-1.9: Update All Page Imports and Validate Phase 1

**Description**: Update all remaining import paths in page files to use FSD layer paths. Delete old `src/components/` and `src/layouts/` directories. Delete unused `src/components/Welcome.astro`. Run full validation suite.

**Dependencies**: T-1.7, T-1.8

**Estimated Effort**: M (30-45 minutes)

**Spec Requirements**: FR-1.4, AC-1.1 through AC-1.6, AC-2.1 through AC-2.5

**Acceptance Criteria**:
- [ ] AC-1.9.1: `src/pages/index.astro` imports all components from FSD paths
- [ ] AC-1.9.2: `src/pages/[locale]/index.astro` imports all components from FSD paths
- [ ] AC-1.9.3: `src/pages/projects/[locale]/[slug]/index.astro` imports from FSD paths
- [ ] AC-1.9.4: `src/components/` directory is deleted
- [ ] AC-1.9.5: `src/layouts/` directory is deleted
- [ ] AC-1.9.6: `src/components/Welcome.astro` is deleted (unused Astro starter)
- [ ] AC-1.9.7: `bun build` succeeds with zero errors
- [ ] AC-1.9.8: `bun dev` starts without errors
- [ ] AC-1.9.9: `bun preview` renders all locales (`/`, `/en/`, `/fr/`) identically to pre-migration
- [ ] AC-1.9.10: `bunx tsc --noEmit` reports zero TypeScript errors
- [ ] AC-1.9.11: No component in a lower layer imports from a higher layer (manual review)
- [ ] AC-1.9.12: No presentational component imports from `astro:content`

---

## Phase 2: Styling & Performance

**Goal**: Standardize Tailwind CSS usage by converting `@apply` directives to inline utilities, and optimize Astro Islands hydration directives for performance.

**Specs Addressed**: FR-3, FR-4, NFR-3, NFR-4

---

### T-2.1: Audit @apply Usage Across Codebase

**Description**: Perform a comprehensive audit of all `@apply` directives in the codebase. Document each usage with: file path, selector, applied utilities, and count of components affected. Categorize each as "convert to inline" (used in <3 components) or "retain as design token" (used in 3+ components).

**Dependencies**: T-1.9 (Phase 1 complete -- all components in FSD structure)

**Estimated Effort**: S (20-30 minutes)

**Spec Requirements**: FR-3.1, FR-3.2, FR-3.3, FR-3.4

**Acceptance Criteria**:
- [ ] AC-2.1.1: Audit document lists every `@apply` usage in `src/shared/styles/global.css`
- [ ] AC-2.1.2: Audit document lists every `@apply` usage in component `<style>` blocks (if any)
- [ ] AC-2.1.3: Each usage is categorized as "convert" or "retain" with justification
- [ ] AC-2.1.4: Element-level rules (`p`, `body`, `section`) are identified for conversion
- [ ] AC-2.1.5: Design token classes (`.glass-card`, `.glass-panel`, `.glass-nav`, `.glass-input`) are identified for retention
- [ ] AC-2.1.6: Audit is saved as a comment block in `global.css` or as a separate note

---

### T-2.2: Convert Element-Level @apply to Inline Utilities

**Description**: Convert the following element-level `@apply` rules from `src/shared/styles/global.css` to inline Tailwind utility classes in each affected component:
- `p { @apply text-gray-300 pb-4; }` -> Add `class="text-gray-300 pb-4"` to each `<p>` element
- `body { @apply grid; }` -> Add `class="grid"` to `<body>` in Layout.astro
- `section { @apply mt-12; }` -> Add `class="mt-12"` to each `<section>`, `class="mt-0"` for `#hero`

Remove the converted rules from `global.css`. Preserve the `#hero { margin-top: 0; }` override by applying `mt-0` inline on the hero section.

**Dependencies**: T-2.1

**Estimated Effort**: M (45-60 minutes)

**Spec Requirements**: FR-3.1, FR-3.3, AC-3.1, AC-3.2, AC-3.4

**Acceptance Criteria**:
- [ ] AC-2.2.1: `global.css` no longer contains `p { @apply ... }`, `body { @apply ... }`, or `section { @apply ... }` rules
- [ ] AC-2.2.2: All `<p>` elements in components have explicit `class="text-gray-300 pb-4"` (or equivalent inline utilities)
- [ ] AC-2.2.3: `<body>` in `src/app/Layout.astro` has `class="grid"` added
- [ ] AC-2.2.4: All `<section>` elements have explicit `class="mt-12"` (or `mt-0` for hero)
- [ ] AC-2.2.5: No component `<style>` block contains `@apply` directives
- [ ] AC-2.2.6: `bun build` succeeds
- [ ] AC-2.2.7: Visual output is identical to pre-conversion (manual verification via `bun preview`)

---

### T-2.3: Verify and Document Retained Design Tokens

**Description**: Verify that the retained design token classes (`.glass-card`, `.glass-panel`, `.glass-nav`, `.glass-input`) in `src/shared/styles/global.css` are correctly used across components. Add JSDoc-style CSS comments above each retained class explaining why it is retained (cross-component usage count). Ensure all classes are valid Tailwind CSS v4 utilities.

**Dependencies**: T-2.2

**Estimated Effort**: S (15-20 minutes)

**Spec Requirements**: FR-3.4, FR-3.5, AC-3.5

**Acceptance Criteria**:
- [ ] AC-2.3.1: `.glass-card`, `.glass-panel`, `.glass-nav`, `.glass-input` remain in `global.css`
- [ ] AC-2.3.2: Each retained class has a comment explaining its reuse count (e.g., `/* Used in 4+ components -- design token */`)
- [ ] AC-2.3.3: All retained classes use valid Tailwind CSS v4 syntax
- [ ] AC-2.3.4: `bun build` produces CSS bundle with no warnings for retained classes
- [ ] AC-2.3.5: Components using glass classes render correctly in `bun preview`

---

### T-2.4: Audit and Assign Hydration Directives

**Description**: Audit every component in the FSD structure for client-side JavaScript requirements. Assign the appropriate hydration directive based on the decision matrix from the design document:

| Component | Directive | Reason |
|---|---|---|
| `LanguageSwitcher` | `client:load` | Critical -- needed immediately |
| `NavbarWidget` | `client:load` | Hamburger menu, scroll effects |
| `SkillsSection` | `client:visible` | Animation only when scrolled to |
| `ExperienceSection` | `client:visible` | Timeline animation below fold |
| `ProjectsSection` | `client:visible` | Project cards below fold |
| `CertificationsSection` | `client:visible` | Cert cards below fold |
| `AboutSection` | None (server-only) | GSAP via `<script is:inline>` |
| `EducationSection` | None (server-only) | GSAP via `<script is:inline>` |
| `HeroSection` | None (server-only) | GSAP via `<script is:inline>` |
| `FooterWidget` | None (server-only) | Pure static content |

Apply the directives to the component usages in page files and widget compositions.

**Dependencies**: T-1.9 (Phase 1 complete), T-2.3

**Estimated Effort**: M (30-45 minutes)

**Spec Requirements**: FR-4.1, FR-4.2, FR-4.3, AC-4.1, AC-4.2, AC-4.3

**Acceptance Criteria**:
- [ ] AC-2.4.1: `LanguageSwitcher` usage includes `client:load` directive
- [ ] AC-2.4.2: `NavbarWidget` usage includes `client:load` directive
- [ ] AC-2.4.3: `SkillsSection`, `ExperienceSection`, `ProjectsSection`, `CertificationsSection` usages include `client:visible` directive
- [ ] AC-2.4.4: `AboutSection`, `EducationSection`, `HeroSection`, `FooterWidget` have NO hydration directive
- [ ] AC-2.4.5: Each interactive component has an explicit hydration directive or is documented as server-only
- [ ] AC-2.4.6: `bun build` succeeds
- [ ] AC-2.4.7: All interactivity works correctly in `bun preview`

---

### T-2.5: Scope GSAP Animations to Island Boundaries

**Description**: Review all `<script is:inline>` blocks containing GSAP animations. Ensure each animation is scoped to its specific component/section using data attributes (e.g., `[data-about-heading]`, `[data-experience-item]`) rather than generic class selectors. Verify that GSAP animations do not depend on globally hydrated components.

**Dependencies**: T-2.4

**Estimated Effort**: M (30-45 minutes)

**Spec Requirements**: FR-4.5, AC-4.6

**Acceptance Criteria**:
- [ ] AC-2.5.1: All GSAP animations use data attributes or section-specific selectors (not global class names)
- [ ] AC-2.5.2: No GSAP animation script depends on a hydrated island being ready
- [ ] AC-2.5.3: GSAP CDN scripts are loaded in `src/app/Layout.astro` head (unchanged)
- [ ] AC-2.5.4: All animations trigger correctly on scroll in `bun preview`
- [ ] AC-2.5.5: Browser console shows no GSAP errors during animation playback

---

### T-2.6: Measure and Document Performance Baseline

**Description**: Build the production version and measure performance metrics. Document the baseline for comparison after Phase 3 and Phase 4 optimizations:
- Run `bun build` and record total JS bundle size
- Run `bun preview` and run Lighthouse audit (desktop + mobile)
- Record: Performance score, FCP, LCP, CLS, Total Blocking Time, JS bundle size (gzipped), CSS bundle size

**Dependencies**: T-2.5

**Estimated Effort**: S (20-30 minutes)

**Spec Requirements**: FR-4.4, NFR-3.1, NFR-3.2, NFR-3.3, NFR-3.4, AC-4.4, AC-4.5

**Acceptance Criteria**:
- [ ] AC-2.6.1: Production build (`bun build`) completes successfully
- [ ] AC-2.6.2: Lighthouse desktop audit results are documented (Performance score, FCP, LCP, CLS, TBT)
- [ ] AC-2.6.3: Lighthouse mobile audit results are documented
- [ ] AC-2.6.4: Total JS bundle size is recorded (raw and gzipped)
- [ ] AC-2.6.5: Total CSS bundle size is recorded
- [ ] AC-2.6.6: Performance targets are assessed against NFR-3 criteria (desktop >= 90, mobile >= 80, FCP < 1.5s, JS <= 100KB gzipped)
- [ ] AC-2.6.7: Results are saved in a performance baseline document or comment in the PR

---

## Phase 3: Observability & Maintainability

**Goal**: Integrate Sentry for error tracking and performance monitoring, improve TypeScript compliance, and create architectural decision records.

**Specs Addressed**: FR-5, NFR-2, NFR-5

---

### T-3.1: Install and Configure Sentry Integration

**Description**: Install `@sentry/astro` and configure it as an Astro integration in `astro.config.mjs`. Configuration must include:
- DSN from environment variable (`SENTRY_DSN`)
- Graceful degradation when DSN is absent (`enabled: !!import.meta.env.SENTRY_DSN`)
- Environment variable for environment name (`SENTRY_ENVIRONMENT`)
- Performance monitoring with `tracesSampleRate: 0.1`
- `beforeSend` hook to suppress events in development mode
- Source map generation enabled in Vite build config

**Dependencies**: T-1.9 (Phase 1 complete -- stable FSD structure)

**Estimated Effort**: M (30-45 minutes)

**Spec Requirements**: FR-5.1, FR-5.2, FR-5.3, FR-5.4, FR-5.5, FR-5.6, FR-5.7

**Acceptance Criteria**:
- [ ] AC-3.1.1: `@sentry/astro` is listed in `package.json` dependencies
- [ ] AC-3.1.2: `astro.config.mjs` includes Sentry integration with all required configuration
- [ ] AC-3.1.3: Vite build config includes `sourcemap: true`
- [ ] AC-3.1.4: `enabled` is set to `!!import.meta.env.SENTRY_DSN`
- [ ] AC-3.1.5: `tracesSampleRate` is set to `0.1`
- [ ] AC-3.1.6: `beforeSend` hook returns `null` in development mode
- [ ] AC-3.1.7: `bun build` succeeds with Sentry integration active
- [ ] AC-3.1.8: `bun dev` starts without errors when `SENTRY_DSN` is not set

---

### T-3.2: Set Up Environment Variables and Git Ignore

**Description**: Create `.env` (local development) and `.env.example` (template for CI/CD) files with Sentry configuration. Verify `.env` is in `.gitignore`. Document the environment variable requirements.

**Dependencies**: T-3.1

**Estimated Effort**: S (10-15 minutes)

**Spec Requirements**: FR-5.6, AC-5.5

**Acceptance Criteria**:
- [ ] AC-3.2.1: `.env` file exists with `SENTRY_DSN=` (empty) and `SENTRY_ENVIRONMENT=development`
- [ ] AC-3.2.2: `.env.example` file exists with documented variable descriptions
- [ ] AC-3.2.3: `.env` is listed in `.gitignore`
- [ ] AC-3.2.4: `bun dev` starts successfully with empty `SENTRY_DSN`
- [ ] AC-3.2.5: `bun build` succeeds with empty `SENTRY_DSN`

---

### T-3.3: Test Sentry Error Capture

**Description**: Verify that Sentry correctly captures both server-side and client-side errors:
1. Add a temporary test error in a client-side component (e.g., `LanguageSwitcher`)
2. Add a temporary test error in server-side code (e.g., page frontmatter)
3. Build for production: `bun build`
4. Preview: `bun preview`
5. Trigger the test errors and verify they appear in the Sentry dashboard
6. Verify source maps resolve correctly (stack traces show original file names and line numbers)
7. Remove test errors after verification

**Dependencies**: T-3.2

**Estimated Effort**: M (30-45 minutes)

**Spec Requirements**: FR-5.4, FR-5.5, AC-5.3, AC-5.4, AC-5.6, AC-5.7, AC-5.8

**Acceptance Criteria**:
- [ ] AC-3.3.1: A test client-side error is captured in Sentry dashboard
- [ ] AC-3.3.2: A test server-side error is captured in Sentry dashboard
- [ ] AC-3.3.3: Source maps resolve correctly (original file names and line numbers visible)
- [ ] AC-3.3.4: No sensitive data (cookies, tokens, PII) appears in Sentry event payloads
- [ ] AC-3.3.5: Test errors are removed after verification
- [ ] AC-3.3.6: `bun build` succeeds after test error removal

---

### T-3.4: Improve TypeScript Strictness Compliance

**Description**: Run `bunx tsc --noEmit` and fix all TypeScript strict mode violations introduced during the FSD migration. Ensure:
- Zero `any` types across the codebase
- All props interfaces are explicitly typed
- Content data types use `z.infer` from content schemas
- Optional chaining and nullish coalescing are used for nullable values
- All imports resolve correctly under strict mode

**Dependencies**: T-1.9 (Phase 1 complete)

**Estimated Effort**: M (45-60 minutes)

**Spec Requirements**: NFR-2.5, AC-2.4, AC-6.2, AC-6.4

**Acceptance Criteria**:
- [ ] AC-3.4.1: `bunx tsc --noEmit` completes with zero errors
- [ ] AC-3.4.2: Zero `any` types exist in the codebase (search for `: any`)
- [ ] AC-3.4.3: All component props interfaces are explicitly typed
- [ ] AC-3.4.4: Content data props use `z.infer` from `src/content.config.ts` schemas
- [ ] AC-3.4.5: Optional values use `?.` and `??` operators consistently
- [ ] AC-3.4.6: `bun build` succeeds under strict mode

---

### T-3.5: Add JSDoc Comments to Complex Components

**Description**: Add JSDoc comments to components with complex logic, data transformations, or conditional rendering. At minimum, document:
- Container widgets that fetch and filter content by locale
- Components with GSAP animation logic
- Components with i18n translation logic
- Any component exceeding 80 lines of frontmatter code

Each JSDoc should explain: what the component does, what props it expects, and any notable data flow or side effects.

**Dependencies**: T-1.9 (Phase 1 complete), T-3.4

**Estimated Effort**: M (30-45 minutes)

**Spec Requirements**: NFR-2.2, AC-NFR-2.2

**Acceptance Criteria**:
- [ ] AC-3.5.1: All container widgets with data fetching have JSDoc comments explaining the data flow
- [ ] AC-3.5.2: All components with GSAP animations have JSDoc comments explaining the animation triggers
- [ ] AC-3.5.3: Components with i18n logic have JSDoc comments explaining the locale handling
- [ ] AC-3.5.4: JSDoc comments follow a consistent format across the codebase
- [ ] AC-3.5.5: No component with complex logic lacks documentation

---

### T-3.6: Create Architectural Decision Records (ADRs)

**Description**: Create ADR documents in `docs/decisions/` for the key architectural decisions made in this initiative. At minimum, create:
- `ADR-001-fsd-adoption.md` -- Why FSD was chosen over Atomic Design, DDD folders, and flat structure
- `ADR-002-inline-tailwind-over-apply.md` -- Why inline utilities are preferred over `@apply`
- `ADR-003-sentry-integration.md` -- Why `@sentry/astro` was chosen and the configuration approach
- `ADR-004-container-presentational-astro.md` -- Why page frontmatter serves as the container layer

Each ADR should follow the standard format: Context, Decision, Consequences, Status.

**Dependencies**: T-3.4, T-3.5

**Estimated Effort**: M (45-60 minutes)

**Spec Requirements**: NFR-2.3, AC-NFR-2.3

**Acceptance Criteria**:
- [ ] AC-3.6.1: `docs/decisions/` directory exists
- [ ] AC-3.6.2: `ADR-001-fsd-adoption.md` exists with context, decision, consequences, and status
- [ ] AC-3.6.3: `ADR-002-inline-tailwind-over-apply.md` exists
- [ ] AC-3.6.4: `ADR-003-sentry-integration.md` exists
- [ ] AC-3.6.5: `ADR-004-container-presentational-astro.md` exists
- [ ] AC-3.6.6: Each ADR references the relevant spec requirements (FR-X, NFR-X)
- [ ] AC-3.6.7: All ADRs have status "Accepted"

---

## Phase 4: Documentation

**Goal**: Create comprehensive documentation for the new architecture, contribution guidelines, and onboarding materials.

**Specs Addressed**: NFR-5

---

### T-4.1: Create ARCHITECTURE.md

**Description**: Create `ARCHITECTURE.md` in the project root documenting the FSD structure. The document must include:
- Overview of the six FSD layers with responsibilities
- Directory structure tree
- Import direction rules (what each layer can and cannot import)
- Barrel export patterns with examples
- Component placement decision guide (how to decide which layer a new component belongs to)
- Hydration directive decision matrix
- Data flow diagram (page -> widget -> entity -> shared)

**Dependencies**: T-1.9 (Phase 1 complete), T-2.6 (performance baseline)

**Estimated Effort**: M (45-60 minutes)

**Spec Requirements**: NFR-5.1, AC-NFR-5.1

**Acceptance Criteria**:
- [ ] AC-4.1.1: `ARCHITECTURE.md` exists in the project root
- [ ] AC-4.1.2: All six FSD layers are documented with responsibilities and examples
- [ ] AC-4.1.3: Import direction rules are clearly stated with forbidden import table
- [ ] AC-4.1.4: Barrel export pattern is documented with code examples
- [ ] AC-4.1.5: Component placement decision guide exists (flowchart or decision tree)
- [ ] AC-4.1.6: Hydration directive decision matrix is included
- [ ] AC-4.1.7: Data flow diagram or description is included
- [ ] AC-4.1.8: Document references the ADRs in `docs/decisions/`

---

### T-4.2: Write Contribution Guidelines

**Description**: Create `CONTRIBUTING.md` (or update existing) with step-by-step instructions for:
- How to add a new component (which layer, naming convention, barrel export)
- How to add a new content type (schema in `content.config.ts`, entity component, widget)
- How to add a new page section (widget creation, page composition)
- How to add a new interactive feature (feature layer, hydration directive)
- Code style conventions (import ordering, TypeScript strictness, naming)
- How to run validation checks (`bun build`, `bunx tsc --noEmit`, `bun preview`)

**Dependencies**: T-4.1

**Estimated Effort**: M (30-45 minutes)

**Spec Requirements**: NFR-5.2, AC-NFR-5.2

**Acceptance Criteria**:
- [ ] AC-4.2.1: `CONTRIBUTING.md` exists (or is updated)
- [ ] AC-4.2.2: Step-by-step guide for adding a new component exists
- [ ] AC-4.2.3: Step-by-step guide for adding a new content type exists
- [ ] AC-4.2.4: Step-by-step guide for adding a new page section exists
- [ ] AC-4.2.5: Code style conventions are documented
- [ ] AC-4.2.6: Validation check commands are documented
- [ ] AC-4.2.7: Examples use actual project paths and component names

---

### T-4.3: Document Tailwind CSS Usage Standards

**Description**: Create a Tailwind CSS usage guide (can be a section in `ARCHITECTURE.md` or a separate `docs/guides/tailwind-usage.md`). Document:
- When to use inline utility classes (default approach)
- When to use `@apply` in `global.css` (design tokens, 3+ component usage)
- List of retained design token classes with their usage
- Migration rule for converting future `@apply` usages
- Tailwind CSS v4 specific syntax notes

**Dependencies**: T-2.3

**Estimated Effort**: S (20-30 minutes)

**Spec Requirements**: NFR-5.3, AC-NFR-5.3

**Acceptance Criteria**:
- [ ] AC-4.3.1: Tailwind usage guide document exists
- [ ] AC-4.3.2: Criteria for inline utilities vs `@apply` are clearly stated
- [ ] AC-4.3.3: List of retained design token classes is documented
- [ ] AC-4.3.4: Migration rule for future `@apply` usages is documented
- [ ] AC-4.3.5: Tailwind CSS v4 syntax notes are included

---

### T-4.4: Create Onboarding Guide

**Description**: Create `docs/guides/onboarding.md` that enables a new developer to understand the project and make their first contribution within 30 minutes. Include:
- Prerequisites (bun, Node.js version)
- Setup steps (`bun install`, environment variables)
- Project structure overview (with link to ARCHITECTURE.md)
- First contribution exercise (e.g., "Add a new skill to the SkillsSection")
- Common commands reference
- Troubleshooting section (common errors and solutions)

**Dependencies**: T-4.1, T-4.2

**Estimated Effort**: M (30-45 minutes)

**Spec Requirements**: NFR-5.4, AC-NFR-5.4

**Acceptance Criteria**:
- [ ] AC-4.4.1: `docs/guides/onboarding.md` exists
- [ ] AC-4.4.2: Prerequisites and setup steps are documented
- [ ] AC-4.4.3: Project structure overview is included (with link to ARCHITECTURE.md)
- [ ] AC-4.4.4: A first contribution exercise is included with step-by-step instructions
- [ ] AC-4.4.5: Common commands reference is included
- [ ] AC-4.4.6: Troubleshooting section exists with at least 3 common issues
- [ ] AC-4.4.7: A developer can follow the guide and complete the exercise in under 30 minutes

---

### T-4.5: Final Validation and Cleanup

**Description**: Perform a comprehensive final validation of the entire initiative. Run all validation checks, verify all acceptance criteria from the specs are met, and clean up any remaining artifacts:
- Verify no orphaned files in old directories
- Verify all barrel exports are correct and complete
- Run full Lighthouse audit and compare against baseline
- Verify Sentry integration in production mode
- Verify all three locales render correctly
- Create a final summary document

**Dependencies**: T-4.1, T-4.2, T-4.3, T-4.4

**Estimated Effort**: M (45-60 minutes)

**Spec Requirements**: All FR and NFR acceptance criteria

**Acceptance Criteria**:
- [ ] AC-4.5.1: `bun build` succeeds with zero errors and zero warnings
- [ ] AC-4.5.2: `bun dev` starts without errors
- [ ] AC-4.5.3: `bun preview` renders all three locales (`/`, `/en/`, `/fr/`) correctly
- [ ] AC-4.5.4: `bunx tsc --noEmit` reports zero errors
- [ ] AC-4.5.5: No orphaned files remain in `src/components/` or `src/layouts/`
- [ ] AC-4.5.6: All barrel exports are correct (no missing exports, no broken re-exports)
- [ ] AC-4.5.7: Lighthouse desktop performance score >= 90
- [ ] AC-4.5.8: Lighthouse mobile performance score >= 80
- [ ] AC-4.5.9: Lighthouse accessibility score >= 90
- [ ] AC-4.5.10: Sentry captures errors in production mode
- [ ] AC-4.5.11: No circular dependencies between FSD layers
- [ ] AC-4.5.12: Final summary document is created with initiative results

---

## Summary

### Task Count by Phase

| Phase | Task Count | Effort Breakdown |
|-------|-----------|------------------|
| **Phase 1: Architectural Foundation** | 9 tasks | 3x S, 3x M, 3x L |
| **Phase 2: Styling & Performance** | 6 tasks | 3x S, 3x M |
| **Phase 3: Observability & Maintainability** | 6 tasks | 2x S, 4x M |
| **Phase 4: Documentation** | 5 tasks | 1x S, 4x M |
| **Total** | **26 tasks** | **9x S, 13x M, 4x L** |

### Estimated Total Effort

| Effort Level | Count | Estimated Time |
|-------------|-------|----------------|
| S (15-30 min) | 9 | 2.25 - 4.5 hours |
| M (30-60 min) | 13 | 6.5 - 13 hours |
| L (60-120 min) | 4 | 4 - 8 hours |
| **Total** | **26** | **12.75 - 25.5 hours** |

**Estimated calendar time**: 7-10 working days (assuming 2-4 hours of focused work per day)

### Critical Path

The following tasks form the critical path -- each blocks the next and cannot be parallelized:

```
T-1.1 -> T-1.2 -> T-1.3 -> T-1.4 -> T-1.5 -> T-1.6 -> T-1.7 -> T-1.8 -> T-1.9
  -> T-2.1 -> T-2.2 -> T-2.3 -> T-2.4 -> T-2.5 -> T-2.6
  -> T-3.1 -> T-3.2 -> T-3.3
  -> T-4.5
```

**Longest single chain**: T-1.1 through T-1.9 (Phase 1) -- all 9 tasks are sequential because each depends on the previous directory/component state being stable.

### Parallelizable Tasks

The following tasks can be executed in parallel within their phases (once their dependencies are met):

**Within Phase 1** (after T-1.4 completes):
- T-1.5 (Move Navbar/Footer) and T-1.6 (Extract entity cards) can be done in parallel
- T-1.7 (Create section widgets) and T-1.8 (Move LuiferDev) can be done in parallel (both depend on T-1.6)

**Within Phase 2** (after T-2.1 completes):
- T-2.2 (Convert @apply) and T-2.4 (Audit hydration directives) can be done in parallel (T-2.4 only depends on T-1.9, not on T-2.2)
- T-2.3 (Verify design tokens) depends on T-2.2, but T-2.5 (Scope GSAP) can start as soon as T-2.4 is done

**Within Phase 3**:
- T-3.4 (TypeScript strictness) can be done in parallel with T-3.1 (Sentry install) -- they touch different files
- T-3.5 (JSDoc comments) can be done in parallel with T-3.3 (Sentry testing)
- T-3.6 (ADRs) can be done in parallel with T-3.4 and T-3.5

**Within Phase 4**:
- T-4.2 (Contribution guidelines) and T-4.3 (Tailwind guide) can be done in parallel after T-4.1
- T-4.4 (Onboarding guide) depends on T-4.1 and T-4.2 but can be done in parallel with T-4.3

**Cross-phase parallelism**:
- T-3.4 (TypeScript strictness) can start as soon as T-1.9 is complete -- does NOT need to wait for Phase 2
- T-3.6 (ADRs) can start as soon as T-1.9 is complete -- decisions are already made
- T-4.3 (Tailwind guide) can start as soon as T-2.3 is complete -- does NOT need to wait for Phase 3

### Entry and Exit Criteria by Phase

| Phase | Entry Criteria | Exit Criteria |
|-------|---------------|---------------|
| **Phase 1** | Current codebase builds and runs; all 12 components exist in `src/components/` | All components in FSD layers; `bun build` succeeds; zero TypeScript errors; all locales render correctly |
| **Phase 2** | Phase 1 complete; FSD structure stable | All `@apply` converted or justified; hydration directives assigned; performance baseline documented |
| **Phase 3** | Phase 1 complete (FSD stable); TypeScript compiles | Sentry captures errors; zero `any` types; ADRs created; JSDoc comments added |
| **Phase 4** | All previous phases complete; architecture stable | All documentation created; final validation passes; Lighthouse scores meet targets |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-31 | AI Assistant | Initial task breakdown derived from proposal, specifications, and design documents |
